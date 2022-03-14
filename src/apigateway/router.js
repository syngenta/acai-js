const path = require('path');
const fs = require('fs');

const RequestClient = require('./request-client');
const ResponseClient = require('./response-client');
const RequestValidator = require('./request-validator');
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

    async _runEndpoint(endpointFile) {
        const endpoint = this._getExistingEndpoint(endpointFile);
        const method = this._getExistingMethod(endpoint);
        const request = new RequestClient(this._event);
        const response = new ResponseClient();
        const schema = new Schema(this._schemaPath);
        const validator = new RequestValidator(request, response, schema);
        if (!response.hasErrors && endpoint.requirements && endpoint.requirements[method]) {
            await validator.requestIsValid(endpoint.requirements[method]);
        }
        if (!response.hasErrors && this._beforeAll && typeof this._beforeAll === 'function') {
            await this._beforeAll(request, response, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint[method](request, response);
        }
        if (!response.hasErrors && this._afterAll && typeof this._afterAll === 'function') {
            await this._afterAll(request, response, endpoint.requirements);
        }
        return response;
    }

    _getExistingEndpoint(endpointFile) {
        try {
            return require(path.join(process.cwd(), endpointFile));
        } catch (error) {
            this._errors.code = 404;
            this._errors.setError('url', 'endpoint not found');
            throw new Error('endpoint not found');
        }
    }

    _getExistingMethod(endpoint) {
        const method = this._event.httpMethod.toLowerCase();
        if (typeof endpoint[method] !== 'function') {
            this._errors.code = 403;
            this._errors.setError('method', 'method not allowed');
            throw new Error('method not allowed');
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
