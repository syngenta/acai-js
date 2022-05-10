const DirectoryResolver = require('./directory-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    resolve(request, response, base, controller, config = 'directory') {
        try {
            const resovler = this.getResolver(config);
            return resovler.resolve(request, response, base, controller);
        } catch (error) {
            response.code = 500;
            response.setError('router-config', error.message);
            return {};
        }
    }

    getResolver(config) {
        if (config === 'directory') {
            return new DirectoryResolver();
        }
        if (config === 'directory') {
            return new PatternResolver();
        }
        throw new Error('routingMode must be either directory or pattern');
    }
}

module.exports = RouteResolver;
