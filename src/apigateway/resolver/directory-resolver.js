const ImportManager = require('../import-manager');

class DirectoryResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
        this.__strictRouting = params.strictRouting;
        this.hasPathParams = false;
    }

    resolve(request) {
        const cleanedPaths = this.__getFilePaths(request);
        const endpointPath = this.__getEndpointPath(cleanedPaths);
        return this.__importer.importModuleFromPath(endpointPath);
    }

    __getFilePaths(request) {
        const basePath = this.__importer.cleanPath(this.__basePath);
        const handlerFilePrefix = this.__importer.cleanPath(this.__handlerPath);
        const requestedRoutePath = this.__importer.cleanPath(request.path);
        const requestedFilePath = this.__importer.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, handlerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    __getEndpointPath({handlerFilePrefix, requestedFilePath}) {
        const requestPath = this.__getPathFromRequest(handlerFilePrefix, requestedFilePath);
        const endpointPath = `${handlerFilePrefix}/${requestPath}`;
        const endpointFile = endpointPath.includes('.js') ? endpointPath : `${endpointPath}.js`;
        const endpointIndexFile = `${endpointPath}/index.js`;
        this.__importer.validateFolderStructure(endpointPath, endpointFile);
        if (this.__importer.isFile(endpointFile)) {
            return endpointFile;
        }
        if (this.__importer.isDirectory(endpointPath) && this.__importer.isFile(endpointIndexFile)) {
            return endpointIndexFile;
        }
        this.__importer.raise404();
    }

    __getPathFromRequest(handlerFilePrefix, requestedFilePath) {
        const pathParts = [];
        const splitRequest = requestedFilePath.split('/');
        for (const requestPart of splitRequest) {
            const currentPath = pathParts.length ? `/${pathParts.join('/')}/` : '/';
            const currentDirectory = `${handlerFilePrefix}${currentPath}`;
            const requestFile = `${handlerFilePrefix}${currentPath}${requestPart}.js`;
            const requestDirectory = `${handlerFilePrefix}${currentPath}${requestPart}`;
            if (this.__importer.isFile(requestFile) || this.__importer.isDirectory(requestDirectory)) {
                pathParts.push(requestPart);
            } else if (this.__strictRouting) {
                this.hasPathParams = true;
                const resources = this.__importer.getPathParameterResource(currentDirectory);
                this.__importer.validatePathParameterResource(resources);
                resources.length ? pathParts.push(resources[0]) : null;
            } else {
                this.hasPathParams = true;
            }
        }
        return pathParts.join('/');
    }
}

module.exports = DirectoryResolver;
