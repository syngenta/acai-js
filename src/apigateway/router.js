const RequestClient = require('./request-client');
const ResponseClient = require('./response-client');
const RequestValidatorClass = require('./request-validator');
const ResponseValidatorClass = require('./response-validator');
const Schema = require('./schema');
const Logger = require('../common/logger');
const EndpointConfig = require('./endpoint-config');
const UnknownError = require('./http-errors/unknown-error');
const NotFoundError = require('./http-errors/not-found-error');
const MethodNotExistError = require('./http-errors/method-not-exist-error');
const PathResolverClass = require('./endpoint-config/path-resolver');
const NotMatchedUrlError = require('./endpoint-config/not-matched-url-error');
const NotFoundModuleError = require('./endpoint-config/not-found-module-error');

class Router {
    constructor({
                    handlerPath,
                    schemaPath,
                    event,
                    basePath,
                    onError,
                    afterAll,
                    beforeAll,
                    globalLogger
                } = {}, {
                    Config = EndpointConfig,
                    PathResolver = PathResolverClass,
                    RequestValidator = RequestValidatorClass,
                    ResponseValidator = ResponseValidatorClass

                } = {}) {
        this._event = event;
        this._Config = Config;
        this._PathResolver = PathResolver;
        this._RequestValidator = RequestValidator;
        this._ResponseValidator = ResponseValidator;

        this._beforeAll = beforeAll;
        this._afterAll = afterAll;
        this._onError = onError;

        this._setUpLogger({globalLogger});

        this._request = new RequestClient(event);
        this._response = new ResponseClient();

        this._paths = {
            requestPath: event?.path,
            basePath: basePath,
            handlerPath: handlerPath
        };

        this._setUpValidators(schemaPath);
    }

    _setUpValidators(schemaPath) {
        const schema = new Schema(schemaPath);
        this._requestValidator = new this._RequestValidator(this._request, this._response, schema);
        this._responseValidator = new this._ResponseValidator(this._request, this._response, schema);
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

        if (error instanceof NotMatchedUrlError || error instanceof NotFoundModuleError) {
            return new NotFoundError().response;
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

        if (!this._response.hasErrors && requirements && requirements['responseBody']) {
            await this._responseValidator.isValid(requirements['responseBody']);
        }

        if (!this._response.hasErrors && typeof this._afterAll === 'function') {
            await this._afterAll(this._request, this._response, this._config.getRequirementsByMethodName(methodName));
        }
        return this._response;
    }

    _getEndpointConfig({basePath, requestPath, handlerPath}) {
        const pathResolver = new this._PathResolver({basePath, requestPath, handlerPath});
        const modulePath = pathResolver.path;

        return this._Config.fromFilePath({modulePath});
    }

    async route() {
        try {
            const method = this._event.httpMethod.toLowerCase();
            return (await this._runEndpoint(method)).response;
        } catch (error) {
            console.log(error);
            console.log(error.stack);
            return this._handleError(this._request, this._response, error);
        }
    }
}

module.exports = Router;
