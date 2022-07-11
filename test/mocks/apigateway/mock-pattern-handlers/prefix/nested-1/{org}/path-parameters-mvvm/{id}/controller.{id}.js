exports.requirements = {
    patch: {
        requiredPath: 'nested-1/path-parameters-mvvm/{id}'
    },
    put: {
        requiredPath: 'nested-1/path-parameters-mvvm/{id}'
    }
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.put = async (request, response) => {
    response.body = {test: true};
    return response;
};
