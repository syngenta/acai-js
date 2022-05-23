exports.requirements = {
    get: {},
    patch: {
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
