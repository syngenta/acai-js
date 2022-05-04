const fs = require('fs');

class DirectoryResolver {
    resolve(request, response, base, controller) {
        try {
            const cleanedPaths = this.cleanUpPaths(request, base, controller);
            const endpointPath = this.getEndpointPath(cleanedPaths);
            return endpointPath;
        } catch (error) {
            response.code = 500;
            response.setError('router-config', error.message);
            return false;
        }
    }

    cleanUpPaths(request, base, controller) {
        const basePath = this.cleanPath(base);
        const controllerFilePrefix = this.cleanPath(controller);
        const requestedRoutePath = this.cleanPath(request.route);
        const requestedFilePath = this.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, controllerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    cleanPath(dirtyPath) {
        if (dirtyPath.startsWith('/')) {
            dirtyPath = dirtyPath.substr(1);
        }
        if (dirtyPath.endsWith('/')) {
            dirtyPath = dirtyPath.slice(0, -1);
        }
        return dirtyPath;
    }

    getEndpointPath({controllerFilePrefix, requestedFilePath}) {
        const endpointPath = `${controllerFilePrefix}/${requestedFilePath}`;
        const isDirectory = this.isDirectory(endpointPath);
        const isFile = this.isDirectory(`${endpointPath}.js`);
        if (isDirectory && isFile) {
            throw new Error('can not have file and directory with the same name in the same directory');
        }
        if (isDirectory) {
            return `${endpointPath}/index.js`;
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
