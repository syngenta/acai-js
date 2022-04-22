const path = require('path');
const NotFoundModuleError = require('./not-found-module-error');
const appRoot = require('app-root-path');

class FileConfigReader {
    constructor({modulePath, requirer = require}) {
        this._requirer = requirer;
        this._modulePath = modulePath;
        const finalPath = path.join(appRoot.path, modulePath);
        this._finalPath = finalPath;
        this._checkIfModuleExist();
    }

    read() {
        return this._requirer(this._finalPath);
    }

    _checkIfModuleExist() {
        try {
            this._requirer.resolve(this._finalPath);
        } catch (e) {
            throw new NotFoundModuleError(`can't resolve module ${this._modulePath}`);
        }
    }
}

module.exports = FileConfigReader;
