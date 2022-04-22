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
const NotMatchedUrlError = require('./endpoint-config/not-matched-url-error');
const NotFoundModuleError = require('./endpoint-config/not-found-module-error');

class Router {
    constructor(params) {
        this._event = params.event;

        this._beforeAll = params.beforeAll;
        this._afterAll = params.afterAll;
        this._onError = params.onError;

        this._setUpLogger(params);

        this._request = new RequestClient(params.event);
        this._response = new ResponseClient();

        this._paths = {
            requestPath: params.event.path,
            basePath: params.basePath,
            handlerPath: params.handlerPath
        }

        this._setUpValidators(params.schemaPath);
    }

    _setUpValidators(schemaPath) {
        const schema = new Schema(schemaPath);
        this._requestValidator = new RequestValidator(this._request, this._response, schema);
        this._responseValidator = new ResponseValidator(this._request, this._response, schema);
    }

    _setUpLogger({globalLogger = false}) {
        this._logger = new Logger();
        if (globalLogger) {
            require('../common/setup-logger.js').setUpLogger();
        }
    }

    async _handleError(request, response, error) {
        if (this._onError && typeof this._onError === 'function') {
            const onErrorResult = await this._onError(this._request, this._response, error);
            return onErrorResult ? onErrorResult.response : response.response;
        }

        if(error instanceof NotMatchedUrlError || error instanceof NotFoundModuleError) {
            return new NotFoundError().response;
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
        return new UnknownError().response;
    }

    async _runEndpoint(methodName) {
        this._config = this._getEndpointConfig(this._paths);

        if (!this._config.ifExist()) {
            return new NotFoundError();
        }

        if (!this._config.ifMethodExist(methodName)) {
            return new MethodNotExistError();
        }

        const requirements = this._config.getRequirementsByMethodName(methodName);

        if (typeof this._beforeAll === 'function') {
            await this._beforeAll(this._request, this._response, requirements);
        }

        const validationConfig = this._config.getRequirementsByMethodName(methodName);

        if (!this._response.hasErrors && validationConfig) {
            await this._requestValidator.isValid(validationConfig);
        }

        if (!this._response.hasErrors) {
            await this._config.getHandlerByMethodName(methodName)(this._request, this._response);
        }

        if(!this._response.hasErrors && requirements && requirements['responseBody']){
            await this._responseValidator.isValid(rule);
        }

        if(!this._response.hasErrors && typeof this._afterAll === 'function'){
            await this._afterAll(this._request, this._response, this._config.getRequirementsByMethodName(methodName));
        }
        return this._response;
    }

    _getEndpointConfig({basePath, requestPath, handlerPath}) {
        const pathResolver = new PathResolver({basePath, requestPath, handlerPath});
        const modulePath = pathResolver.path;

        return EndpointConfig.fromFilePath({modulePath});
    }

    async route() {
        try {
            const method = this._event.httpMethod.toLowerCase();
            return (await this._runEndpoint(method)).response;
        } catch (error) {
            return this._handleError(this._request, this._response, error);
        }
    }
}

module.exports = Router;
