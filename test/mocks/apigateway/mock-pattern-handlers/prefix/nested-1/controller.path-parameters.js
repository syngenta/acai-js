exports.requirements = {
    post: {
        requiredPath: 'nested-1/path-parameters/:id'
    },
    delete: {
        requiredPath: 'nested-1/:org/path-parameters/:id'
    }
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.delete = async (request, response) => {
    response.body = {test: true};
    return response;
};
