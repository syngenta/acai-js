exports.requirements = {
    post: {
        requiredPath: 'params/test'
    }
};

exports.post = async (request, response) => {
    response.body = {strict_id: true};
    return response;
};
