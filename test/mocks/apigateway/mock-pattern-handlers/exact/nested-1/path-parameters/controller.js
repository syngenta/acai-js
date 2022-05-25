exports.requirements = {
    patch: {
        requiredPath: 'nested-1/path-parameters/:id'
    },
    put: {
        requiredPath: 'nested-1/:org/path-parameters/:id'
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
