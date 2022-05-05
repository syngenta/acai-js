const path = require('path');
const Endpoint = require('./index');
const RouteResolver = require('../route-resolver');

class EndpointConfig {
    static getEndpoint(request, response, base, controller) {
        const resolver = new RouteResolver();
        const endpoint = resolver.resolve(request, response, base, controller);
        if (!response.hasErrors) {
            const endpointModule = EndpointConfig.getModule(endpoint, response);
            return new Endpoint(endpointModule, request.method);
        }
        return new Endpoint({}, 'error');
    }

    static getModule(endpoint, response) {
        try {
            return require(path.join(process.cwd(), endpoint));
        } catch (error) {
            response.code = 500;
            response.setError('router', error.message);
        }
    }
}

module.exports = EndpointConfig;
