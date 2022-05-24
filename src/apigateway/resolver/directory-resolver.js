const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class DirectoryResolver {
    constructor(params) {
        this.__importManager = new ImportManager();
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
        this.hasPathParams = false;
    }

    resolve(request) {
        const cleanedPaths = this.__getFilePaths(request);
        const endpointPath = this.__getEndpointPath(cleanedPaths);
        return this.__importManager.importModuleFromPath(endpointPath);
    }

    __getFilePaths(request) {
        const basePath = this.__importManager.cleanPath(this.__basePath);
        const handlerFilePrefix = this.__importManager.cleanPath(this.__handlerPath);
        const requestedRoutePath = this.__importManager.cleanPath(request.route);
        const requestedFilePath = this.__importManager.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, handlerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    __getEndpointPath({handlerFilePrefix, requestedFilePath}) {
        const requestPath = this.__getPathFromRequest(handlerFilePrefix, requestedFilePath);
        const endpointPath = `${handlerFilePrefix}/${requestPath}`;
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
    __getPathFromRequest(handlerFilePrefix, requestedFilePath) {
        const pathParts = [];
        const splitRequest = requestedFilePath.split('/');
        for (const requestPart of splitRequest) {
            const currentPath = pathParts.length ? `/${pathParts.join('/')}/` : '/';
            const requestFile = `${handlerFilePrefix}${currentPath}${requestPart}.js`;
            const requestDirectory = `${handlerFilePrefix}${currentPath}${requestPart}`;
            if (this.__importManager.isFile(requestFile) || this.__importManager.isDirectory(requestDirectory)) {
                pathParts.push(requestPart);
            } else {
                this.hasPathParams = true;
            }
        }
        return pathParts.join('/');
    }
}

module.exports = DirectoryResolver;
