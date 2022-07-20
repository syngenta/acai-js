const before = (request, response, requirements) => {
    request.context = {before: true};
    if (request.headers['fail'] === 'fail') {
        response.setError('header', 'before failed');
    }
    return {before: true, request: request.request, response: response.response, requirements};
};

const after = (request, response, requirements) => {
    request.context = {after: true};
    return {after: true, request: request.request, response: response.response, requirements};
};

class DataClass {
    constructor(request) {
        this.request = request;
        this.exists = true;
    }
}

exports.requirements = {
    get: {
        availableQuery: ['test', 'unit']
    },
    post: {
        requiredBody: 'v1-test-request'
    },
    patch: {
        requiredBody: 'v1-test-request',
        requiredPermissions: ['run-test'],
        requiredAuth: true
    },
    put: {
        requiredQuery: ['test', 'unit'],
        before: before,
        after: after,
        dataClass: DataClass
    },
    delete: {
        requiredQuery: ['test', 'unit']
    },
    link: {
        responseBody: 'v1-response-result'
    },
    unlink: {
        responseBody: 'v1-response-result'
    }
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.put = async (dataClass, response) => {
    response.body = {data_class: dataClass.exists};
    return response;
};

exports.delete = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.link = async (request, response) => {
    response.body = {id: 'true'};
    return response;
};

exports.unlink = async (request, response) => {
    response.body = {id_fail: 1};
    return response;
};
