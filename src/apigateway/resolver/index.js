const path = require('path');
const Endpoint = require('../endpoint');
const ImportError = require('../import-manager/import-error');
const DirectoryResolver = require('./directory-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(params) {
        this.__params = params;
    }

    getEndpoint(request, response) {
        try {
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
        if (this.__params.routingMode === 'pattern') {
            return new PatternResolver(this.__params);
        }
        if (this.__params.routingMode === 'directory' || !this.__params.routingMode) {
            return new DirectoryResolver(this.__params);
        }
        throw new ImportError(500, 'router-config', 'routingMode must be either directory or pattern');
    }
}

module.exports = RouteResolver;
