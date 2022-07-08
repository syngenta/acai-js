class RecordClient {
    constructor(record) {
        this._record = record;
        this.__isValid = true;
    }

    get isValid() {
        return this.__isValid;
    }

    set isValid(isValid) {
        this.__isValid = isValid;
    }

    get operation() {
        if (this.eventName.includes('ObjectCreated')) {
            return 'create';
        }
        if (this.eventName.includes('ObjectRemoved')) {
            return 'delete';
        }
        return 'unknown';
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

    get key() {
        return this._record.s3.object.key;
    }

    get s3SchemaVersion() {
        return this._record.s3.s3SchemaVersion;
    }

    set body(body) {
        this._record.body = body;
    }

    get body() {
        return this._record.body;
    }
}

module.exports = RecordClient;
