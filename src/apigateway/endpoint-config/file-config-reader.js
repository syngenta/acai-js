class FileConfigReader {
    constructor({modulePath, requirer = require}) {
        this._requirer = requirer;
        this._modulePath = modulePath;
        this._checkIfModuleExist(this._modulePath);
    }

    read() {
        return this._requirer(this._modulePath);
    }

    _checkIfModuleExist(modulePath) {
        try {
            this._requirer.resolve(modulePath);
        } catch (e) {
            throw new Error(`can't resolve module ${modulePath}`);
        }
    }
}

module.exports = FileConfigReader;
