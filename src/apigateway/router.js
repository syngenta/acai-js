const Logger = require('../common/logger');
const Request = require('./request');
const RouteResolver = require('./resolver');
const Response = require('./response');
const Schema = require('../common/schema.js');
const Validator = require('../common/validator');

class Router {
    constructor(params) {
        this.__beforeAll = params.beforeAll;
        this.__afterAll = params.afterAll;
        this.__withAuth = params.withAuth;
        this.__onError = params.onError;
        this.__autoValidate = params.autoValidate;
        this.__schema = params.schemaPath ? Schema.fromFilePath(params.schemaPath, params) : {};
        this.__resolver = new RouteResolver(params);
        this.__validator = new Validator(this.__schema);
        this.__logger = new Logger({callback: params.loggerCallback});
        if (params.globalLogger) {
            this.__logger.setUp({callback: params.loggerCallback});
        }
    }

    async route(event) {
        const request = new Request(event);
        const response = new Response();
        try {
            const routeResult = await this.__runRoute(request, response);
            return routeResult.response;
        } catch (error) {
            const errorResult = await this.__handleError(event, request, response, error);
            return errorResult.response;
        }
    }

    async __runRoute(request, response) {
        const endpoint = this.__resolver.getEndpoint(request, response);
        if (!response.hasErrors && typeof this.__beforeAll === 'function') {
            await this.__beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAuth && typeof this.__withAuth === 'function') {
            await this.__withAuth(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && this.__autoValidate) {
            await this.__validator.validateWithOpenAPI(request, response);
        }
        if (!response.hasErrors && endpoint.hasRequirements && !this.__autoValidate) {
            await this.__validator.validateWithRequirements(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasBefore) {
            await endpoint.before(request, response);
        }
        if (!response.hasErrors) {
            await endpoint.run(request, response);
        }
        if (!response.hasErrors && endpoint.hasAfter) {
            await endpoint.after(request, response);
        }
        if (!response.hasErrors && typeof this.__afterAll === 'function') {
            await this.__afterAll(request, response, endpoint.requirements);
        }
        return response;
    }

    async __handleError(event, request, response, error) {
        this.__logError(event, request, response, error);
        if (typeof this.__onError === 'function') {
            this.__onError(request, response, error);
            return response;
        }
        response.code = 500;
        response.setError('server', 'internal server error');
        return response;
    }

    __logError(event, request, response, error) {
        this.__logger.log({
            level: 'ERROR',
            log: {
                event,
                request: request.request,
                response: response.response,
                error: error.stack.split('\n').map((trace) => trace.replace('    ', ''))
            }
        });
    }
}

module.exports = Router;
