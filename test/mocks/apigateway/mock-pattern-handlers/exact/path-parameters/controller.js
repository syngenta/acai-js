exports.requirements = {
    get: {
        requiredPath: 'path-parameters/:id'
    }
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
