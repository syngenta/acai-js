# Architecture Overview

## Tech Stack
- Node.js library targeting AWS Lambda environments; requires Node >=18.18.2 via `package.json` engines.
- Runtime dependencies center on schema validation and AWS parsing (`ajv`, `json-schema-merge-allof`, `@apideck/reva`, `js-yaml`, `json-schema-ref-parser`, `csv-parse`, `glob`, `xml2js`).
- Testing stack uses Mocha + Chai + Sinon with NYC for coverage; linting via ESLint configured with Prettier integration.

## Package Layout
- `src/index.js` re-exports the high-level entry points for API Gateway, DynamoDB, S3, SQS, and logging helpers.
- `src/apigateway/` hosts the HTTP-facing pipeline: request/response wrappers, router orchestration, resolvers, error types, and endpoint abstraction.
- `src/common/` contains cross-cutting utilities (event dispatch, schema/validator helpers, logger, timer).
- `src/{dynamodb,s3,sqs}/record.js` wrap native event payloads with consistent accessors and validity flags for downstream processing.
- `test/` mirrors the source layout with extensive integration-style coverage and fixture data under `test/mocks/`.
- First-party TypeScript declarations now live in the dedicated [`acai-ts`](https://www.npmjs.com/package/acai-ts) package.

## API Gateway Pipeline
### Router Lifecycle (`src/apigateway/router.js`)
1. Builds `Request` and `Response` wrappers for each invocation.
2. Uses `RouteResolver` to locate an endpoint module and gather any declared requirements.
3. Runs configured middleware hooks (`beforeAll`, `withAuth`, endpoint-level `before`/`after`, `afterAll`).
4. Applies validation either automatically against OpenAPI (`autoValidate=true`) or via explicit requirements (headers, query params, bodies).
5. Executes the endpoint handler, optionally enforcing timeouts through `Timer` and surfacing `ApiTimeout` errors.
6. Validates responses when requested (`validateResponse`) before returning the serialized payload.

### Route Resolution Strategies (`src/apigateway/resolver/`)
- **DirectoryResolver**: maps HTTP paths onto a handler directory tree, supporting dynamic `{param}` segments and default `index.js` fallbacks.
- **PatternResolver**: resolves files via glob-style patterns (e.g., `**/*.controller.js`), handling dynamic segments and MVVM-style folders.
- **ListResolver**: takes an explicit method::route map for full control, validating uniqueness and method formatting.
- `ResolverCache` adds an LRU-style cache with configurable size/mode (`all`, `static`, `dynamic`).

### Validation & Error Surfacing
- `Validator` adapts schema requirements into `Response` errors, translating AJV and OpenAPI failures into `{errors: [{key_path, message}]}` payloads with HTTP 4xx/5xx codes.
- `Schema` manages OpenAPI loading (with optional `autoLoad`), dereferencing, `allOf` merging, and AJV validation, honoring `strictValidation` and `autoValidate` flags.
- Custom errors (`ApiError`, `ApiTimeout`) propagate expected status codes, while unexpected failures are logged and normalized to 500 responses (unless `outputError` opts into surfacing details).
- `Logger` instances can be injected globally (`globalLogger`) and accept callbacks for centralized log sinks; log verbosity is environment-driven (`MIN_LOG_LEVEL`).

## Event Abstractions (`src/common/event.js`)
- Wraps S3, SQS, and DynamoDB batch events into a unified interface with lazy validation.
- Supports optional S3 object hydration (`getObject`) with JSON or CSV decoding, `before` hooks, per-record schema validation, and operation filtering (`create|update|delete`).
- Allows swapping in custom data classes to further adapt records before handing them to business logic.

### Record Wrappers
- **DynamoDB**: exposes unmarshalled `newImage`/`oldImage`, operation inference, and metadata like stream type and region.
- **S3**: tracks bucket/object metadata, infers operations from event names, and stores hydrated bodies.
- **SQS**: parses JSON bodies, normalizes message attributes, and exposes receipt handles.

## Common Utilities
- `Timer` implements cancellable timeouts for the router.
- `logger` export provides both the class and a `setUpGlobal` helper for shared instances.
- `validator` logic is reused by both API Gateway and event-based flows to keep error shapes consistent.

## Testing & Tooling Notes
- Tests simulate full request flows (router modes, validation paths, error handling) ensuring middleware ordering and caching work as expected.
- Fixtures under `test/mocks/` supply mock events, OpenAPI specs, and handler modules for coverage across success and failure cases.

## Observations & Potential Follow-ups
- Document in release notes that TypeScript consumers should install `acai-ts` for maintained typings.
- `Event.__getObjectFromS3` returns only hydrated S3 records when `getObject` is enabled; confirm that mixed-source batches are unsupported or document that expectation.
