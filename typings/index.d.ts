import {RequireAtLeastOne} from './type-utils'
import {
    APIGatewayProxyHandler as ProxyHandler,
    APIGatewayProxyEvent as ProxyEvent,
    APIGatewayProxyResult as ProxyResult,
} from 'aws-lambda'

import {S3Event, S3EventRecord, S3Handler as AWSS3Handler} from 'aws-lambda/trigger/s3';
import {SQSEvent, SQSRecord } from 'aws-lambda/trigger/sqs';
import {DynamoDBStreamEvent, DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda/trigger/dynamodb-stream';

declare enum HTTPMethods {
    get,
    post,
    put,
    patch,
    options,
    delete
}

export declare type AlcRouteHandler = ProxyHandler;
export declare type AlcRouteEvent = ProxyEvent;

export declare type AlcRouterParams = {
    /**
     * event object passed into lambda
     */
    event: ProxyEvent,
    /**
     * apigateway base path for the custom domain
     */
    basePath: string,
    /**
     * project path of where the endpoint files
     */
    handlerPath: string,
    /**
     * path where your schema file can found (accepts JSON as well)
     * @default undefined
     */
    schemaPath?: string,
    /**
     * before all middleware function to run before all routes (after validation occurs)
     */
    beforeAll?: HttpPathMethodHandler<unknown>
    /**
     * after all middleware function to run after all routes
     */
    afterAll?: HttpPathMethodHandler<unknown>
    /**
     * onError callback, called in case of errors while handle endpoint
     */
    onError?: HttpOnErrorCallback
    /**
     * will apply the logger function to the global scope (global.logger)
     * @default false
     */
    globalLogger?: boolean
}

declare type HttpOnErrorCallback = (request: AlcHttpRequestClient<unknown>, response: AlcHttpResponseClient<unknown>) => Promise<unknown>

declare type HttpPathMethodRequirements = {
    /**
     * the components schema key name
     */
    requiredBody?: string,
    /**
     * the components schema key name
     */
    responseBody?: string,
    /**
     * list of available query string params for that method on that endpoint
     */
    availableParams?: string[]
    /**
     * list of required query string params for that method on that endpoint
     */
    requiredParams?: string[]
    /**
     * list of available headers for that method on that endpoint
     */
    availableHeaders?: string[]
    /**
     * list of required headers for that method on that endpoint
     */
    requiredHeaders?: string[]
}

declare type HttpPathMethodHandler<TRequest = any, TResponse = any> = (
    request: AlcHttpRequestClient<TRequest>,
    response: AlcHttpResponseClient<TResponse>) => AlcHttpResponseClient<TResponse> | TResponse

type HTTPAuthorizer = ProxyEvent['requestContext']['authorizer'] | ProxyEvent['headers'];
type HttpParams = NonNullable<ProxyEvent['queryStringParameters']>;

declare type AlcHttpRequestClient<T = unknown> = {
    /**
     * method id of apigateway event
     */
    readonly method: ProxyEvent['httpMethod'],
    /**
     * resource handle of apigateway event
     */
    readonly resource: ProxyEvent['resource'],
    /**
     * authorizer of apigateway event (will default to use headers if using with serverless offline)
     * @see(https://www.npmjs.com/package/serverless-offline)
     */
    readonly authorizer: HTTPAuthorizer,
    /**
     * headers of apigateway event
     */
    readonly headers: ProxyEvent['headers'],
    /**
     * query string params of apigateway event
     */
    readonly params: HttpParams,
    /**
     * path arguments of apigateway event
     */
    readonly path: ProxyEvent['pathParameters'],

    readonly route: ProxyEvent['path'],
    /**
     * body of apigateway event parsed as JSON
     */
    readonly json: T,
    /**
     * body of apigateway event parsed as XML
     */
    readonly xml: T,
    /**
     * body of apigateway event will be parsed based on context headers
     */
    readonly body: T,
    readonly raw: ProxyEvent['body'],
    /**
     * full request broken down as an object literal
     */
    readonly request: {
        method: ProxyEvent['httpMethod'],
        resource: ProxyEvent['resource'],
        authorizer: HTTPAuthorizer,
        headers: ProxyEvent['headers'],
        params: HttpParams,
        path: ProxyEvent['pathParameters'],
        route: ProxyEvent['path'],
        body: T

    }
}

type ResponseHeaders = Record<string, string>;
type ResponseCode = number;

declare type AlcHttpResponseClient<T> = {
    /**
     * headers you want to send in response
     */
    headers: ResponseHeaders,
    /**
     * status code of response (will default to 204 if no content && will default 400 if errors found in response)
     */
    code: ResponseCode,
    body: T,
    response: {
        headers: ResponseHeaders;
        code: ResponseCode;
        body: T;
    },
    /**
     * function will tell you if errors in the response
     */
    hasErrors(): boolean
    setError(keyPath?: string, message?: string, conflict?: unknown): void
}


export type AlcHttpPathMethodHandlers = {
    [key in keyof typeof HTTPMethods]: HttpPathMethodHandler
}

export type AlcPathConfig = {
    requirements: RequireAtLeastOne<{
        [key in keyof typeof HTTPMethods]: HttpPathMethodRequirements
    }>
} & RequireAtLeastOne<AlcHttpPathMethodHandlers>

export namespace apigateway {
    export class Router {
        constructor(params: AlcRouterParams);
        route(): ProxyResult;
    }
}

export namespace logger {
    export class Logger {
        info(...args: unknown[]): void

        log(...args: unknown[]): void

        warn(...args: unknown[]): void

        error(...args: unknown[]): void

        dir(...args: unknown[]): void

        time(...args: unknown[]): void

        timeEnd(...args: unknown[]): void

        timeLog(...args: unknown[]): void

        trace(...args: unknown[]): void

        clear(...args: unknown[]): void

        count(...args: unknown[]): void

        countReset(...args: unknown[]): void

        group(...args: unknown[]): void

        groupEnd(...args: unknown[]): void

        table(...args: unknown[]): void

        debug(...args: unknown[]): void

        dirxml(...args: unknown[]): void

        groupCollapsed(...args: unknown[]): void

        Console(...args: unknown[]): void

        profile(...args: unknown[]): void

        profileEnd(...args: unknown[]): void

        timeStamp(...args: unknown[]): void

        context(...args: unknown[]): void
    }
}

declare type AlcDynamoDBParams  ={
    globalLogger: boolean
}

export type DynamoDBHandler = DynamoDBStreamHandler;

export namespace dynamodb {
    export class Record {
        constructor(record: DynamoDBRecord);
        /**
         * aws region of record
         */
        readonly awsRegion: DynamoDBRecord['awsRegion']
        /**
         * event id of dynamodb record
         */
        readonly eventID: DynamoDBRecord['eventID']
        /**
         * event name of dynamodb record
         */
        readonly eventName: DynamoDBRecord['eventName']
        /**
         * event source of dynamodb record
         */
        readonly eventSource: DynamoDBRecord['eventSource']
        /**
         * keys of dynamodb record (will convert ddb json)
         */
        readonly keys: DynamoDBRecord['dynamodb']['Keys']
        /**
         * old image of dynamodb record
         */
        readonly oldImage: DynamoDBRecord['dynamodb']['OldImage']
        /**
         * new image of dynamodb record
         */
        readonly newImage: DynamoDBRecord['dynamodb']['NewImage']
        /**
         * event source ARN of dynamodb record
         */
        readonly eventSourceARN: DynamoDBRecord['eventSource']
        /**
         * event version of dynamodb record
         */
        readonly eventVersion: DynamoDBRecord['eventVersion']
        /**
         * stream view type version of dynamodb record
         */
        readonly streamViewType: DynamoDBRecord['dynamodb']['StreamViewType']
        /**
         * size bytes of dynamodb record
         */
        readonly sizeBytes: DynamoDBRecord['dynamodb']['SizeBytes']
        /**
         * approximate creation date time of dynamodb record
         */
        readonly approximateCreationDateTime: DynamoDBRecord['dynamodb']['ApproximateCreationDateTime']
        /**
         * the user who cause the action (not always available populated)
         */
        readonly userIdentity: DynamoDBRecord['userIdentity']
        /**
         * determines if the stream was invoked by a "time to live" expiring
         */
        readonly timeToLiveExpired: boolean
    }
    export class Event {
        constructor(event: DynamoDBStreamEvent, params?: AlcDynamoDBParams)
        rawRecords: DynamoDBRecord
        records: Record[]
    }
}


export type S3Handler = AWSS3Handler

export namespace s3 {
    export class Record {
        constructor(record: S3EventRecord);

        /**
         *
         */
        readonly eventName: S3EventRecord['eventName']
        readonly eventSource: S3EventRecord['eventSource'] 
        readonly eventTime: S3EventRecord['eventTime']
        readonly awsRegion: S3EventRecord['awsRegion']
        readonly requestParameters: S3EventRecord['requestParameters']
        readonly responseElements: S3EventRecord['responseElements']
        readonly configurationId: S3EventRecord['s3']['configurationId']
        readonly object: S3EventRecord['s3']['object']
        readonly bucket: S3EventRecord['s3']['bucket']
        readonly key: S3EventRecord['s3']['object']['key']
        readonly s3SchemaVersion: S3EventRecord['s3']['s3SchemaVersion']
    }
    export class Event {
        constructor(event: S3Event, params?: AlcDynamoDBParams)
        /**
         * just the raw record from the original request
         */
        rawRecords: S3Event['Records']
        /**
         * list of record objects
         */
        records: Record[]
    }
}

export namespace sqs {
    export class Record {
        constructor(record: SQSRecord);
        /**
         * message id of sqs record
         */
        readonly messageId: SQSRecord['messageId']
        /**
         * receipt handle of sqs record
         */
        readonly receiptHandle: SQSRecord['receiptHandle']
        /**
         * body of sqs record (will automatically decode JSON)
         */
        readonly body: unknown
        /**
         * body of sqs record
         */
        readonly rawBody: SQSRecord['body']
        /**
         * attributes of sqs record
         */
        readonly attributes: SQSRecord['attributes']
        /**
         * message attributes of sqs record
         */
        readonly messageAttributes: SQSRecord['messageAttributes']
        /**
         * md5 of body of sqs record
         */
        readonly md5OfBody: SQSRecord['md5OfBody']
        /**
         * source of sqs record
         */
        readonly source: SQSRecord['eventSource']
        /**
         * source ARN of sqs record
         */
        readonly sourceARN: SQSRecord['eventSourceARN']
        /**
         * region of sqs record
         */
        readonly region: SQSRecord['awsRegion']
    }
    export class Event {
        constructor(event: SQSEvent, params?: AlcDynamoDBParams)
        /**
         * just the raw record from the original request
         */
        rawRecords: SQSEvent['Records']
        /**
         * list of record objects
         */
        records: Record[]
    }
}
