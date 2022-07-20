exports.requirements = {
    patch: {
        requiredPath: 'nested-1/path-parameters/{id}'
    }
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};
