const fs = require('fs');
const path = require('path');
const ImportError = require('../import-manager/import-error');
const Logger = require('../../common/logger.js');

class ImportManager {
    constructor() {
        this.__logger = new Logger();
    }

    cleanPath(dirtyPath) {
        const cleanPath = dirtyPath.split('/').filter(Boolean);
        return cleanPath.join('/');
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

    getPathParameterResource(dirPath) {
        const cleanPath = this.cleanPath(dirPath);
        return this.listPathParameterResources(cleanPath);
    }

    listPathParameterResources(cleanPath) {
        const resources = [];
        try {
            const files = fs.readdirSync(cleanPath);
            for (const file of files) {
                if (file.includes('{') && file.includes('}')) {
                    resources.push(file);
                }
            }
        } catch (error) {}
        return resources;
    }

    validateFolderStructure(directory, file) {
        if (this.isDirectory(directory) && this.isFile(file)) {
            throw new ImportError(500, 'router-config', 'file & directory cant share name in the same directory');
        }
    }

    validatePathParameterResource(resources) {
        if (resources.length > 1) {
            throw new ImportError(500, 'router-config', 'can not have path parameter file & directory in the same directory');
        }
    }

    importModuleFromPath(resolved) {
        try {
            return require(path.join(process.cwd(), resolved));
        } catch (error) {
            this.__logger.log({level: 'ERROR', log: error.stack.split('\n').map((trace) => trace.replace('    ', ''))});
            this.raiseRouterConfigError(`Import Error ${resolved}: ${error.message}`);
        }
    }

    raise403() {
        throw new ImportError(403, 'method', 'method not allowed');
    }

    raise404() {
        throw new ImportError(404, 'url', 'endpoint not found');
    }

    raiseRouterConfigError(message) {
        throw new ImportError(500, 'router-config', message);
    }
}

module.exports = ImportManager;
