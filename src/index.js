module.exports = {
    logger: {
        setup: require('./common/setUpLogger').setUpLogger,
        Logger: require('./common/logger')
    },
    apigateway: {
        Request: require('./apigateway/requestClient'),
        Response: require('./apigateway/responseClient'),
        Validator: require('./apigateway/requestValidator'),
        Router: require('./apigateway/router')
    },
    sqs: {
        Event: require('./sqs/eventClient'),
        Record: require('./sqs/recordClient')
    }
};
