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

    importModuleFromPath(resolved) {
        try {
            return require(path.join(process.cwd(), resolved));
        } catch (error) {
            throw new ImportError(500, 'router-config', `Import Error ${resolved}: ${error.message}`);
        }
    }
}

module.exports = ImportManager;
