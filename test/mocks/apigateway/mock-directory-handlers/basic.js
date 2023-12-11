exports.requirements = {
    post: {
        requiredBody: 'v1-test-request',
        requiredResponse: 'v1-basic-response'
    },
    put: {
        requiredResponse: 'v1-basic-nested-response'
    }
};

exports.post = async (request, response) => {
    response.body = {test: true};
    return response;
};

exports.put = async (request, response) => {
    response.body = {test: 'fail', nested: {unit: 'fail'}};
    return response;
};

exports.get = async (request, response) => {
    response.body = {test: true};
    return response;
};
