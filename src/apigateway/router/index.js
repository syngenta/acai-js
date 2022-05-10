const EndpointConfig = require('../endpoint/config');
const Logger = require('../../common/logger');
const LoggerSetup = require('../../common/logger.js');
const Request = require('../request');
const Response = require('../response');
const Schema = require('../../common/schema.js');
const Validator = require('../../common/validator');

class Router {
    constructor(params) {
        this.__event = params.event;
        this.__basePath = params.basePath;
        this.__controllerPath = params.controllerPath || params.handlerPath;
        this.__beforeAll = params.beforeAll;
        this.__afterAll = params.afterAll;
        this.__withAuth = params.withAuth;
        this.__onError = params.onError;
        this.__schema = Schema.fromFilePath(params.schema || params.schemaPath);
        this.__logger = new Logger();
        this.__validator = new Validator(this.__schema);
        LoggerSetup.setUpGlobal(params.globalLogger);
    }

    async route() {
        const request = new Request(this.__event);
        const response = new Response();
        try {
            const routeResult = await this.__runRoute(request, response);
            return routeResult.response;
        } catch (error) {
            const errorResult = await this.__handleError(request, response, error);
            return errorResult.response;
        }
    }

    async __runRoute(request, response) {
        const endpoint = EndpointConfig.getEndpoint(request, response, this.__basePath, this.__controllerPath);
        if (!response.hasErrors && typeof this.__beforeAll === 'function') {
            await this.__beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAuth && typeof this.__withAuth === 'function') {
            await this.__withAuth(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasRequirements) {
            await this.__validator.isValid(request, response, endpoint.requirements, 'request');
        }
        if (!response.hasErrors && endpoint.hasBefore) {
            await endpoint.before(request, response);
        }
        if (!response.hasErrors && typeof endpoint.method !== 'function') {
            response.code = 403;
            response.setError('method', 'method not allowed');
        }
        if (!response.hasErrors) {
            await endpoint.run(request, response);
        }
        if (!response.hasErrors && endpoint.hasResponseBody) {
            await this.__validator.isValid(request, response, endpoint.requirements, 'response');
        }
        if (!response.hasErrors && endpoint.hasAfter) {
            await endpoint.after(request, response);
        }
        if (!response.hasErrors && typeof this.__afterAll === 'function') {
            await this.__afterAll(request, response, endpoint.requirements);
        }
        return response;
    }

    async __handleError(request, response, error) {
        if (typeof this.__onError === 'function') {
            this.__onError(request, response, error);
            return response;
        }
        this.__logError(request, response, error);
        response.code = 500;
        response.setError('server', 'internal server error');
        return response;
    }

    __logError(request, response, error) {
        this.__logger.error({
            error_messsage: error.message,
            event: this.__event,
            request: request.request,
            response: response.response
        });
    }
}

module.exports = Router;