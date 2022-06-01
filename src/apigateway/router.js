const path = require('path');
const fs = require('fs');

const RequestClient = require('./request-client');
const ResponseClient = require('./response-client');
const RequestValidator = require('./request-validator');
const ResponseValidator = require('./response-validator');
const Schema = require('./schema');
const Logger = require('../common/logger');

class Router {
    constructor(params) {
        this._event = params.event;
        this._requestPath = params.event.path;
        this._beforeAll = params.beforeAll;
        this._afterAll = params.afterAll;
        this._basePath = params.basePath;
        this._handlerPath = params.handlerPath;
        this._onError = params.onError;
        this._logger = new Logger();
        this._schemaPath = params.schemaPath;
        this._setUpLogger(params.globalLogger);
        this._onRunEndpoint = params.onRunEndpoint;
    }

    _setUpLogger(globalLogger = false) {
        if (globalLogger) {
            require('../common/setup-logger.js').setUpLogger();
        }
    }

    async _handleError(request, response, error) {
        if (typeof this._onError === 'function') {
            this._onError(request, response, error);
        } else if (!response.hasErrors) {
            response.code = 500;
            response.setError('server', 'internal server error');
        }
        if (!process.env.unittest) {
            this._logger.error({
                error_message: error.message,
                error_stack: error.stack instanceof String ? error.stack.split('\n') : error,
                event: this._event,
                request: request.request,
                response: response
            });
        }
        return response;
    }

    async _runEndpoint(request, response) {
        const endpointFile = await this._getEndpoint();
        const endpoint = this._getExistingEndpoint(endpointFile, response);
        const method = this._getExistingMethod(endpoint, response);
        const schema = new Schema(this._schemaPath);
        const requestValidator = new RequestValidator(request, response, schema);
        const responseValidator = new ResponseValidator(request, response, schema);

        if (!response.hasErrors && endpoint.requirements && endpoint.requirements[method]) {
            await requestValidator.isValid(endpoint.requirements[method]);
        }
        if (!response.hasErrors && this._beforeAll && typeof this._beforeAll === 'function') {
            await this._beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint[method](request, response);
        }
        if (
            !response.hasErrors &&
            endpoint.requirements &&
            endpoint.requirements[method] &&
            endpoint.requirements[method]['responseBody']
        ) {
            const rule = endpoint.requirements[method]['responseBody'];
            await responseValidator.isValid(rule);
        }
        if (!response.hasErrors && this._afterAll && typeof this._afterAll === 'function') {
            await this._afterAll(request, response, endpoint.requirements);
        }
        return response;
    }

    _getExistingEndpoint(endpointFile, response) {
        try {
            return require(path.join(process.cwd(), endpointFile));
        } catch (error) {
            response.code = 404;
            response.setError('url', 'endpoint not found');
            return;
        }
    }

    _getExistingMethod(endpoint, response) {
        const method = this._event.httpMethod.toLowerCase();
        if (typeof endpoint[method] !== 'function') {
            response.code = 403;
            response.setError('method', 'method not allowed');
        }
        return method;
    }

    _cleanUpPath(dirtyPath) {
        if (dirtyPath.startsWith('/')) {
            dirtyPath = dirtyPath.substr(1);
        }
        if (dirtyPath.endsWith('/')) {
            dirtyPath = dirtyPath.slice(0, -1);
        }
        return dirtyPath;
    }

    _removeBasePathFromRequest(basePath, requestPath) {
        const baseArray = basePath.split('/');
        const requestArray = requestPath.split('/');
        return requestArray.filter((item) => !baseArray.includes(item));
    }

    async _isDirectory(dirPath) {
        try {
            return await fs.lstatSync(dirPath).isDirectory();
        } catch (error) {
            return false;
        }
    }

    async _isFile(filePath) {
        try {
            return await fs.lstatSync(filePath).isFile();
        } catch (error) {
            return false;
        }
    }

    async _getEndpointPath(endpointPath, files, index) {
        if (files[index] === undefined) {
            return endpointPath;
        }
        let possiblePath = `${endpointPath}/${files[index]}`;
        if (endpointPath === '') {
            possiblePath = files[index];
        }
        if (await this._isDirectory(possiblePath)) {
            endpointPath = await this._getControllerPath(possiblePath, files, index + 1);
        } else if (await this._isFile(`${possiblePath}.js`)) {
            endpointPath = `${possiblePath}.js`;
        } else if (files[index + 1] !== undefined) {
            endpointPath = await this._getControllerPath(endpointPath, files, index + 1);
        }
        if (await this._isDirectory(endpointPath)) {
            endpointPath = `${endpointPath}/index.js`;
        }
        return endpointPath;
    }

    async _getEndpoint() {
        const basePath = this._cleanUpPath(this._basePath);
        const requestPath = this._cleanUpPath(this._requestPath);
        const handlerPath = this._cleanUpPath(this._handlerPath);
        const fileArray = this._removeBasePathFromRequest(basePath, requestPath);
        return this._getEndpointPath(handlerPath, fileArray, 0);
    }

    async route() {
        const request = new RequestClient(this._event);
        const response = new ResponseClient();
        try {
            if (this._onRunEndpoint && typeof this._onRunEndpoint === 'function') {
                return (await this._onRunEndpoint(this._runEndpoint(request, response), request, response)).response;
            }
            return (await this._runEndpoint(request, response)).response;
        } catch (error) {
            return (await this._handleError(request, response, error)).response;
        }
    }
}

module.exports = Router;
