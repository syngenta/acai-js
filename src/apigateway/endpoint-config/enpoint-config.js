const FileConfigReader = require('./file-config-reader');
const NotFoundModuleError = require('./not-found-module-error');

class EndpointConfig {
    constructor({requirements = {}, ...methods} = {}) {
        this._requirements = requirements;
        this._methods = methods;
    }

    ifExist() {
        return Object.keys(this._methods).length > 0;
    }

    getRequirementsByMethodName(methodName) {
        return this._requirements[methodName];
    }

    getHandlerByMethodName(methodName) {
        return this._methods[methodName];
    }

    ifMethodExist(methodName) {
        const method = this.getHandlerByMethodName(methodName);
        return method && typeof method === 'function';
    }

    static fromEmptyConfig() {
        return new EndpointConfig();
    }

    static fromFilePath({modulePath, ConfigReader = FileConfigReader}) {
        const fileReader = new ConfigReader({modulePath});
        try {
            return new EndpointConfig(fileReader.read());
        } catch (e) {
            if (e instanceof NotFoundModuleError) {
                return EndpointConfig.fromEmptyConfig();
            }
            throw e;
        }
    }
}

module.exports = EndpointConfig;
