exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
