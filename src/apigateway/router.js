const Logger = require('../common/logger');
const LoggerSetup = require('../common/logger.js');
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
        this.__schema = Schema.fromFilePath(params.schemaPath, params);
        this.__resolver = new RouteResolver(params);
        this.__validator = new Validator(this.__schema);
        this.__logger = new Logger({callback: params.loggerCallback});
        if (params.globalLogger) {
            this.__logger.setUp();
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
        if (typeof this.__onError === 'function') {
            this.__onError(request, response, error);
            return response;
        }
        this.__logError(event, request, response, error);
        response.code = 500;
        response.setError('server', 'internal server error');
        return response;
    }

    __logError(event, request, response, error) {
        this.__logger.log({
            level: 'ERROR',
            log: {
                message: error.message,
                event: event,
                request: request.request,
                response: response.response
            }
        });
    }
}

module.exports = Router;
