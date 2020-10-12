const path = require('path');
const fs = require('fs');

const RequestClient = require('./requestClient');
const ResponseClient = require('./responseClient');
const RequestValidator = require('./requestValidator');
require('../common/setUpLogger.js').setUpLogger();

class Router {
    constructor(params) {
        this._event = params.event;
        this._path = params.event.path;
        this._app = params.app;
        this._requestMiddleware = params.requestMiddleware;
        this._responseMiddleware = params.responseMiddleware;
        this._endpointBase = `${params.service}/${params.version}`;
        this._version = params.version;
        this._handlerBase = params.handlerPath.endsWith('/') ? params.handlerPath.slice(0, -1) : params.handlerPath;
        this._errors = new ResponseClient();
    }

    _handleError(error) {
        if (!this._errors.hasErrors) {
            this._errors.code = 500;
            this._errors.setError('server', 'interval server error');
        }
        if (!process.env.unittest) {
            const request = new RequestClient(this._event);
            global.logger.error({error, event: this._event, request: request.request, response: this._errors});
        }
    }

    async _runEndpoint(endpoint) {
        const method = this._event.httpMethod.toLowerCase();
        this._methodExists(endpoint, method);
        const request = new RequestClient(this._event);
        const response = new ResponseClient();
        const validator = new RequestValidator(request, response);
        if (endpoint.requirements && endpoint.requirements[method] && !response.hasErrors) {
            await validator.requestIsValid(endpoint.requirements[method]);
        }
        if (this._requestMiddleware && !response.hasErrors) {
            await this._requestMiddleware(request, response, endpoint.requirements);
        }
        if (!response.hasErrors) {
            await endpoint[method](request, response);
        }
        if (!response.hasErrors && this._responseMiddleware) {
            await this._responseMiddleware(request, response, endpoint.requirements);
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
        let endpointBase = this._endpointBase.startsWith('/') ? this._endpointBase.substr(1) : this._endpointBase;
        endpointBase = endpointBase.endsWith('/') ? endpointBase.slice(0, -1) : endpointBase;
        const endpointFile = this._path.includes(`${this._app}-${endpointBase}`)
            ? this._path.replace(`${this._app}-${endpointBase}`, '')
            : this._path.replace(`${endpointBase}`, '');
        return !endpointFile ? 'index' : endpointFile;
    }

    async _getRequiredModule() {
        const endpointFile = await this._getEndpointFile();
        const requiredModule = `${this._handlerBase}/${endpointFile}`;
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
