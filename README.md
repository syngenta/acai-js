# AWS Lambda Client (alc)
Auto-loading, self-validating, minimalist node framework for Amazon Web Service Lambdas

## Features

  * Automatic routing based on folder structure
  * Focus remove unnecessary boilerplate from your development process
  * Ease-of-use with the [serverless framework](https://www.serverless.com/)
  * Local Development support

## Philosophy

The alc philosophy is to provide a self evident tool for use with the amazon lambdas.

The alc encourages you to use small, internally routed API lambdas in a normalized OOP way.

In addition, it makes this like routing and validating API requests less cumbersome and time consuming.   

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install @syngenta-digital/alc
```

## Basic Usage

Use alc to normalize your interactions with common events passed by AWS Lambdas and work with the events in a more OOP way.

### API Gateway Events

`NOTE`: This packages assumes you are using a monolithic internally routed the lambda with [serverless framework](https://www.serverless.com/) and folder structure which put all your endpoint files in one directory.

0. Setting Up the Monolithic Internally Routed Lambda

```yml
functions:
    v1-apigateway-handler:
        handler: application/v1/handler/apigateway/_router.route
        events:
            - http:
                path: /v1/
                method: ANY
            - http:
                path: /v1/{proxy+}
                method: ANY    
```

1. Initialize the Router

```javascript
const {Router} = require('@syngenta-digital/alc').apigateway;
exports.route = async (event) => {
    const router = new Router({
        event: event,
        basePath: 'alc-example/v1',
        handlerPath: 'application/v1/handler/apigateway',
        schemaPath: 'application/openapi.yml'
    });
    return router.route();
};
```

Option Name   | Required | Type   | Default | Description
:-----------  | :------- | :----- | :------ | :----------
`event`       | true     | object | n/a     | event object passed into lambda
`basePath`    | true     | string | n/a     | apigateway base path for the custom domain
`handlerPath` | true     | string | n/a     | project path of where the endpoint files
`schemaPath`  | false    | string | null    | path where your schema file can found (accepts JSON as well)
`beforeAll`   | false    | string | null    | before all middleware function to run before all routes (after validation occurs)
`afterAll`    | false    | string | null    | after all middleware function to run after all routes
`globalLogger`| false    | boolean| false   | will apply the logger function to the global scope (`global.logger`)

2. Create endpoint file with matching methods and requirements

```javascript
exports.requirements = {
    post: {
        requiredBody: 'v1-test-request'
    },
    get: {
        availableParams: ['test_id', 'fail_id']
    },
    patch: {
        requiredParams: ['test_id']
    },
    delete: {
        requiredParams: ['test_id'],
        requiredHeaders: ['x-delete-key']
    }
};

exports.post = (request, response) => {
    response.body = request.body;
    return response;
};

exports.get = (request, response) => {
    response.body = {status: true};
    return response;
};

exports.patch = (request, response) => {
    response.body = request.body;
    return response;
};

exports.delete = (request, response) => {
    response.body = {deleted: true};
    return response;
};
```
*** Endpoint Requirement Options ***

Option Name       | Type   | Description
:-----------      | :----- | :----------
`requiredBody`    | string | the components schema key name
`availableParams` | array  | list of available query string params for that method on that endpoint
`requiredParams`  | array  | list of required query string params for that method on that endpoint
`availableHeaders`| array  | list of available headers for that method on that endpoint
`requiredHeaders` | array  | list of required headers for that method on that endpoint

*** Request Properties ***

Property Name       | Description
:-----------        | :-------   
`method`            | method id of apigateway event
`resource`          | resource handle of apigateway event
`authorizer`        | authorizer of apigateway event (will default to use headers if using with [serverless offline](https://www.npmjs.com/package/serverless-offline))
`headers`           | headers of apigateway event
`params`            | query string params of apigateway event
`path`              | path arguments of apigateway event
`json`              | body of apigateway event parsed as JSON
`xml`               | body of apigateway event parsed as XML
`body`              | body of apigateway event will be parsed based on context headers
`request`           | full request broken down as an object literal

*** Request Properties ***

Property Name       | Description
:-----------        | :-------   
`method`            | method id of apigateway event
`resource`          | resource handle of apigateway event
`authorizer`        | authorizer of apigateway event (will default to use headers if using with [serverless offline](https://www.npmjs.com/package/serverless-offline))
`headers`           | headers of apigateway event
`params`            | query string params of apigateway event
`path`              | path arguments of apigateway event
`json`              | body of apigateway event parsed as JSON
`xml`               | body of apigateway event parsed as XML
`body`              | body of apigateway event will be parsed based on context headers
`request`           | full request broken down as an object literal

*** Response Properties ***

Property Name       | Description
:-----------        | :-------   
`headers`           | headers you want to send in response
`code`              | status code of response (will default to 204 if no content && will default 400 if errors found in response)
`authorizer`        | authorizer of apigateway event (will default to use headers if using with [serverless offline](https://www.npmjs.com/package/serverless-offline))
`hasErrors()`       | function will tell you if errors in the response
`setError()`        | function will set error key and message


### SQS Events

0. Setting Up your lambda to listen to the Queue

```yml
functions:
    v1-sqs-subscription:
        name: v1-sqs-subscription
        handler: application/v1/handler/sqs/listener.listen
        events:
            - sqs:
                arn:
                    Fn::GetAtt: [ ExampleQueue, 'Arn' ]
```

1. Initialize the Event and Iterate over the Records

```javascript
const EventClient = require('@syngenta-digital/alc').sqs.Event;

exports.listen = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
```
*** Event Client Properties ***

Property Name   | Description
:-----------    | :-------   
`records`       | list of record objects
`rawRecords`    | jus the raw record from the original request


*** Record Properties ***

Property Name       | Description
:-----------        | :-------   
`messageId`         | message id of sqs record
`receiptHandle`     | receipt handle of sqs record
`body`              | body of sqs record (will automatically decode JSON)
`rawBody`           | body of sqs record
`attributes`        | attributes of sqs record
`messageAttributes` | message attributes of sqs record
`md5OfBody`         | md5 of body of sqs record
`source`            | source of sqs record
`sourceARN`         | source ARN of sqs record
`region`            | region of sqs record

### DynamoDB Stream Events

0. Setting Up your lambda to listen to the Queue

```yml
functions:
    v1-dynamodb-stream:
        name: v1-dynamodb-stream
        handler: application/v1/handler/dynamodb/streamer.stream
        events:
            - stream:
                type: dynamodb
                arn:
                    Fn::GetAtt: [ DynamoDbTableExample, 'Arn' ]
```

1. Initialize the Event and Iterate over the Records

```javascript
const EventClient = require('@syngenta-digital/alc').dynamodb.Event;

exports.stream = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
```
*** Event Client Properties ***

Property Name   | Description
:-----------    | :-------   
`records`       | list of record objects
`rawRecords`    | jus the raw record from the original request


*** Record Properties ***

Property Name                | Description
:-----------                 | :-------   
`eventID`                    | event id of dynamodb record
`eventName`                  | event name of dynamodb record
`eventSource`                | event source  of dynamodb record
`keys`                       | keys of dynamodb record (will convert ddb json)
`oldImage`                   | old image of dynamodb record
`newImage`                   | new image of dynamodb record
`rawBody`                    | raw of body of dynamodb record
`eventSourceARN`             | event source ARN of dynamodb record
`eventVersion`               | event version of dynamodb record
`streamViewType`             | stream view type version of dynamodb record
`sizeBytes`                  | size bytes of dynamodb record
`approximateCreationDateTime`| approximate creation date time of dynamodb record


### S3 Events

0. Setting Up your lambda to listen to the Queue

```yml
functions:
    v1-s3-handler:
        name: v1-s3-handler
        handler: application/v1/handler/s3/handler.handle
        events:
            - s3: photos
```

1. Initialize the Event and Iterate over the Records

```javascript
const EventClient = require('@syngenta-digital/alc').s3.Event;

exports.handle = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
```
*** Event Client Properties ***

Property Name   | Description
:-----------    | :-------   
`records`       | list of record objects
`rawRecords`    | jus the raw record from the original request


*** Record Properties ***

Property Name                | Description
:-----------                 | :-------   
`eventTime`                  | event time of s3 record
`eventName`                  | event name of s3 record
`eventSource`                | event source  of s3 record
`awsRegion`                  | region of s3 record (will convert ddb json)
`requestParameters`          | request parameters of s3 record
`responseElements`           | response elements of s3 record
`configurationId`            | configuration id of s3 record
`object`                     | object of s3 record
`bucket`                     | bucket of s3 record
`s3SchemaVersion`            | s3 schema version of s3 record

## Testing

```bash
$ npm install
$ npm test
```
