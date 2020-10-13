const {Router} = require('@syngenta-digital/alc').apigateway;
exports.route = async (event) => {
    const router = new Router({
        event,
        basePath: 'alc-example/v1',
        handlerPath: 'application/v1/handler/apigateway',
        schemaPath: 'application/openapi.yml'
    });
    return router.route();
};
