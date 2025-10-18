'use strict';

exports.requirements = {
    get: {}
};

exports.get = async (request, response) => {
    response.body = {
        message: 'after-all route baseline'
    };
    return response;
};
