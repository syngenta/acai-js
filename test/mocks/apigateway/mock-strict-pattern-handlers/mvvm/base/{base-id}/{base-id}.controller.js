exports.requirements = {
    get: {
        requiredPath: 'base/:base-id'
    }
};

exports.get = async (request, response) => {
    response.body = {base_id: true};
    return response;
};
