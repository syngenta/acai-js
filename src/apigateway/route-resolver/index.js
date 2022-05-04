const DirectoryResolver = require('./directory-resolver');

class RouteResolver {
    resolve(request, response, base, controller, config = 'directory') {
        try {
            const resovler = this.getResolver(config);
            return resovler.resolve(request, response, base, controller);
        } catch (error) {
            response.code = 500;
            response.setError('router-config', error.message);
            return false;
        }
    }

    getResolver(config) {
        if (config === 'directory') {
            return new DirectoryResolver();
        }
        throw new Error('routingMode must be either directory or pattern');
    }
}

module.exports = RouteResolver;
