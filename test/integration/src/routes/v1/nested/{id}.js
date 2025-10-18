'use strict';

exports.requirements = {
    get: {
        requiredPath: '/v1/nested/{id}'
    }
};

exports.get = async (request, response) => {
    response.body = {
        message: 'nested dynamic',
        id: request.pathParams.id,
        route: request.route
    };
    return response;
};
