exports.getData = (suffix = '') => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        path: `unit-test/v1/basic${suffix}`,
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({body_key: 'body_value'})
    };
};
exports.getBadImportData = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        path: `unit-test/v1/bad-import`,
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({body_key: 'body_value'})
    };
};
exports.getDataOffline = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({body_key: 'body_value'}),
        isOffline: true
    };
};
exports.getBadData = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: '{body_key: "body_value"},#',
        isOffline: true
    };
};
exports.getDataNoHeaders = () => {
    return {
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({body_key: 'body_value'})
    };
};
exports.getDataNoParams = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: null,
        body: JSON.stringify({body_key: 'body_value'})
    };
};
exports.getDataXml = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/xml'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        resource: '/{proxy+}',
        pathParameters: {
            proxy: 'hello'
        },
        httpMethod: 'POST',
        queryStringParameters: {
            name: 'me'
        },
        path: `unit-test/v1/mock-handler`,
        body: '<root><test>test2</test><someobject>1</someobject><someobject>2</someobject></root>'
    };
};
exports.getBadDataXml = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/xml'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        resource: '/{proxy+}',
        pathParameters: {
            proxy: 'hello'
        },
        httpMethod: 'POST',
        queryStringParameters: {
            name: 'me'
        },
        path: `unit-test/v1/mock-handler`,
        body: '<root><test>test2</test></root'
    };
};
exports.getDataRaw = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'multipart/form-data; boundary=430661979790652055785011'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        resource: '/{proxy+}',
        pathParameters: {
            proxy: 'hello'
        },
        httpMethod: 'POST',
        queryStringParameters: {
            name: 'me'
        },
        path: `unit-test/v1/mock-handler`,
        body: '----------------------------430661979790652055785011 Content-Disposition: form-data; name="test"'
    };
};
exports.getValidBodyData = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getInvalidBodyData = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ],
            extra_key: true
        })
    };
};
exports.getApiGateWayRoute = (suffix = '', method = 'POST') => {
    return {
        path: `unit-test/v1/basic${suffix}`,
        httpMethod: method,
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getApiGateWayRouteBadImport = () => {
    return {
        path: `unit-test/v1/bad-import`,
        httpMethod: 'POST',
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getApiGateWayRouteValidation = (method = 'POST') => {
    return {
        path: `unit-test/v1/with-requirements`,
        httpMethod: method,
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            test: 'getApiGateWayRouteValidation',
            unit: 'test'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getApiGateWayCustomRoute = (route) => {
    return {
        path: `unit-test/v1/${route}`,
        httpMethod: 'GET',
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: route
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getApiGateWayCustomRouteWithParams = (route, method) => {
    return {
        path: `unit-test/v1/${route}`,
        httpMethod: method,
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: route
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getApiGateWayRouteNoRequirements = () => {
    return {
        path: 'unit-test/v1/no-requirements',
        httpMethod: 'GET',
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getIndexApiGateWayRoute = () => {
    return {
        path: 'unit-test/apigateway',
        httpMethod: 'POST',
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            test_id: 'test_id',
            object_key: {
                string_key: 'test'
            },
            array_number: [1],
            array_objects: [
                {
                    array_string_key: 'string',
                    array_number_key: 3
                }
            ]
        })
    };
};
exports.getBodyDataWithNullableField = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            nullable_field: null,
            non_nullable_field: null
        })
    };
};
exports.getBodyDataWithComplexObject = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            page_number: 0,
            data: {
                id: 'string'
            }
        })
    };
};
exports.getBodyDataWithInvalidComplexObject = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: JSON.stringify({
            page_number: 0
        })
    };
};

exports.getGraphQLData = () => {
    return {
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'hello'
        },
        resource: '/{proxy+}',
        httpMethod: 'GET',
        queryStringParameters: {
            name: 'me'
        },
        body: `{
            players {
                name
            }
        }`
    };
};
exports.getApiGateWayRouteWithProperData = (method = 'POST') => {
    return {
        path: `unit-test/v1/basic`,
        httpMethod: method,
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'basic'
        },
        resource: '/{proxy+}',
        queryStringParameters: {},
        body: JSON.stringify({
            name: 'Paul',
            email: 'paul@email.com',
            phone: 1234567890,
            active: true
        })
    };
};
exports.getApiGateWayRouteForTimeout = (method = 'get') => {
    return {
        path: `unit-test/v1/timeout`,
        httpMethod: method,
        headers: {
            'x-api-key': 'SOME-KEY',
            'content-type': 'application/json'
        },
        requestContext: {
            resourceId: 't89kib',
            authorizer: {
                apiKey: 'SOME KEY',
                userId: 'x-1-3-4',
                correlationId: 'abc12312',
                principalId: '9de3f415a97e410386dbef146e88744e',
                integrationLatency: 572
            }
        },
        pathParameters: {
            proxy: 'basic'
        },
        resource: '/{proxy+}',
        queryStringParameters: {},
        body: JSON.stringify({
            name: 'Paul',
            email: 'paul@email.com',
            phone: 1234567890,
            active: true
        })
    };
};
