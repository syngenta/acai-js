const EndpointConfig = require('./endpoint-config');
const Logger = require('../common/logger');
const LoggerSetup = require('../common/setup-logger.js');
const RequestValidator = require('./request-validator');
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
            return await this.__runRoute(request, response);
        } catch (error) {
            return await this.__handleError(request, response, error);
        }
    }

    async __runRoute(request, reponse) {
        const endpoint = EndpointConfig.getEndpoint(request, reponse);
        if (!response.hasErrors && typeof this.__beforeAll === 'function') {
            await this.__beforeAll(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasBefore) {
            await endpoint.before(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasRequirements) {
            await this.__requestValidator(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAuth) {
            await this.__withAuth(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasValidate) {
            await endpoint.validate(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint.run(endpoint.dataClass(request) ? endpoint.hasDataClass : request, reponse);
        }
        if (!response.hasErrors && endpoint.hasResponseBody) {
            await this.__responseValidator(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && endpoint.hasAfter) {
            await endpoint.after(request, reponse, endpoint.requirements);
        }
        if (!response.hasErrors && typeof this.__afterAll === 'function') {
            await this.__afterAll(request, reponse, endpoint.requirements);
        }
        return response.awsResponse;
    }

    async __handleError(request, response, error) {
        this.__logError(request, response, error);
        if (typeof this.__onError === 'function') {
            this.__onError(request, response, error);
            return response;
        }
        response.code = 500;
        response.setError('server', 'internal server error');
        return response.awsResponse;
    }

    __logError(request, response, error) {
        if (!process.env.unittest) {
            this.__logger.error({
                error_messsage: error.message,
                error_stack: error.stack instanceof String ? error.stack.split('\n') : error,
                event: this._event,
                request: request.request,
                response: response
            });
        }
    }
}
