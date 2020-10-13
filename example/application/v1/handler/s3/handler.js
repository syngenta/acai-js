const EventClient = require('@syngenta-digital/alc').sqs.Event;

exports.handle = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
