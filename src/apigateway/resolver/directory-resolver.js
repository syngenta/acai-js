const ImportManager = require('../import-manager');

class DirectoryResolver {
    constructor(params, importer) {
        this.__importer = importer;
        this.__sep = importer.fileSeparator;
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
        this.hasPathParams = false;
        this.importParts = [];
        this.pathParams = [];
    }

    resolve(request) {
        this.reset();
        const fileTree = this.__importer.getFileTree();
        const cleanedPaths = this.__getFilePaths(request);
        const endpointPath = this.__getEndpointPath(fileTree, cleanedPaths);
        const resolvedModule = this.__importer.importModuleFromPath(endpointPath);
        return resolvedModule;
    }

    reset() {
        this.__importer.setHandlers(this.__handlerPath);
        this.importParts = [];
        this.pathParams = [];
        this.hasPathParams = false;
    }

    __getFilePaths(request) {
        const basePath = this.__importer.cleanPath(this.__basePath);
        const handlerFilePrefix = this.__importer.cleanPath(this.__handlerPath);
        const requestedRoutePath = this.__importer.cleanPath(request.path);
        const requestedFilePath = this.__importer.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, handlerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    __getEndpointPath(fileTree, {handlerFilePrefix, requestedFilePath}) {
        this.__findRequestedFileWithinFileTree(fileTree, requestedFilePath.split(this.__sep), 0);
        const importFilePath = this.__importer.getImportPath(this.importParts);
        const endpointPath = `${handlerFilePrefix}/${importFilePath}`;
        return endpointPath;
    }

    __findRequestedFileWithinFileTree(fileTree, splitRequest, index) {
        if (index < splitRequest.length) {
            const part = splitRequest[index];
            const possibleDir = part;
            const possibleFile = `${part}.js`;
            if (possibleDir in fileTree) {
                this.__handleDirectoryPath(fileTree, possibleDir, splitRequest, index);
            } else if (possibleFile in fileTree) {
                this.importParts.push(possibleFile);
            } else if ('__dynamicPath' in fileTree && fileTree['__dynamicPath'].size > 0) {
                this.__handleDynamicPath(fileTree, splitRequest, index);
            } else {
                this.__importer.raise404();
            }
        }
    }

    __handleDirectoryPath(fileTree, possibleDir, splitRequest, index) {
        this.importParts.push(possibleDir);
        if (index + 1 === splitRequest.length) {
            this.importParts.push('index.js');
        } else {
            this.__findRequestedFileWithinFileTree(fileTree[possibleDir], splitRequest, index + 1);
        }
    }

    __handleDynamicPath(fileTree, splitRequest, index) {
        const [part] = fileTree['__dynamicPath'];
        this.pathParams[index] = splitRequest[index];
        this.hasPathParams = true;
        this.importParts.push(part);
        if (!part.includes('.js') && index + 1 === splitRequest.length - 1) {
            this.importParts.push('index.js');
        } else if (!part.includes('.js')) {
            this.__findRequestedFileWithinFileTree(fileTree[part], splitRequest, index + 1);
        }
    }
}

module.exports = DirectoryResolver;
