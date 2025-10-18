# 🫐 Acai (JavaScript)

**Auto-loading, self-validating, minimalist JavaScript library for Amazon Web Service Lambdas**

[![CircleCI](https://circleci.com/gh/syngenta/acai-js.svg?style=shield)](https://circleci.com/gh/syngenta/acai-js)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=syngenta_acai-js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=syngenta_acai-js)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=syngenta_acai-js&metric=bugs)](https://sonarcloud.io/summary/new_code?id=syngenta_acai-js)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=syngenta_acai-js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=syngenta_acai-js)
[![Node.js](https://img.shields.io/badge/Node.js-22.19%2B-339933?logo=node.js)](https://nodejs.org/)
[![npm package](https://img.shields.io/npm/v/acai?color=blue&label=npm%20package)](https://www.npmjs.com/package/acai)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-blue.svg?style=flat)](https://github.com/syngenta/acai-js/issues)

Acai delivers a **DRY, configurable, declarative** experience for building AWS Lambda integrations in JavaScript. It encourages **Happy Path Programming**—validate inputs first, eliminate defensive code, and keep business logic focused on success paths.

> Need TypeScript bindings? Check out the companion package [**acai-ts**](https://www.npmjs.com/package/acai-ts) for a fully typed experience.

---

## 📖 Documentation

**[Full Documentation](https://syngenta.github.io/acai-js-docs/)** · **[Examples](https://github.com/syngenta/acai-js-docs/tree/main/examples)** · **[Tutorial](https://syngenta.github.io/acai-js-docs/)**

---

## 🎯 Why Acai?

- **🚀 Zero Boilerplate** – File-based routing auto-loads handlers with minimal configuration.
- **✅ Built-in Validation** – OpenAPI schema validation for API Gateway and event sources.
- **🧩 Extensible Middleware** – Compose `before`, `after`, `withAuth`, and `beforeAll/afterAll` hooks effortlessly.
- **🔄 Event Helpers** – Uniform abstractions for DynamoDB, S3, and SQS events with operation filtering.
- **🧪 Test Friendly** – Lightweight surface area and deterministic responses make unit tests straightforward.
- **🌐 Serverless Friendly** – Designed to slot into Serverless Framework, SAM, or raw Lambda stacks.

### Happy Path Programming (HPP)

Validate early, then write business logic without guardrails and nested try/catch blocks. Acai pushes error handling to the edges, keeping the core flow clean and intention-revealing.

---

## ⚡ Quick Start

```javascript
const {Router} = require('acai').apigateway;

const router = new Router({
    basePath: 'v1',
    handlerPath: 'src/handlers',          // auto-expanded to src/handlers/**/*.js
    schemaPath: 'openapi.yml',            // optional: enable OpenAPI validation
    autoValidate: true,                   // validate requests automatically
    validateResponse: true                // validate responses before returning
});

exports.handler = async (event) => {
    return await router.route(event);
};

// File: src/handlers/users/index.js
exports.requirements = {
    post: {
        requiredBody: 'CreateUserRequest'
    }
};

exports.post = async (request, response) => {
    response.body = {
        id: '123',
        email: request.body.email
    };
    return response;
};
```

### Pattern Routing via Globs

```javascript
const router = new Router({
    basePath: 'api/v1',
    handlerPattern: 'src/controllers/**/*.controller.js'
});
```

Both `handlerPath` and `handlerPattern` feed the same resolver. `handlerPath` is shorthand for directory-style routing (`**/*.js`), while `handlerPattern` supports custom naming conventions.

---

## 📦 Event Processing Examples

### DynamoDB Streams

```javascript
const {dynamodb} = require('acai');

exports.handler = async (event) => {
    const ddbEvent = new dynamodb.Event(event, {
        operations: ['create', 'update'],
        globalLogger: true
    });

    for (const record of ddbEvent.records) {
        console.log('Operation:', record.operation);
        console.log('New values:', record.body);
        console.log('Old values:', record.oldImage);
    }
};
```

### S3 Object Hydration

```javascript
const {s3} = require('acai');

exports.handler = async (event) => {
    const s3Event = new s3.Event(event, {
        getObject: true,
        isJSON: true
    });

    const records = await s3Event.getRecords();
    for (const record of records) {
        console.log('Bucket:', record.bucket.name);
        console.log('Key:', record.key);
        console.log('Parsed body:', record.body);
    }
};
```

---

## 📦 Installation

```bash
npm install acai
```

### Requirements

- **Node.js**: ≥ 22.19.0

---

## 🧪 Testing

```bash
npm install
npm test
```

---

## 🤝 Contributing

We welcome issues, feature requests, and pull requests! Please review the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) before you start. If you release a bug fix or enhancement, add an entry to `CHANGELOG.md` describing the change.

## 🧭 Agent Resources

- [.agents/AGENTS.md](.agents/AGENTS.md) – Contributor quick-start for day-to-day workflows and expectations.
- [.agents/ARCHITECTURE.md](.agents/ARCHITECTURE.md) – High-level design notes for the runtime and adapters.
- [.agents/WARP.md](.agents/WARP.md) – Operational guidance and runbooks for automation agents.

---

## 📦 Related Packages

- [**acai-ts**](https://www.npmjs.com/package/acai-ts) – TypeScript-first implementation with decorators and type metadata.
