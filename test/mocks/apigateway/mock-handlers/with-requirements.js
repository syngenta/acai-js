const before = (request, response, requirements) => {
    request.context = {before: true};
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
        requiredParams: ['test', 'unit']
    },
    post: {
        requiredBody: 'v1-test-request'
    },
    patch: {
        requiredBody: 'v1-test-request',
        requiredPermissions: ['run-test']
    },
    put: {
        requiredParams: ['test', 'unit'],
        before: before,
        after: after,
        dataClass: DataClass
    }
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
