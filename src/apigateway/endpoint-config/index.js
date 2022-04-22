const FileConfigReader = require('./file-config-reader');
const NotFoundModuleError = require('./not-found-module-error');

const emptyEndpoint = {requirements: {}};

class EndpointConfig {
    constructor({requirements, ...methods}) {
        this._requirements = requirements;
        this._methods = methods;
    }

    setModuleError() {
        this._moduleError = true;
    }

    ifExist() {
        return Object.keys(this._methods).length > 0;
    }

    getRequirementsByMethodName(methodName) {
        return this._requirements ? this._requirements[methodName]: undefined;
    }

    getHandlerByMethodName(methodName) {
        return this._methods[methodName];
    }

    ifMethodExist(methodName) {
        const method = this.getHandlerByMethodName(methodName);
        return method && typeof method === 'function';
    }

    static forNonExistingEndpoint() {
        return new EndpointConfig(emptyEndpoint);
    }

    static fromFilePath({modulePath}) {
        const fileReader = new FileConfigReader({modulePath});
        try {
            return new EndpointConfig(fileReader.read());
        } catch (e) {
            if (e instanceof NotFoundModuleError) {
                return EndpointConfig.forNonExistingEndpoint();
            }
            throw e;
        }
    }
}

module.exports = EndpointConfig;
