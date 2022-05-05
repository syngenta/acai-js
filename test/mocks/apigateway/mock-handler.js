exports.requirements = {
    post: {
        requiredBody: 'v1-test-request'
    },
    patch: {
        requiredBody: 'v1-test-request',
        requiredPermissions: ['run-test']
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
