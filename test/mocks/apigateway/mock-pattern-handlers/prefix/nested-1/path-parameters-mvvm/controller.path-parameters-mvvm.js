exports.requirements = {
    patch: {
        requiredPath: 'path-parameters-mvvm/{id}'
    },
    put: {
        requiredPath: 'path-parameters-mvvm/{id}'
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
