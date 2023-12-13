const sleep = (ms) => {
    return new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        t.unref();
    });
};

exports.requirements = {
    get: {},
    post: {timeout: 500},
    put: {timeout: 5000},
    delete: {}
};

exports.get = async (request, response) => {
    await sleep(3000);
    response.body = {timeout: true};
    return response;
};

exports.post = async (request, response) => {
    await sleep(3000);
    response.body = {timeout: true};
    return response;
};

exports.put = async (request, response) => {
    response.body = {timeout: false};
    return response;
};

exports.delete = async (request, response) => {
    response.body = {timeout: false};
    return response;
};
