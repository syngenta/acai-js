exports.getData = () => {
    return {
        Records: [
            {
                eventVersion: '2.0',
                eventSource: 'aws:s3',
                awsRegion: 'us-east-1',
                eventTime: '2018-09-20T21:10:13.821Z',
                eventName: 'ObjectCreated:Put',
                userIdentity: {
                    principalId: 'AWS:AROAI7Z5ZQEQ3UETKKYGQ:deploy-workers-poc-put-v1-photo'
                },
                requestParameters: {
                    sourceIPAddress: '172.20.133.36'
                },
                responseElements: {
                    'x-amz-request-id': '6B859DD0CE613FAE',
                    'x-amz-id-2': 'EXLMfc9aiXZFzNwLKXpw35iaVvl/DkEA6GtbuxjfmuLN3kLPL/aGoa7NMSwpl3m7ICAtNbjJX4w='
                },
                s3: {
                    s3SchemaVersion: '1.0',
                    configurationId: 'exS3-v2--7cde234c7ff76c53c44990396aeddc6d',
                    bucket: {
                        name: 'deploy-workers-poc-photos',
                        ownerIdentity: {
                            principalId: 'A32KFL0DQ3MH8X'
                        },
                        arn: 'arn:aws:s3:::deploy-workers-poc-photos'
                    },
                    object: {
                        key: '123456789/3c8e97105d5f462f8896a7189910ee16-original.jpg',
                        size: 17545,
                        eTag: 'b79ac2ef68c08fa9ac6013d53038a26c',
                        sequencer: '005BA40CB5BD42013A'
                    }
                }
            }
        ]
    };
};

exports.getJsonData = () => {
    return {
        Records: [
            {
                eventVersion: '2.0',
                eventSource: 'aws:s3',
                awsRegion: 'us-east-1',
                eventTime: '2018-09-20T21:10:13.821Z',
                eventName: 'ObjectCreated:Put',
                userIdentity: {
                    principalId: 'AWS:AROAI7Z5ZQEQ3UETKKYGQ:deploy-workers-poc-put-v1-photo'
                },
                requestParameters: {
                    sourceIPAddress: '172.20.133.36'
                },
                responseElements: {
                    'x-amz-request-id': '6B859DD0CE613FAE',
                    'x-amz-id-2': 'EXLMfc9aiXZFzNwLKXpw35iaVvl/DkEA6GtbuxjfmuLN3kLPL/aGoa7NMSwpl3m7ICAtNbjJX4w='
                },
                s3: {
                    s3SchemaVersion: '1.0',
                    configurationId: 'exS3-v2--7cde234c7ff76c53c44990396aeddc6d',
                    bucket: {
                        name: 'unit-test',
                        ownerIdentity: {
                            principalId: 'A32KFL0DQ3MH8X'
                        },
                        arn: 'arn:aws:s3:::unit-test'
                    },
                    object: {
                        key: 'example.json',
                        size: 17545,
                        eTag: 'b79ac2ef68c08fa9ac6013d53038a26c',
                        sequencer: '005BA40CB5BD42013A'
                    }
                }
            }
        ]
    };
};

exports.getCsvData = () => {
    return {
        Records: [
            {
                eventVersion: '2.0',
                eventSource: 'aws:s3',
                awsRegion: 'us-east-1',
                eventTime: '2018-09-20T21:10:13.821Z',
                eventName: 'ObjectCreated:Put',
                userIdentity: {
                    principalId: 'AWS:AROAI7Z5ZQEQ3UETKKYGQ:deploy-workers-poc-put-v1-photo'
                },
                requestParameters: {
                    sourceIPAddress: '172.20.133.36'
                },
                responseElements: {
                    'x-amz-request-id': '6B859DD0CE613FAE',
                    'x-amz-id-2': 'EXLMfc9aiXZFzNwLKXpw35iaVvl/DkEA6GtbuxjfmuLN3kLPL/aGoa7NMSwpl3m7ICAtNbjJX4w='
                },
                s3: {
                    s3SchemaVersion: '1.0',
                    configurationId: 'exS3-v2--7cde234c7ff76c53c44990396aeddc6d',
                    bucket: {
                        name: 'unit-test',
                        ownerIdentity: {
                            principalId: 'A32KFL0DQ3MH8X'
                        },
                        arn: 'arn:aws:s3:::unit-test'
                    },
                    object: {
                        key: 'example.csv',
                        size: 17545,
                        eTag: 'b79ac2ef68c08fa9ac6013d53038a26c',
                        sequencer: '005BA40CB5BD42013A'
                    }
                }
            }
        ]
    };
};
