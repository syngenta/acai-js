exports.getData = () => {
    return {
        Records: [
            {
                eventID: '9a37c0d03eb60f7cf70cabc823de9907',
                eventName: 'INSERT',
                eventVersion: '1.1',
                eventSource: 'aws:dynamodb',
                awsRegion: 'us-east-1',
                dynamodb: {
                    ApproximateCreationDateTime: 1538695200.0,
                    Keys: {
                        example_id: {
                            S: '123456789'
                        }
                    },
                    NewImage: {
                        example_id: {
                            S: '123456789'
                        },
                        note: {
                            S: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.'
                        },
                        active: {
                            BOOL: true
                        },
                        personal: {
                            M: {
                                gender: {
                                    S: 'male'
                                },
                                last_name: {
                                    S: 'Mcneil'
                                },
                                first_name: {
                                    S: 'Mannix'
                                }
                            }
                        },
                        transportation: {
                            L: [
                                {
                                    S: 'public-transit'
                                },
                                {
                                    S: 'car-access'
                                }
                            ]
                        }
                    },
                    SequenceNumber: '162100000000001439016707',
                    SizeBytes: 1124,
                    StreamViewType: 'NEW_AND_OLD_IMAGES'
                },
                eventSourceARN:
                    'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            }
        ]
    };
};

exports.getTTLData = () => {
    return {
        Records: [
            {
                eventID: '9a37c0d03eb60f7cf70cabc823de9907',
                eventName: 'INSERT',
                eventVersion: '1.1',
                eventSource: 'aws:dynamodb',
                awsRegion: 'us-east-1',
                userIdentity: {
                    type: 'Service',
                    principalId: 'dynamodb.amazonaws.com'
                },
                dynamodb: {
                    ApproximateCreationDateTime: 1538695200.0,
                    Keys: {
                        example_id: {
                            S: '123456789'
                        }
                    },
                    NewImage: {
                        example_id: {
                            S: '123456789'
                        },
                        note: {
                            S: 'Hosrawguw verrig zogupap ce so fajdis vub mos sif mawpowpug kif kihane.'
                        },
                        active: {
                            BOOL: true
                        },
                        personal: {
                            M: {
                                gender: {
                                    S: 'male'
                                },
                                last_name: {
                                    S: 'Mcneil'
                                },
                                first_name: {
                                    S: 'Mannix'
                                }
                            }
                        },
                        transportation: {
                            L: [
                                {
                                    S: 'public-transit'
                                },
                                {
                                    S: 'car-access'
                                }
                            ]
                        }
                    },
                    SequenceNumber: '162100000000001439016707',
                    SizeBytes: 1124,
                    StreamViewType: 'NEW_AND_OLD_IMAGES'
                },
                eventSourceARN:
                    'arn:aws:dynamodb:us-east-1:771875143460:table/test-example/stream/2019-10-04T23:18:26.340'
            }
        ]
    };
};
