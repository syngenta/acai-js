const path = require('path');
const Endpoint = require('../endpoint');
const DirectoryResolver = require('./directory-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(routingMode = 'directory', routingPattern = '') {
        this.mode = routingMode;
        this.pattern = routingPattern;
    }

    getEndpoint(request, response, base, controller) {
        const resolved = this.getResolver().resolve(request, response, base, controller);
        if (!response.hasErrors) {
            const endpointModule = this.getModule(resolved, response);
            return new Endpoint(endpointModule, request.method);
        }
        return new Endpoint({}, 'error');
    }

    getResolver() {
        if (this.mode === 'directory') {
            return new DirectoryResolver();
        }
        if (this.mode === 'directory') {
            return new PatternResolver();
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
