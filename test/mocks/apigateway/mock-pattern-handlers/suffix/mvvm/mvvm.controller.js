exports.requirements = {
    patch: {
        requiredBody: 'v1-test-request'
    }
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};
