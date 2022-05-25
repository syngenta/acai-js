const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class PatternResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__pattern = params.handlerPattern;
        this.hasPathParams = false;
    }

    resolve(request) {
        const filePath = this.__getFilePath(request.route);
        if (filePath && this.__importer.isFile(filePath)) {
            return this.__importer.importModuleFromPath(filePath);
        }
        throw new ImportError(404, 'url', 'endpoint not found');
    }

    __getFilePath(route) {
        const root = this.__getPatternRoute();
        return this.__getRequestFilePath(root, route);
    }

    __getPatternRoute() {
        const split = this.__pattern.split('*');
        return this.__importer.cleanPath(split[0]);
    }

    __getRequestFilePath(patternRoute, route) {
        const base = this.__importer.cleanPath(this.__basePath);
        const noBaseRoute = this.__importer.cleanPath(route.replace(base, ''));
        return this.__getPathFromRequest(patternRoute, noBaseRoute);
    }

    __getPathFromRequest(patternBase, requestedFilePath) {
        const pathParts = [];
        const splitRequest = requestedFilePath.split('/');
        const splitPattern = this.__pattern.split('/');
        const filePattern = splitPattern[splitPattern.length - 1];
        for (const requestPart of splitRequest) {
            const currentPath = pathParts.length ? `/${pathParts.join('/')}/` : '/';
            const file = filePattern.replace('*', requestPart);
            const mvc = `${patternBase}${currentPath}${file}`;
            const mvvm = `${patternBase}${currentPath}${requestPart}/${file}`;
            const directory = `${patternBase}${currentPath}${requestPart}`;
            if (this.__importer.isDirectory(directory) && this.__importer.isFile(mvc)) {
                throw new ImportError(500, 'router-config', 'file & directory cant share name in the same directory');
            } else if (this.__importer.isFile(mvc)) {
                pathParts.push(file);
            } else if (this.__importer.isFile(mvvm)) {
                pathParts.push(requestPart);
                pathParts.push(file);
            } else if (this.__importer.isDirectory(directory)) {
                pathParts.push(requestPart);
            } else {
                this.hasPathParams = true;
            }
        }
        pathParts.unshift(patternBase);
        return pathParts.join('/');
    }
}

module.exports = PatternResolver;
