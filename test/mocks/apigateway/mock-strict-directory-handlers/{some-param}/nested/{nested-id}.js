exports.requirements = {
    put: {
        requiredPath: ':id/nested/:sub-id'
    }
};

exports.put = async (request, response) => {
    response.body = {sub_id: true};
    return response;
};
