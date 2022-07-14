class RecordClient {
    constructor(record) {
        this.__record = record;
        this.__isValid = true;
    }

    get bucket() {
        return this.__record.s3.bucket;
    }

    set body(body) {
        this.__record.body = body;
    }

    get body() {
        return this.__record.body;
    }

    get isValid() {
        return this.__isValid;
    }

    set isValid(isValid) {
        this.__isValid = isValid;
    }

    get id() {
        return this.__record.s3.configurationId;
    }

    get key() {
        return this.__record.s3.object.key;
    }

    get name() {
        return this.__record.eventName;
    }

    get object() {
        return this.__record.s3.object;
    }

    get operation() {
        if (this.name.includes('ObjectCreated')) {
            return 'create';
        }
        if (this.name.includes('ObjectRemoved')) {
            return 'delete';
        }
        return 'unknown';
    }

    get record() {
        return this.__record;
    }

    get region() {
        return this.__record.awsRegion;
    }

    get request() {
        return this.__record.requestParameters;
    }

    get response() {
        return this.__record.responseElements;
    }

    get source() {
        return this.__record.eventSource;
    }

    get time() {
        return this.__record.eventTime;
    }

    get version() {
        return this.__record.s3.s3SchemaVersion;
    }
}

module.exports = RecordClient;
