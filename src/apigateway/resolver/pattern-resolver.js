const ImportManager = require('./import-manager');

class PatternResolver {
    constructor(params, importer) {
        this.__importer = importer;
        this.__sep = importer.fileSeparator;
        this.__basePath = params.basePath;
        this.__pattern = params.handlerPattern;
        this.hasPathParams = false;
        this.importParts = [];
    }

    autoLoad() {
        this.__importer.setHandlers(this.__pattern);
        this.__importer.getFileTree();
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
        this.__importer.setHandlers(this.__pattern);
        this.importParts = [];
        this.hasPathParams = false;
    }

    __getFilePaths(request) {
        const patternRoot = this.__importer.cleanPath(this.__pattern.split('*')[0]);
        const basePath = this.__importer.cleanPath(this.__basePath);
        const requestPath = this.__importer.cleanPath(request.path.replace(basePath, ''));
        return {patternRoot, basePath, requestPath};
    }

    __getEndpointPath(fileTree, {patternRoot, requestPath}) {
        const splitPattern = this.__pattern.split(this.__sep);
        const filePattern = splitPattern[splitPattern.length - 1];
        this.__findRequestedFileWithinFileTree(fileTree, filePattern, requestPath.split(this.__sep), 0);
        const importFilePath = this.__importer.getImportPath(this.importParts);
        const endpointPath = `${patternRoot}/${importFilePath}`;
        return endpointPath;
    }

    __findRequestedFileWithinFileTree(fileTree, filePattern, splitRequest, index) {
        if (index < splitRequest.length) {
            const requestPart = splitRequest[index];
            const possibleFile = filePattern.replace('*', requestPart);
            const possibleIndex = filePattern.replace('*', 'index');
            const possibleDir = requestPart;
            if (possibleDir in fileTree) {
                this.__handleDirectoryPath(fileTree, filePattern, possibleDir, splitRequest, index);
            } else if (possibleFile in fileTree) {
                this.importParts.push(possibleFile);
            } else if ('__dynamicPath' in fileTree && fileTree['__dynamicPath'].size > 0) {
                this.__handleDynamicPath(fileTree, filePattern, splitRequest, index);
            } else if (this.hasPathParams && possibleIndex in fileTree && index === splitRequest.length - 1) {
                this.importParts.push(possibleIndex);
            } else {
                this.__importer.raise404();
            }
        }
    }

    __handleDirectoryPath(fileTree, filePattern, possibleDir, splitRequest, index) {
        this.importParts.push(possibleDir);
        if (index + 1 === splitRequest.length) {
            this.__determineAdditionalImportPath(fileTree, filePattern, possibleDir);
        } else {
            this.__findRequestedFileWithinFileTree(fileTree[possibleDir], filePattern, splitRequest, index + 1);
        }
    }

    __handleDynamicPath(fileTree, filePattern, splitRequest, index) {
        const [part] = fileTree['__dynamicPath'];
        this.hasPathParams = true;
        this.importParts.push(part);
        if (!part.includes('.js') && index + 1 >= splitRequest.length) {
            this.__determineAdditionalImportPath(fileTree, filePattern, part);
        } else if (!part.includes('.js')) {
            this.__findRequestedFileWithinFileTree(fileTree[part], filePattern, splitRequest, index + 1);
        }
    }

    __determineAdditionalImportPath(fileTree, filePattern, possibleDir) {
        const indexFile = filePattern.replace('*', 'index');
        const mvvmFile = filePattern.replace('*', possibleDir);
        if (mvvmFile in fileTree[possibleDir]) {
            this.importParts.push(mvvmFile);
        } else if (indexFile in fileTree[possibleDir]) {
            this.importParts.push(indexFile);
        }
    }
}

module.exports = PatternResolver;
