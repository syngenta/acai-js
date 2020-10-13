const EventClient = require('@syngenta-digital/alc').sqs.Event;

exports.listen = async (event) => {
    const eventClient = new EventClient(event);
    for (const record of eventClient.records) {
        console.log(record);
    }
};
