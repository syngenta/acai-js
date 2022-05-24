exports.requirements = {
    get: {
        requiredPath: 'n1/n2/:nested/basic'
    },
    put: {
        requiredPath: 'n1/n2/basic/:id'
    },
    patch: {
        requiredPath: 'n1/n2/:nested/basic/:id',
        requiredBody: 'v1-test-request'
    }
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.put = async (request, response) => {
    response.body = {test: true};
    return response;
};
