const fs = require('fs');
const glob = require('glob-fs')({gitignore: true});
const PathCleaner = require('./path-cleaner');
const RouteError = require('./route-error');

class PatternResolver {
    constructor(params) {
        this.__pathCleaner = new PathCleaner();
        this.__basePath = params.basePath;
        this.__pattern = params.handlerPattern;
    }

    resolve(request, response) {
        try {
            return this.getEndpointPath(request.route);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return '';
        }
    }

    getEndpointPath(route) {
        const globFiles = glob.readdirSync(this.__pattern, {});
        const splitPattern = this.__pattern.split('*');
        const fileSuffix = splitPattern[splitPattern.length - 1];
        const base = this.__pathCleaner.cleanPath(this.__basePath);
        const requestedFile = this.__pathCleaner.cleanPath(route.replace(base, ''));
        const matchingFiles = globFiles.filter((file) => file.includes(`${requestedFile}${fileSuffix}`));
        if (!matchingFiles || !matchingFiles.length || !fs.lstatSync(matchingFiles[0]).isFile()) {
            throw new RouteError(404, 'url', 'endpoint not found');
        }
        return matchingFiles[0];
    }
}
module.exports = PatternResolver;
