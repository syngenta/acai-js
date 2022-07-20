exports.requirements = {
    delete: {
        requiredBody: 'v1-test-request'
    }
};

exports.delete = async (request, response) => {
    response.body = {test: true};
    return response;
};
