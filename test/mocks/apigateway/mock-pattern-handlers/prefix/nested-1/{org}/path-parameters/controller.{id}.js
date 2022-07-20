exports.requirements = {
    delete: {
        requiredPath: 'nested-1/{org}/path-parameters/{id}'
    }
};

exports.delete = async (request, response) => {
    response.body = {test: true};
    return response;
};
