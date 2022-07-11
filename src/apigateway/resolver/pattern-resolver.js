const ImportManager = require('../import-manager');

class PatternResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__pattern = params.handlerPattern;
        this.hasPathParams = false;
    }

    resolve(request) {
        const filePath = this.__getFilePath(request.path);
        if (filePath && this.__importer.isFile(filePath)) {
            return this.__importer.importModuleFromPath(filePath);
        }
        this.__importer.raise404();
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
        for (const [index, requestPart] of splitRequest.entries()) {
            const file = filePattern.replace('*', requestPart);
            const currentPath = pathParts.length ? `/${pathParts.join('/')}/` : '/';
            const currentDirectory = `${patternBase}${currentPath}`;
            const mvc = `${patternBase}${currentPath}${file}`;
            const mvvm = `${patternBase}${currentPath}${requestPart}/${file}`;
            const directory = `${patternBase}${currentPath}${requestPart}`;
            this.__importer.validateFolderStructure(directory, mvc);
            if (this.__importer.isFile(mvc)) {
                pathParts.push(file);
            } else if (this.__importer.isFile(mvvm)) {
                pathParts.push(requestPart);
                pathParts.push(file);
            } else if (this.__importer.isDirectory(directory)) {
                pathParts.push(requestPart);
            } else {
                this.__addParamFiles(currentDirectory, filePattern, patternBase, pathParts, splitRequest, index);
            }
        }
        pathParts.unshift(patternBase);
        return pathParts.join('/');
    }

    __addParamFiles(currentDirectory, filePattern, patternBase, pathParts, splitRequest, index) {
        this.hasPathParams = true;
        const resources = this.__importer.getPathParameterResource(currentDirectory);
        this.__importer.validatePathParameterResource(resources);
        if (resources.length) {
            pathParts.push(resources[0]);
            const indexPattern = filePattern.replace('*', 'index');
            const cleanDirectory = this.__importer.cleanPath(currentDirectory);
            const mvvmDirectory = `${cleanDirectory}/${resources[0]}`;
            const mvcIndex = `${cleanDirectory}/${resources[0]}/${indexPattern}`;
            const nextPath = `${patternBase}/${pathParts.join('/')}/${splitRequest[index + 1]}`;
            if (this.__importer.isFile(mvcIndex) && !this.__importer.isDirectory(nextPath)) {
                pathParts.push(indexPattern);
            }
            if (this.__importer.isDirectory(mvvmDirectory) && !this.__importer.isDirectory(nextPath)) {
                const dirResources = this.__importer.getPathParameterResource(mvvmDirectory);
                dirResources.length ? pathParts.push(dirResources[0]) : null;
            }
        }
    }
}

module.exports = PatternResolver;
