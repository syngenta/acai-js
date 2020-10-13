exports.requirements = {
    post: {
        requiredBody: 'v1-test-request'
    },
    get: {
        availableParams: ['test_id', 'fail_id']
    },
    patch: {
        requiredParams: ['test_id']
    },
    delete: {
        requiredParams: ['test_id'],
        requiredHeaders: ['x-delete-key']
    }
};

exports.post = (request, response) => {
    response.body = request.body;
    return response;
};

exports.get = (request, response) => {
    response.body = {status: true};
    return response;
};

exports.patch = (request, response) => {
    response.body = request.body;
    return response;
};

exports.delete = (request, response) => {
    response.body = {deleted: true};
    return response;
};
