const path = require('path');
const fs = require('fs');

const RequestClient = require('./request-client');
const ResponseClient = require('./response-client');
const RequestValidator = require('./request-validator');
const ResponseValidator = require('./response-validator');
const Schema = require('./schema');
const Logger = require('../common/logger');
const EndpointConfig = require('./endpoint-config');
const UnknownError = require('./http-errors/unknown-error');
const NotFoundError = require('./http-errors/not-found-error');
const MethodNotExistError = require('./http-errors/method-not-exist-error');
const PathResolver = require('./endpoint-config/path-resolver');

class Router {
    constructor(params) {
        this._event = params.event;

        this._beforeAll = params.beforeAll;
        this._afterAll = params.afterAll;
        this._onError = params.onError;

        this._setUpLogger(params);

        this._request = new RequestClient(params.event);
        this._response = new ResponseClient();

        this._config = this._getEndpointConfig({
            requestPath: params.event.path,
            ...params
        });

        this._setUpValidators(params.schemaPath);
    }

    _setUpLogger(params) {
        this._logger = new Logger();
        this._setUpLogger(params.globalLogger);
    }

    _setUpValidators(schemaPath) {
        const schema = new Schema(this._schemaPath);
        this._requestValidator = new RequestValidator(this._request, this._response, schema);
        this._responseValidator = new ResponseValidator(this._request, this._response, schema);
    }

    _setUpLogger(globalLogger = false) {
        if (globalLogger) {
            require('../common/setup-logger.js').setUpLogger();
        }
    }

    async _handleError(request, response, error) {
        if (this._onError && typeof this._onError === 'function') {
            return this._onError(this._request, this._response, error);
        }
        if (!process.env.unittest) {
            this._logger.error({
                error_messsage: error.message,
                error_stack: error.stack instanceof String ? error.stack.split('\n') : error,
                event: this._event,
                request: request.request,
                response: this._errors
            });
        }
        return new UnknownError();
    }

    async _runEndpoint(methodName) {
        const {_request: request, _response: response, _config: config} = this;

        if (!config.ifExist()) {
            return new NotFoundError();
        }

        if (config.ifMethodExist(methodName)) {
            return new MethodNotExistError();
        }

        const beforeAllResult =
            typeof this._beforeAll === 'function' ? await this._beforeAll(request, response) : response;

        const validationResult = await this._requestValidator.isValid(config.getRequirementsByMethodName(methodName));

        if (validationResult.hasErrors()) {
            return validationResult.response();
        }

        const endpointResult = await this._config.getHandlerByMethodName(methodName)(request, beforeAllResult);

        const rule = config.getRequirementsByMethodName(methodName)['responseBody'];
        const bodyValidationResult = await this._responseValidator.isValid(rule);

        if (bodyValidationResult.hasErrors()) {
            return bodyValidationResult.response();
        }

        if (!response.hasErrors && this._afterAll && typeof this._afterAll === 'function') {
            await this._afterAll(request, response, endpoint.requirements);
        }

        return typeof this._afterAll === 'function' ? await this._afterAll(request, endpointResult) : endpointResult;
    }

    _getEndpointConfig({basePath, requestPath, handlerPath}) {
        const pathResolver = new PathResolver({basePath, requestPath, handlerPath});
        const modulePath = pathResolver.path;

        return EndpointConfig.fromFilePath({modulePath});
    }

    async route() {
        try {
            const method = this._event.httpMethod.toLowerCase();
            return await this._runEndpoint(method);
        } catch (error) {
            return this._handleError();
        }
    }
}

module.exports = Router;
