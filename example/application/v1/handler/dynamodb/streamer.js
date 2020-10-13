const EventClient = require('@syngenta-digital/alc').sqs.Event;

exports.stream = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
