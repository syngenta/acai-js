const glob = require('glob');
const PathCleaner = require('./path-cleaner');
const RouteError = require('./route-error');

class PatternResolver {
    constructor() {
        this.__pathCleaner = new PathCleaner();
    }

    resolve(request, response, base, controller) {
        try {
            const cleanedPaths = this.__pathCleaner.cleanUpPaths(request, base, controller);
            return this.getEndpointPath(cleanedPaths);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return '';
        }
    }
}
module.exports = PatternResolver;
