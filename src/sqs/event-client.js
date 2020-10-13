const RecordClient = require('./record-client');

class EventClient {
    constructor(event, params = {}) {
        this._event = event;
        this._setUpLogger(params.globalLogger);
    }

    _setUpLogger(globalLogger = false) {
        if (globalLogger) {
            require('../common/setup-logger.js').setUpLogger();
        }
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
