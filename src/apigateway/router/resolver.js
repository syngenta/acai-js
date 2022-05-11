const path = require('path');
const Endpoint = require('../endpoint');
const DirectoryResolver = require('./directory-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(params) {
        this.__params = params;
    }

    getEndpoint(request, response) {
        const resolved = this.getResolver().resolve(request, response);
        if (!response.hasErrors) {
            const endpointModule = this.getModule(resolved, response);
            return new Endpoint(endpointModule, request.method);
        }
        return new Endpoint({}, 'error');
    }

    getResolver() {
        if (this.__params.routingMode === 'pattern') {
            return new PatternResolver(this.__params);
        }
        if (this.__params.routingMode === 'directory' || !this.__params.routingMode) {
            return new DirectoryResolver(this.__params);
        }
        throw new Error('routingMode must be either directory or pattern');
    }

    getModule(resolved, response) {
        try {
            return require(path.join(process.cwd(), resolved));
        } catch (error) {
            response.code = 500;
            response.setError('router', error.message);
        }
    }
}

module.exports = RouteResolver;
