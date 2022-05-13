const path = require('path');
const Endpoint = require('../endpoint');
const ImportError = require('../import-manager/import-error');
const DirectoryResolver = require('./directory-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(params) {
        this.__params = params;
        this.__params.routingMode = params.routingMode || 'directory';
        this.__resolvers = {
            pattern: PatternResolver,
            directory: DirectoryResolver
        };
    }

    getEndpoint(request, response) {
        try {
            this.__validateConfigs();
            const endpointModule = this.getResolver().resolve(request);
            if (typeof endpointModule[request.method.toLowerCase()] !== 'function') {
                throw new ImportError(403, 'method', 'method not allowed');
            }
            return new Endpoint(endpointModule, request.method);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return new Endpoint({}, 'error');
        }
    }

    getResolver() {
        return new this.__resolvers[this.__params.routingMode](this.__params);
    }

    __validateConfigs() {
        if (this.__params.routingMode !== 'pattern' && this.__params.routingMode !== 'directory') {
            throw new ImportError(500, 'router-config', 'routingMode must be either directory or pattern');
        }
        if (this.__params.routingMode === 'directory' && !this.__params.handlerPath) {
            throw new ImportError(500, 'router-config', 'handlerPath config is requied when routingMode is directory');
        }
        if (this.__params.routingMode === 'pattern' && !this.__params.handlerPattern) {
            throw new ImportError(500, 'router-config', 'handlerPattern config is requied when routingMode is pattern');
        }
    }
}

module.exports = RouteResolver;
