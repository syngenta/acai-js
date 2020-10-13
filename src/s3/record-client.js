class RecordClient {
    constructor(record) {
        this._record = record;
    }

    get eventName() {
        return this._record.eventName;
    }

    get eventSource() {
        return this._record.eventSource;
    }

    get eventTime() {
        return this._record.eventTime;
    }

    get awsRegion() {
        return this._record.awsRegion;
    }

    get requestParameters() {
        return this._record.requestParameters;
    }

    get responseElements() {
        return this._record.responseElements;
    }

    get configurationId() {
        return this._record.s3.configurationId;
    }

    get object() {
        return this._record.s3.object;
    }

    get bucket() {
        return this._record.s3.bucket;
    }

    get s3SchemaVersion() {
        return this._record.s3.s3SchemaVersion;
    }
}

module.exports = RecordClient;
