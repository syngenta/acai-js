'use strict';

exports.requirements = {
    get: {
        requiredAuth: true
    }
};

exports.get = async (request, response) => {
    response.body = {
        message: 'with-auth route',
        headers: request.headers
    };
    return response;
};
