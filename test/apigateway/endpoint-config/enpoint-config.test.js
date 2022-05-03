const {assert, expect} = require('chai');
const sinon = require('sinon');
const NotFoundModuleError = require('../../../src/apigateway/endpoint-config/not-found-module-error');
const EndpointConfig = require('../../../src/apigateway/endpoint-config');

describe('Test EndpointConfig', () => {
    it('should create with empty constructor', () => {
        const endpointConfig = new EndpointConfig();
        assert.isObject(endpointConfig);
    });

    it('should create with fromEmptyConfig static method', () => {
        const endpointConfig = new EndpointConfig();
        assert.deepEqual(endpointConfig, EndpointConfig.fromEmptyConfig());
    });

    it('should return requirements for the appropriate method', () => {
        const requirements = {get: {foo: 'bar'}};
        const endpointConfig = new EndpointConfig({requirements});
        assert.deepEqual(endpointConfig.getRequirementsByMethodName('get'), requirements.get);
    });

    it('should return undefined if requirements are not setup', () => {
        const requirements = {get: {foo: 'bar'}};
        const endpointConfig = new EndpointConfig({requirements});
        assert.isUndefined(endpointConfig.getRequirementsByMethodName('post'), undefined);

    });

    it('should return appropriate method handler if exist', () => {
        const get = Symbol('get'); // using Symbol to check if it is the same link
        const endpointConfig = new EndpointConfig({get});
        expect(get).to.eq(endpointConfig.getHandlerByMethodName('get'));
    });

    describe('EndpointConfig.fromFilePath', () => {
        it('should read config from file', () => {
            const readFn = sinon.fake();
            const constructorFn = sinon.fake();

            class ConfigReader {
                constructor(props) {
                    constructorFn(props);
                }

                read = readFn;
            }

            const modulePath = 'random/path/string';
            EndpointConfig.fromFilePath({modulePath, ConfigReader});
            expect(readFn.callCount).to.eq(1);
            expect(readFn.getCall(0).args).to.deep.eq([]);
            expect(constructorFn.getCall(0).args).to.deep.eq([{modulePath}]);
        });

        it('should return empty config if error occurs while reading configuration file', () => {
            class ConfigReader {
                read = () => {throw new NotFoundModuleError('module not found')};
            }
            const modulePath = 'random/path/string';
            const config = EndpointConfig.fromFilePath({modulePath, ConfigReader})
            expect(config.getRequirementsByMethodName('get')).to.be.undefined;
            expect(config.getRequirementsByMethodName('patch')).to.be.undefined;
        });

        it('should rethrow the same error if error occurs', () => {
            const error = new Error('random error');
            class ConfigReader {
                read = () => {
                    throw error;
                }
            }
            const modulePath = 'random/path/string';
            expect(() => EndpointConfig.fromFilePath({modulePath, ConfigReader})).to.throw('random error');
        });
    });
});
