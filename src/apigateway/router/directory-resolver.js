const fs = require('fs');
const PathCleaner = require('./path-cleaner');
const RouteError = require('./route-error');

class DirectoryResolver {
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

    getEndpointPath({controllerFilePrefix, requestedFilePath}) {
        const endpointPath = `${controllerFilePrefix}/${requestedFilePath}`;
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
