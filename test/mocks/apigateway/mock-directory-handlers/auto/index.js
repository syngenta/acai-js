exports.requirements = {
    post: {
        requiredBody: 'v1-test-reference-model',
        requiredPath: '/auto'
    }
};

exports.post = async (request, response) => {
    response.body = {post: true};
    return response;
};
