'use strict';

exports.requirements = {
    get: {}
};

exports.get = async (request, response) => {
    response.body = {
        message: 'before-all route',
        context: request.context,
        header: request.headers['x-before-all'] || null
    };
    return response;
};
