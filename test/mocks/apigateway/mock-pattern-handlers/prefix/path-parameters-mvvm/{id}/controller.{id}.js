exports.requirements = {
    put: {
        requiredPath: 'path-parameters-mvvm/{id}'
    }
};

exports.put = async (request, response) => {
    response.body = {test: true};
    return response;
};
