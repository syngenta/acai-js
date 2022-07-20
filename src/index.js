module.exports = {
    apigateway: {
        Request: require('./apigateway/request'),
        Response: require('./apigateway/response'),
        Router: require('./apigateway/router')
    },
    dynamodb: {
        Event: require('./common/event'),
        Record: require('./dynamodb/record')
    },
    logger: {
        setup: require('./common/logger').setUpGlobal,
        Logger: require('./common/logger')
    },
    s3: {
        Event: require('./common/event'),
        Record: require('./s3/record')
    },
    sqs: {
        Event: require('./common/event'),
        Record: require('./sqs/record')
    }
};
