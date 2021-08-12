const path = require('path');
const fs = require('fs');

const RequestClient = require('./request-client');
const ResponseClient = require('./response-client');
const RequestValidator = require('./request-validator');
const Logger = require('../common/logger');

class Router {
    constructor(params) {
        this._event = params.event;
        this._path = params.event.path;
        this._beforeAll = params.beforeAll;
        this._afterAll = params.afterAll;
        this._basePath = params.basePath;
        this._handlerPath = params.handlerPath;
        this._errors = new ResponseClient();
        this._logger = new Logger();
        this._schemaPath = params.schemaPath;
        this._setUpLogger(params.globalLogger);
    }

    _setUpLogger(globalLogger = false) {
        if (globalLogger) {
            require('../common/setup-logger.js').setUpLogger();
        }
    }

    _handleError(error) {
        if (!this._errors.hasErrors) {
            this._errors.code = 500;
            this._errors.setError('server', 'internal server error');
        }
        if (!process.env.unittest) {
            const request = new RequestClient(this._event);
            this._logger.error({
                error_messsage: error.message,
                error_stack: error.stack instanceof String ? error.stack.split('\n') : error,
                event: this._event,
                request: request.request,
                response: this._errors
            });
        }
    }

    async _runEndpoint(endpoint) {
        const method = this._event.httpMethod.toLowerCase();
        this._methodExists(endpoint, method);
        const request = new RequestClient(this._event);
        const response = new ResponseClient();
        const validator = new RequestValidator(request, response, this._schemaPath);
        if (endpoint.requirements && endpoint.requirements[method] && !response.hasErrors) {
            await validator.requestIsValid(endpoint.requirements[method]);
        }
        if (this._beforeAll && !response.hasErrors) {
            await this._beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint[method](request, response);
        }
        if (!response.hasErrors && this._afterAll) {
            await this._afterAll(request, response, endpoint.requirements);
        }
        return response;
    }

    _methodExists(endpoint, method) {
        if (typeof endpoint[method] !== 'function') {
            this._errors.code = 403;
            this._errors.setError('method', 'method not allowed');
            throw new Error('method not allowed');
        }
    }

    async _endPointExists(requiredModule) {
        const file = requiredModule.endsWith('/')
            ? `${process.cwd()}/${requiredModule}index.js`.replace('//', '/')
            : `${process.cwd()}/${requiredModule}.js`.replace('//', '/');
        if (!(await fs.existsSync(file))) {
            this._errors.code = 404;
            this._errors.setError('url', 'endpoint not found');
            throw new Error('endpoint not found');
        }
    }

    _getEndpointFile() {
        let basePath = this._basePath.startsWith('/') ? this._basePath.substr(1) : this._basePath;
        basePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        const endpointFile = this._path.replace(basePath, '');
        return !endpointFile ? 'index' : endpointFile;
    }

    async _getRequiredModule() {
        const endpointFile = await this._getEndpointFile();
        const handlerPath = this._handlerPath.endsWith('/') ? this._handlerPath.slice(0, -1) : this._handlerPath;
        const requiredModule = `${handlerPath}/${endpointFile}`;
        return requiredModule.replace('//', '/');
    }

    async _getEndpoint() {
        const requiredModule = await this._getRequiredModule();
        await this._endPointExists(requiredModule);
        return require(path.join(process.cwd(), requiredModule));
    }

    async route() {
        try {
            const endpoint = await this._getEndpoint();
            const response = await this._runEndpoint(endpoint);
            return response.response;
        } catch (error) {
            this._handleError(error);
            return this._errors.response;
        }
    }
}

module.exports = Router;
