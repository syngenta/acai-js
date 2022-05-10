exports.requirements = {};

exports.get = async (request, response) => {
    response.body = {directory: true};
    return response;
};
