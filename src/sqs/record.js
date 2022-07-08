class RecordClient {
    constructor(record) {
        this._record = record;
        this.__isValid = true;
    }

    get messageId() {
        return this._record.messageId;
    }

    get receiptHandle() {
        return this._record.receiptHandle;
    }

    get body() {
        try {
            return JSON.parse(this._record.body);
        } catch (error) {
            return this.rawBody;
        }
    }

    get rawBody() {
        return this._record.body;
    }

    get attributes() {
        return this._record.attributes;
    }

    get operation() {
        return 'create';
    }

    get messageAttributes() {
        const attributes = {};
        for (const attribute in this._record.messageAttributes) {
            attributes[attribute] = this._record.messageAttributes[attribute].stringValue;
        }
        return attributes;
    }

    get md5OfBody() {
        return this._record.md5OfBody;
    }

    get eventSource() {
        return this._record.eventSource;
    }

    get sourceARN() {
        return this._record.eventSourceARN;
    }

    get region() {
        return this._record.awsRegion;
    }

    get isValid() {
        return this.__isValid;
    }

    set isValid(isValid) {
        this.__isValid = isValid;
    }
}

module.exports = RecordClient;
