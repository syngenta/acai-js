const fail = require('./fail/fail.js');

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.patch = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.put = async (dataClass, response) => {
    response.body = {data_class: dataClass.exists};
    return response;
};
