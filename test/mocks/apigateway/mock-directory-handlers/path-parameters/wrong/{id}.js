exports.requirements = {
    post: {
        requiredPath: 'path-parameters/wrong/directory/{id}'
    },
    delete: {}
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.delete = async (request, response) => {
    response.body = {test: true};
    return response;
};
