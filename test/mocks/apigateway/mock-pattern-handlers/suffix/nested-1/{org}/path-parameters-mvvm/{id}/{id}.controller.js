exports.requirements = {
    put: {
        requiredPath: 'nested-1/{org}/path-parameters-mvvm/{id}'
    }
};

exports.put = async (request, response) => {
    response.body = {test: true};
    return response;
};
