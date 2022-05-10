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
    event: ProxyEvent,
    basePath: string,
    handlerPath: string,
    schemaPath?: string,
    beforeAll?: HttpPathMethodHandler<unknown>
    afterAll?: HttpPathMethodHandler<unknown>
    onError?: HttpOnErrorCallback
    withAuth?: HttpWithAuthCallback
    globalLogger?: boolean
}

declare type HttpCallback = (
    request: AlcHttpRequestClient<unknown>,
    response: AlcHttpResponseClient<unknown>,
    requirements: unknown) => Promise<unknown>

declare type HttpOnErrorCallback = (
    request: AlcHttpRequestClient<unknown>,
    response: AlcHttpResponseClient<unknown>,
    error: unknown) => Promise<unknown>

declare type HttpPathMethodRequirements = {
    requiredBody?: string,
    responseBody?: string,
    withAuth?: boolean,
    before?: HttpCallback,
    after?: HttpCallback,
    availableParams?: string[]
    requiredParams?: string[]
    availableHeaders?: string[]
    requiredHeaders?: string[]
}

declare type HttpPathMethodHandler<TRequest = any, TResponse = any> = (
    request: AlcHttpRequestClient<TRequest>,
    response: AlcHttpResponseClient<TResponse>) => AlcHttpResponseClient<TResponse> | TResponse

type HTTPAuthorizer = ProxyEvent['requestContext']['authorizer'] | ProxyEvent['headers'];
type HttpParams = NonNullable<ProxyEvent['queryStringParameters']>;

declare type AlcHttpRequestClient<T = unknown, TContext = unknown | null> = {
    readonly method: ProxyEvent['httpMethod'],
    readonly resource: ProxyEvent['resource'],
    readonly authorizer: HTTPAuthorizer,
    readonly headers: ProxyEvent['headers'],
    readonly params: HttpParams,
    readonly path: ProxyEvent['pathParameters'],
    readonly route: ProxyEvent['path'],
    readonly json: T,
    readonly xml: T,
    readonly body: T,
    readonly raw: ProxyEvent['body'],
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
    context: TContext
}

type ResponseHeaders = Record<string, string>;
type ResponseCode = number;

declare type AlcHttpResponseClient<T> = {
    headers: ResponseHeaders,
    code: ResponseCode,
    body: T,
    response: {
        headers: ResponseHeaders;
        code: ResponseCode;
        body: T;
    },
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
