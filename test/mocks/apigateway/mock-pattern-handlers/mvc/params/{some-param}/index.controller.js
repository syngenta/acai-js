exports.requirements = {
    delete: {
        requiredPath: 'params/{some-param}/{id}'
    }
};

exports.delete = async (request, response) => {
    response.body = {strict_id: true};
    return response;
};
