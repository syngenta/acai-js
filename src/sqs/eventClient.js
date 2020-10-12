const RecordClient = require('./recordClient');
require('../common/setUpLogger.js').setUpLogger();

class EventClient {
    constructor(event) {
        this._event = event;
    }

    get records() {
        const records = [];
        for (const record of this._event.Records) {
            records.push(new RecordClient(record));
        }
        return records;
    }

    get rawRecords() {
        return this._event.Records;
    }
}

module.exports = EventClient;
