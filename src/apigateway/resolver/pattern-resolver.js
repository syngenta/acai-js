const fs = require('fs');
const glob = require('glob-fs')({gitignore: true});
const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class PatternResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__pattern = params.handlerPattern;
    }

    resolve(request) {
        const files = this.__getFilePaths(request.route);
        const endpointPath = this.__getEndpointPath(files);
        return this.__importer.importModuleFromPath(endpointPath);
    }

    __getFilePaths(route) {
        const root = this.__getPatternRoute();
        const directory = this.__getRequestDirectoryPath(route);
        const file = this.__getRequestHandlerFile(route);
        const sub = this.__getSubDirectory(route);
        const files = this.__findFilesFromGlob();
        const mvc = `${root}/${directory}/${file}`.replace(/\/\//g, '/');
        const mvvm = `${root}/${directory}/${sub}/${file}`.replace(/\/\//g, '/');
        return {mvvm, mvc, files};
    }

    __getEndpointPath({mvc, mvvm, files}) {
        const mvvmFile = files.find((file) => file.includes(mvc));
        const mvcFile = files.find((file) => file.includes(mvvm));
        if (mvvmFile && mvcFile) {
            throw new ImportError(500, 'router-config', 'file & directory cant share name in the same directory');
        }
        if (mvvmFile && this.__importer.isFile(mvvmFile)) {
            return mvvmFile;
        }
        if (mvcFile && this.__importer.isFile(mvcFile)) {
            return mvcFile;
        }
        throw new ImportError(404, 'url', 'endpoint not found');
    }

    __getPatternRoute() {
        const split = this.__pattern.split('*');
        return this.__importer.cleanPath(split[0]);
    }

    __getRequestDirectoryPath(route) {
        const base = this.__importer.cleanPath(this.__basePath);
        const noBaseRoute = route.replace(base, '');
        const noBaseSplit = noBaseRoute.split('/');
        noBaseSplit.pop();
        return this.__importer.cleanPath(noBaseSplit.join('/'));
    }

    __getRequestHandlerFile(route) {
        const splitPattern = this.__pattern.split('/');
        const splitRoute = route.split('/');
        const lastRoute = splitRoute[splitRoute.length - 1];
        const filePattern = splitPattern[splitPattern.length - 1];
        return filePattern.replace('*', lastRoute);
    }

    __findFilesFromGlob() {
        const globArray = glob.readdirSync(this.__pattern, {});
        const globSet = new Set(globArray);
        return [...globSet];
    }

    __getSubDirectory(route) {
        const splitRoute = route.split('/');
        return splitRoute[splitRoute.length - 1];
    }
}

module.exports = PatternResolver;
