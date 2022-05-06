module.exports = {
    apigateway: {
        Request: require('./apigateway/request'),
        Response: require('./apigateway/response'),
        Router: require('./apigateway/router')
    },
    dynamodb: {
        Event: require('./dynamodb/event-client'),
        Record: require('./dynamodb/record-client')
    },
    logger: {
        setup: require('./common/logger').setUpLogger,
        Logger: require('./common/logger')
    },
    s3: {
        Event: require('./s3/event-client'),
        Record: require('./s3/record-client')
    },
    sqs: {
        Event: require('./sqs/event-client'),
        Record: require('./sqs/record-client')
    }
};
