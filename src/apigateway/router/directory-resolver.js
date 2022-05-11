const fs = require('fs');
const PathCleaner = require('./path-cleaner');
const RouteError = require('./route-error');

class DirectoryResolver {
    constructor(params) {
        this.__pathCleaner = new PathCleaner();
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
    }

    resolve(request, response) {
        try {
            const cleanedPaths = this.cleanUpPaths(request);
            return this.getEndpointPath(cleanedPaths);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return '';
        }
    }

    cleanUpPaths(request) {
        const basePath = this.__pathCleaner.cleanPath(this.__basePath);
        const handlerFilePrefix = this.__pathCleaner.cleanPath(this.__handlerPath);
        const requestedRoutePath = this.__pathCleaner.cleanPath(request.route);
        const requestedFilePath = this.__pathCleaner.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, handlerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    getEndpointPath({handlerFilePrefix, requestedFilePath}) {
        const endpointPath = `${handlerFilePrefix}/${requestedFilePath}`;
        const isDirectory = this.isDirectory(endpointPath);
        const isFile = this.isFile(`${endpointPath}.js`);
        if (isDirectory && isFile) {
            throw new RouteError(500, 'router-config', 'file & directory share name in the same directory');
        }
        if (isDirectory) {
            return `${endpointPath}/index.js`;
        }
        if (!isFile) {
            throw new RouteError(404, 'url', 'endpoint not found');
        }
        return `${endpointPath}.js`;
    }

    isDirectory(dirPath) {
        try {
            return fs.lstatSync(dirPath).isDirectory();
        } catch (error) {
            return false;
        }
    }

    isFile(filePath) {
        try {
            return fs.lstatSync(filePath).isFile();
        } catch (error) {
            return false;
        }
    }
}

module.exports = DirectoryResolver;
