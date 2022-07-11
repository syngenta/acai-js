const fs = require('fs');
const path = require('path');
const ImportError = require('../import-manager/import-error');

class ImportManager {
    cleanPath(dirtyPath) {
        if (dirtyPath.startsWith('/')) {
            dirtyPath = dirtyPath.substr(1);
        }
        if (dirtyPath.endsWith('/')) {
            dirtyPath = dirtyPath.slice(0, -1);
        }
        return dirtyPath;
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
            throw new ImportError(
                500,
                'router-config',
                'cant have path parameter file & directory in the same directory'
            );
        }
    }

    importModuleFromPath(resolved) {
        try {
            return require(path.join(process.cwd(), resolved));
        } catch (error) {
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
