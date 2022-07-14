class RecordClient {
    constructor(record) {
        this.__record = record;
        this.__isValid = true;
    }

    get attributes() {
        return this.__record.attributes;
    }

    get body() {
        try {
            return JSON.parse(this.__record.body);
        } catch (error) {
            return this.raw;
        }
    }

    get id() {
        return this.__record.messageId;
    }

    get isValid() {
        return this.__isValid;
    }

    set isValid(isValid) {
        this.__isValid = isValid;
    }

    get md5() {
        return this.__record.md5OfBody;
    }

    get messageAttributes() {
        const attributes = {};
        for (const attribute in this.__record.messageAttributes) {
            attributes[attribute] = this.__record.messageAttributes[attribute].stringValue;
        }
        return attributes;
    }

    get operation() {
        return 'create';
    }

    get receiptHandle() {
        return this.__record.receiptHandle;
    }

    get raw() {
        return this.__record.body;
    }

    get record() {
        return this.__record;
    }

    get region() {
        return this.__record.awsRegion;
    }

    get source() {
        return this.__record.eventSource;
    }

    get sourceARN() {
        return this.__record.eventSourceARN;
    }
}

module.exports = RecordClient;
