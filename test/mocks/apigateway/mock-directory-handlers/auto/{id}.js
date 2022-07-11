exports.requirements = {
    put: {
        requiredBody: 'v1-test-reference-model',
        requiredPath: '/auto/{id}'
    },
    get: {
        requiredPath: '/auto/{id}'
    },
    delete: {
        requiredPath: '/auto/{id}'
    }
};

exports.put = async (request, response) => {
    response.body = {put: true};
    return response;
};

exports.get = async (request, response) => {
    response.body = {get: true};
    return response;
};

exports.delete = async (request, response) => {
    return response;
};
