exports.requirements = {
    get: {
        requiredBody: 'v1-test-request'
    }
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
