const ImportManager = require('../import-manager');

class DirectoryResolver {
    constructor(params, importer) {
        this.__importer = importer;
        this.__sep = importer.fileSeparator;
        this.__basePath = params.basePath;
        this.__handlerPath = params.handlerPath;
        this.hasPathParams = false;
        this.pathParams = [];
    }

    resolve(request) {
        this.__importer.setHandlers(this.__handlerPath);
        const cleanedPaths = this.__getFilePaths(request);
        const fileTree = this.__importer.getFileTree();
        const endpointPath = this.__getEndpointPath(fileTree, cleanedPaths);
        const resolvedPath = this.__importer.importModuleFromPath(endpointPath);
        return resolvedPath;
    }

    reset() {
        this.hasPathParams = false;
        this.pathParams = [];
        this.__importer.reset();
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
        const importFilePath = this.__importer.getImportPath();
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
                this.__importer.appendImportPath(possibleFile);
            } else if ('__dynamicPath' in fileTree && fileTree['__dynamicPath'].size > 0) {
                this.__handleDynamicPath(fileTree, splitRequest, index);
            } else {
                this.__importer.raise404();
            }
        }
    }

    __handleDirectoryPath(fileTree, possibleDir, splitRequest, index) {
        this.__importer.appendImportPath(possibleDir);
        if (index + 1 === splitRequest.length) {
            this.__importer.appendImportPath('index.js');
        } else {
            this.__findRequestedFileWithinFileTree(fileTree[possibleDir], splitRequest, index + 1);
        }
    }

    __handleDynamicPath(fileTree, splitRequest, index) {
        const [part] = fileTree['__dynamicPath'];
        this.__importer.appendImportPath(part);
        this.hasPathParams = true;
        this.pathParams[index] = splitRequest[index];
        if (!part.includes('.js') && index + 1 === splitRequest.length) {
            this.__importer.appendImportPath('index.js');
        } else if (!part.includes('.js')) {
            this.__findRequestedFileWithinFileTree(fileTree[part], splitRequest, index + 1);
        }
    }
}

module.exports = DirectoryResolver;
