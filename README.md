[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=syngenta-digital_alc-node&metric=alert_status)](https://sonarcloud.io/dashboard?id=syngenta-digital_alc-node) [![CircleCI](https://circleci.com/gh/syngenta/acai-js.svg?style=shield)](https://circleci.com/gh/syngenta/acai-js)

# AWS Lambda Client (ALC)
DRY, configurable, declarative node library for working with Amazon Web Service Lambdas.

## Features
* Highly configurable apigateway internal router
* Openapi schema adherence for all event types
* Extensible and customizable middleware for validation and other tasks
* DRY coding interfaces without the need of boilerplate
* Ease-of-use with the [serverless framework](https://www.serverless.com/)
* Local Development support
* Happy Path Programming (See Philosophy below)

## Philosophy

The ALC philosophy is to provide a dry, configurable, declarative library for use with the amazon lambdas, which encourages Happy Path Programming (HPP).

Happy Path Programming is an idea in which inputs are all validated before operated on. This ensures code follows the happy path without the need for mid-level, nested exceptions and all the nasty exception handling that comes with that. The library uses layers of customizable middleware options to allow a developer to easily dictate what constitutes a valid input, without nested conditionals, try/catch blocks or other coding blocks which distract from the happy path that covers the majority of that codes intended operation.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init`](https://docs.npmjs.com/creating-a-package-json-file) command.

Installation is done using the
[`npm install`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally) command:

```bash
$ npm install @syngenta-digital/alc
```

## Documentation & Examples

* [Full Docs](https://alc.syngenta-digital.com)
* [Tutorial](https://alc.syngenta-digital.com)
* [Examples](https://github.com/syngenta-digital/docs-markdown-alc/tree/main/examples/node)

## Testing

```bash
$ npm install
$ npm test
```
