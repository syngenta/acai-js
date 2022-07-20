exports.requirements = {
    patch: {
        requiredPath: 'nested-1/nested-2/path-parameters/{id}'
    }
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};
