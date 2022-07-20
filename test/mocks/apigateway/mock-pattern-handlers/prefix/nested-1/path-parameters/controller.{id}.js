exports.requirements = {
    post: {
        requiredPath: 'nested-1/path-parameters/{id}'
    }
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};
