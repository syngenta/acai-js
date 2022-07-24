const AWS = require('aws-sdk');

class RecordClient {
    constructor(record) {
        this.__record = record;
        this.__converter = AWS.DynamoDB.Converter.unmarshall;
        this.__isValid = true;
    }

    get body() {
        return this.newImage;
    }

    get created() {
        return this.__record.dynamodb.ApproximateCreationDateTime;
    }

    get expired() {
        return Boolean(this.__record.userIdentity && this.__record.userIdentity.type && this.__record.userIdentity.principalId);
    }

    get id() {
        return this.__record.eventID;
    }

    get identity() {
        return this.__record.userIdentity;
    }

    get isValid() {
        return this.__isValid;
    }

    set isValid(isValid) {
        this.__isValid = isValid;
    }

    get keys() {
        return this.__converter(this.__record.dynamodb.Keys);
    }

    get name() {
        return this.__record.eventName;
    }

    get newImage() {
        return this.__converter(this.__record.dynamodb.NewImage);
    }

    get oldImage() {
        return this.__converter(this.__record.dynamodb.OldImage);
    }

    get operation() {
        if (Object.keys(this.newImage).length && !Object.keys(this.oldImage).length) {
            return 'create';
        }
        if (Object.keys(this.newImage).length && Object.keys(this.oldImage).length) {
            return 'update';
        }
        if (!Object.keys(this.newImage).length && Object.keys(this.oldImage).length) {
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

    get size() {
        return this.__record.dynamodb.SizeBytes;
    }

    get source() {
        return this.__record.eventSource;
    }

    get sourceARN() {
        return this.__record.eventSourceARN;
    }

    get streamType() {
        return this.__record.dynamodb.StreamViewType;
    }

    get version() {
        return this.__record.eventVersion;
    }
}

module.exports = RecordClient;
