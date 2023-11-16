exports.requirements = {
    get: {
        requiredPath: 'multi-trailing/{key}/{value}'
    }
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
