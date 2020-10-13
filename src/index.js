module.exports = {
    logger: {
        setup: require('./common/setup-logger').setUpLogger,
        Logger: require('./common/logger')
    },
    apigateway: {
        Request: require('./apigateway/request-client'),
        Response: require('./apigateway/response-client'),
        Validator: require('./apigateway/request-validator'),
        Router: require('./apigateway/router')
    },
    sqs: {
        Event: require('./sqs/event-client'),
        Record: require('./sqs/record-client')
    }
};
