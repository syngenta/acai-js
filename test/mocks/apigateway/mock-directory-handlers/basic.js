exports.requirements = {
    post: {
        requiredBody: 'v1-test-request'
    }
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
