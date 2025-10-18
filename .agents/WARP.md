# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Testing & Quality
```bash
npm test                    # Run all tests with coverage (uses MIN_LOG_LEVEL=OFF)
npm run lint                # Lint source code with ESLint
npm run report              # Generate coverage report in lcov format
```

### Individual Test Execution
```bash
npx mocha test/src/specific-file.test.js         # Run specific test file
npx mocha "test/src/**/*router*.test.js"         # Run tests matching pattern
npx mocha test/src/apigateway/router.test.js     # Router-specific tests
npx mocha test/src/common/event.test.js          # Event processing tests
```

### Development Workflow
- Always run `npm run lint` after code changes
- Use `npm test` to verify all functionality before committing
- Test individual modules with specific Mocha commands when debugging

## Architecture Overview

Acai is a Node.js library for AWS Lambda that follows Happy Path Programming (HPP) - validating inputs upfront to avoid nested conditionals and exception handling.

### Core Module Structure

- **`src/index.js`** - Main exports (Router, Request/Response, Event, Record classes)
- **`src/apigateway/`** - HTTP pipeline: routing, validation, middleware, error handling
- **`src/common/`** - Shared utilities: Event class, logger, validator, timer
- **`src/{dynamodb,s3,sqs}/record.js`** - AWS service wrappers with `.isValid()` patterns

### Key Implementation Patterns

**Happy Path Programming:**
- Input validation occurs before processing (not during)
- Use `.isValid()` methods on Record classes before business logic
- Middleware validates before handlers execute
- Consistent error shapes: `{errors: [{key_path, message}]}`

### API Gateway Pipeline

The router (`src/apigateway/router.js`) follows this lifecycle:
1. Wraps raw Lambda events in `Request`/`Response` objects
2. Uses `RouteResolver` to locate handler modules via a pattern-based resolver (directory paths are auto-expanded to glob patterns)
3. Executes middleware hooks (`beforeAll` → `withAuth` → endpoint `before` → handler → endpoint `after` → `afterAll`)
4. Applies automatic OpenAPI validation when `autoValidate=true` or explicit requirements
5. Handles timeouts and error responses with consistent error shapes

### Router Configuration Example

```javascript
const router = new Router({
    basePath: 'v1',
    handlerPath: './endpoints',  // automatically treated as ./endpoints/**/*.js
    autoValidate: true,          // Enable OpenAPI validation
    validateResponse: true,      // Validate outbound responses  
    strictValidation: false,     // Allow additional properties
    outputError: false,          // Hide error details in production
    globalLogger: logger,        // Inject custom logger
    beforeAll: async (request) => { /* global middleware */ },
    withAuth: async (request) => { /* auth middleware */ }
});
```

### Route Resolution

- Provide `handlerPath` for directory-style routing (`GET /api/users/{id}` → `./endpoints/api/users/{id}/index.js`).
- Provide `handlerPattern` for custom globs (e.g., `**/*.controller.js`).
- Dynamic `{param}` segments and index fallbacks behave consistently across both inputs.

### Common Debugging Patterns

- Set `MIN_LOG_LEVEL=debug` to see validation details
- Use `outputError: true` in development to see full error messages
- Check `request.isValid()` and `response.isValid()` in handlers
- Examine `request.errors` array for validation failures

### Event Processing Usage

```javascript
// S3 Event with object hydration
const s3Event = new Event(event, {
    getObject: true,        // Hydrate S3 objects
    operations: ['create']  // Filter by operation type
});

// Process records after validation
if (s3Event.isValid()) {
    for (const record of s3Event.records) {
        // record.body contains parsed JSON/CSV
        await processS3Object(record);
    }
}
```

## Error Handling Patterns

**Validation Errors:**
```javascript
if (!request.isValid()) {
    return response.setErrors(request.errors).send(); // 400 response
}
```

**Custom Errors:**
```javascript
throw new ApiError('Resource not found', 404);
throw new ApiTimeout('Operation timed out');
```

## Testing Patterns

**Mock Setup:**
- Tests use `aws-sdk-mock` for AWS service mocking
- OpenAPI fixtures in `test/mocks/openapi.yml`
- Mock handlers in `test/mocks/endpoints/`

**Test Organization:**
- Mirror source structure: `test/src/apigateway/router.test.js`
- Integration-style tests covering full request flows
- Dedicated suites cover pattern routing, validation behaviour, and resolver caching
