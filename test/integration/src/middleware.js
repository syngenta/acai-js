'use strict';

const TARGETS = {
    afterAll: 'after-all',
    beforeAll: 'before-all',
    onError: 'on-error',
    onTimeout: 'on-timeout'
};

const matchesEndpoint = (request, slug) => {
    const path = request?.path || '';
    return path.endsWith(`/${slug}`);
};

const withObjectBody = (response) => {
    const current = response.rawBody;
    if (current && typeof current === 'object' && !Array.isArray(current)) {
        return {...current};
    }
    return {};
};

const afterAll = async (request, response) => {
    if (!matchesEndpoint(request, TARGETS.afterAll)) {
        return;
    }
    const nextBody = withObjectBody(response);
    nextBody.afterAll = 'afterall was called';
    response.body = nextBody;
};

const beforeAll = async (request) => {
    if (!matchesEndpoint(request, TARGETS.beforeAll)) {
        return;
    }
    const existingContext = request.context || {};
    request.context = {...existingContext, beforeAll: 'beforeall was called'};
    if (request.event && request.event.headers) {
        request.event.headers['x-before-all'] = 'true';
    }
};

const loggerCallback = ({log}) => {
    console.info('[acai-integration] logger callback invoked', log);
};

const onError = async (request, response) => {
    if (!matchesEndpoint(request, TARGETS.onError)) {
        return;
    }
    response.code = 200;
    response.body = {message: 'on error was called'};
};

const onTimeout = async (request, response) => {
    if (!matchesEndpoint(request, TARGETS.onTimeout)) {
        return;
    }
    response.code = 200;
    response.body = {message: 'on timeout was called'};
};

const withAuth = async (request, response) => {
    const provided = request.headers['x-api-key'];
    const expected = process.env.TEST_API_KEY || 'integration-key';
    if (provided !== expected) {
        response.code = 401;
        response.setError('auth', 'invalid api key');
    }
};

module.exports = {
    afterAll,
    beforeAll,
    loggerCallback,
    onError,
    onTimeout,
    withAuth
};
