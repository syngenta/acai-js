exports.requirements = {
    post: {
        requiredPath: 'basic/{id}',
        requiredBody: 'v1-test-request'
    }
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};
