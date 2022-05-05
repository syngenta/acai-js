const path = require('path');
const Endpoint = require('./index');
const RouteResolver = require('../route-resolver');

class EndpointConfig {
    static getEndpoint(request, response, base, controller) {
        const resolver = new RouteResolver();
        const endpoint = resolver.resolve(request, response, base, controller);
        if (endpoint) {
            const endpointModule = EndpointConfig.getModule(endpoint, response);
            return new Endpoint(endpointModule, request.method);
        }
        return false;
    }

    static getModule(endpoint, response) {
        try {
            return require(path.join(process.cwd(), endpoint));
        } catch (error) {
            response.code = 404;
            response.setError('url', 'endpoint not found');
            return false;
        }
    }
}

module.exports = EndpointConfig;
