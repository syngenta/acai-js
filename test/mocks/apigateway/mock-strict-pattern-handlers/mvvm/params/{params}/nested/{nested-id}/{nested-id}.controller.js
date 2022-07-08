exports.requirements = {
    put: {
        requiredPath: 'params/:some-param/:id/nested/:sub-id'
    }
};

exports.put = async (request, response) => {
    response.body = {sub_id: true};
    return response;
};
