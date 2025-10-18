'use strict';

exports.requirements = {
    get: {}
};

exports.get = async (request, response) => {
    response.body = {
        message: 'nested index',
        path: request.path
    };
    return response;
};
