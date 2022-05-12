const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class DirectoryResolver {
    constructor(params) {
        this.__importManager = new ImportManager();
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
    }

    resolve(request) {
        const cleanedPaths = this.cleanUpPaths(request);
        const endpointPath = this.getEndpointPath(cleanedPaths);
        return this.__importManager.importModuleFromPath(endpointPath);
    }

    cleanUpPaths(request) {
        const basePath = this.__importManager.cleanPath(this.__basePath);
        const handlerFilePrefix = this.__importManager.cleanPath(this.__handlerPath);
        const requestedRoutePath = this.__importManager.cleanPath(request.route);
        const requestedFilePath = this.__importManager.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, handlerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    getEndpointPath({handlerFilePrefix, requestedFilePath}) {
        const endpointPath = `${handlerFilePrefix}/${requestedFilePath}`;
        const isDirectory = this.__importManager.isDirectory(endpointPath);
        const isFile = this.__importManager.isFile(`${endpointPath}.js`);
        const hasIndexFile = this.__importManager.isFile(`${endpointPath}/index.js`);
        if (isDirectory && isFile) {
            throw new ImportError(500, 'router-config', 'file & directory cant share name in the same directory');
        }
        if (isFile) {
            return `${endpointPath}.js`;
        }
        if (isDirectory && hasIndexFile) {
            return `${endpointPath}/index.js`;
        }
        throw new ImportError(404, 'url', 'endpoint not found');
    }
}

module.exports = DirectoryResolver;
