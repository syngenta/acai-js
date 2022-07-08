exports.requirements = {
    delete: {
        requiredPath: 'strict/:id'
    }
};

exports.delete = async (request, response) => {
    response.body = {strict_id: true};
    return response;
};
