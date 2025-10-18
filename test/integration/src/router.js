const {apigateway} = require('acai');
const middleware = require('./middleware');

const router = new apigateway.Router({
    basePath: 'int-test',
    handlerPattern: 'src/routes/**/*.js',
    autoValidate: (process.env.AUTO_VALIDATE ?? 'true').toLowerCase() === 'true',
    validateResponse: (process.env.VALIDATE_RESPONSE ?? 'false').toLowerCase() === 'true',
    afterAll: middleware.afterAll,
    beforeAll: middleware.beforeAll,
    withAuth: middleware.withAuth,
    loggerCallback: middleware.loggerCallback,
    onError: middleware.onError,
    onTimeout: middleware.onTimeout,
    schemaPath: `${__dirname}/../openapi.yml`,
    cacheSize: 100,
    cacheMode: 'all',
    globalLogger: true,
    timeout: 25
});

router.autoLoad();

exports.handler = async (event) => router.route(event);
