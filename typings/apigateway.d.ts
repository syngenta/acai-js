import {RequireAtLeastOne} from './require-at-least-one';

import {
    APIGatewayProxyHandler as ProxyHandler,
    APIGatewayProxyEvent as ProxyEvent,
    APIGatewayProxyResult as ProxyResult
} from 'aws-lambda';

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
        /**
     * time to wait for the response
     * @default 0
     */
    timeout?: number
}

declare type HttpOnErrorCallback = (
    request: AlcHttpRequestClient<unknown>,
    response: AlcHttpResponseClient<unknown>,
    error: unknown) => Promise<unknown>

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

declare type AlcHttpRequestClient<T = unknown, TContext = unknown | null> = {
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
    /*
    * a mutatable context field you can use to pass additional context down to your endpoints, best used with beforeAll functions
    */
    context: TContext
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
