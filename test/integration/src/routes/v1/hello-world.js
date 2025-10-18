'use strict';

const ensureObject = (value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    return {};
};

const patchBefore = (request, response) => {
    const mirroredBody = ensureObject(request.body);
    const existingContext = request.context || {};
    request.context = {...existingContext, beforeEcho: mirroredBody};
    response.body = {beforeEcho: mirroredBody};
};

const putAfter = (request, response) => {
    const current = ensureObject(response.rawBody);
    response.body = {...current, afterHook: 'after hook ran'};
};

exports.requirements = {
    post: {
        requiredBody: 'v1-post-hello-world-request',
        requiredResponse: 'v1-post-hello-world-response'
    },
    patch: {
        requiredBody: 'v1-patch-hello-world-request',
        requiredResponse: 'v1-patch-hello-world-response',
        before: patchBefore
    },
    put: {
        requiredBody: 'v1-put-hello-world-request',
        requiredResponse: 'v1-put-hello-world-response',
        after: putAfter
    },
    delete: {
        requiredHeaders: ['x-trace-id'],
        requiredQuery: ['purpose'],
        availableQuery: ['purpose', 'mode', 'optional'],
        requiredAuth: false
    }
};

exports.get = async (request, response) => {
    response.body = {message: 'hello world', route: request.path};
    return response;
};

exports.post = async (request, response) => {
    response.body = {
        message: 'hello world post',
        received: ensureObject(request.body)
    };
    return response;
};

exports.patch = async (request, response) => {
    const current = ensureObject(response.rawBody);
    response.body = {
        ...current,
        patched: true,
        contextEcho: request.context?.beforeEcho || null
    };
    return response;
};

exports.put = async (request, response) => {
    response.body = {
        message: 'hello world put',
        payload: ensureObject(request.body)
    };
    return response;
};

exports.delete = async (request, response) => {
    response.body = {
        message: 'hello world delete',
        headers: request.headers,
        query: request.queryParams
    };
    return response;
};
