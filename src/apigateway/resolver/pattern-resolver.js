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
        const files = this.getFiles(request.route);
        const endpointPath = this.getEndpointPath(files);
        return this.__importer.importModuleFromPath(endpointPath);
    }

    getFiles(route) {
        const globFiles = glob.readdirSync(this.__pattern, {});
        const splitPattern = this.__pattern.split('*');
        const fileSuffix = splitPattern[splitPattern.length - 1];
        const base = this.__importer.cleanPath(this.__basePath);
        const requestedFile = this.__importer.cleanPath(route.replace(base, ''));
        const splitFile = requestedFile.split('/');
        const lastFile = splitFile[splitFile.length - 1];
        return {requestedFile, fileSuffix, lastFile, globFiles};
    }

    getEndpointPath({requestedFile, fileSuffix, lastFile, globFiles}) {
        const mvcFiles = globFiles.filter((file) => file.includes(`${requestedFile}${fileSuffix}`));
        const mvvmFiles = globFiles.filter((file) => file.includes(`${requestedFile}/${lastFile}${fileSuffix}`));
        const directories = globFiles.filter((file) => file.endsWith(lastFile));
        if (
            directories.length &&
            mvcFiles.length &&
            this.__importer.isFile(mvcFiles[0]) &&
            this.__importer.isDirectory(directories[0])
        ) {
            throw new ImportError(500, 'router-config', 'file & directory cant share name in the same directory');
        }
        if (mvvmFiles.length && this.__importer.isFile(mvvmFiles[0])) {
            return mvvmFiles[0];
        }
        if (mvcFiles.length && this.__importer.isFile(mvcFiles[0])) {
            return mvcFiles[0];
        }
        throw new ImportError(404, 'url', 'endpoint not found');
    }
}

module.exports = PatternResolver;
