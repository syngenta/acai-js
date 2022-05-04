const EndpointConfig = require('./endpoint/config');
const Logger = require('../common/logger');
const LoggerSetup = require('../common/setup-logger.js');
const RequestClient = require('./request-client');
const RequestValidator = require('./request-validator');
const ResponseClient = require('./response-client');
const ResponseValidator = require('./response-validator');

class Router {
    constructor(params) {
        this.__event = params.event;
        this.__basePath = params.basePath;
        this.__controllerPath = params.controllerPath || params.handlerPath;
        this.__beforeAll = params.beforeAll;
        this.__afterAll = params.afterAll;
        this.__withAuth = params.withAuth;
        this.__onError = params.onError;
        this.__schema = params.schema || params.schemaPath;
        this.__logger = new Logger();
        this.__requestValidator = new RequestValidator();
        this.__responseValidator = new ResponseValidator();
        LoggerSetup.setUpLogger(params.globalLogger);
    }

    async route() {
        try {
            const request = new RequestClient(this.__event);
            const response = new ResponseClient();
            const routeResult = await this.__runRoute(request, response);
            return routeResult.response;
        } catch (error) {
            const errorResult = await this.__handleError(request, response, error);
            return errorResult.response;
        }
    }

    async __runRoute(request, response) {
        const endpoint = await EndpointConfig.getEndpoint(request, response, this.__basePath, this.__controllerPath);
        if (!response.hasErrors && typeof this.__beforeAll === 'function') {
            await this.__beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasBefore) {
            await endpoint.before(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAuth) {
            await this.__withAuth(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasRequirements) {
            await this.__requestValidator(request, response, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint.run(endpoint.dataClass(request) ? endpoint.hasDataClass : request, response);
        }
        if (!response.hasErrors && endpoint.hasResponseBody) {
            await this.__responseValidator(request, response, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAfter) {
            await endpoint.after(request, response, endpoint.requirements);
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
        if (!process.env.unittest) {
            this.__logger.error({
                error_messsage: error.message,
                error_stack: error.stack instanceof String ? error.stack.split('\n') : error,
                event: this.__event,
                request: request.request,
                response: response.response
            });
        }
    }
}

module.exports = EndpointConfig;
