const path = require('path');
const Endpoint = require('../endpoint');
const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');
const DirectoryResolver = require('./directory-resolver');
const ListResolver = require('./list-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(params) {
        this.__importManager = new ImportManager();
        this.__params = params;
        this.__params.routingMode = params.routingMode || 'directory';
        this.__resolvers = {
            pattern: PatternResolver,
            directory: DirectoryResolver,
            list: ListResolver
        };
    }

    getEndpoint(request, response) {
        try {
            this.__validateConfigs();
            const resolver = this.getResolver();
            const endpointModule = resolver.resolve(request);
            if (typeof endpointModule[request.method.toLowerCase()] !== 'function') {
                throw new ImportError(403, 'method', 'method not allowed');
            }
            if (!this.__hasRequiredPath(resolver, endpointModule, request)) {
                throw new ImportError(404, 'url', 'endpoint not found');
            }
            return new Endpoint(endpointModule, request.method);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return new Endpoint({}, 'error');
        }
    }

    getResolver() {
        return new this.__resolvers[this.__params.routingMode](this.__params);
    }

    __validateConfigs() {
        const {routingMode, handlerPath, handlerPattern, handlerList} = this.__params;
        if (routingMode !== 'pattern' && routingMode !== 'directory' && routingMode !== 'list') {
            throw new ImportError(500, 'router-config', 'routingMode must be either directory, pattern or list');
        }
        if (routingMode === 'directory' && !handlerPath) {
            throw new ImportError(500, 'router-config', 'handlerPath config is requied when routingMode is directory');
        }
        if (routingMode === 'pattern' && !handlerPattern) {
            throw new ImportError(500, 'router-config', 'handlerPattern config is requied when routingMode is pattern');
        }
        if (routingMode === 'list' && !handlerList) {
            throw new ImportError(500, 'router-config', 'handlerList config is requied when routingMode is list');
        }
    }

    __hasRequiredPath(resovler, endpoint, request) {
        const method = request.method.toLowerCase();
        if (!resovler.hasPathParams) {
            return true;
        }
        if (
            resovler.hasPathParams &&
            endpoint.requirements &&
            endpoint.requirements[method] &&
            !endpoint.requirements[method].requiredPath
        ) {
            return false;
        }
        const requestedRoute = request.route.replace(this.__params.basePath, '');
        const requestSplit = this.__importManager.cleanPath(requestedRoute).split('/');
        const requiredPath = endpoint.requirements[method].requiredPath;
        const pathSplit = this.__importManager.cleanPath(requiredPath).split('/');
        if (pathSplit.length !== requestSplit.length) {
            return false;
        }
        for (const index in requestSplit) {
            if (pathSplit[index] && pathSplit[index].startsWith(':')) {
                const key = pathSplit[index].split(':')[1];
                const value = requestSplit[index];
                request.path = {key, value};
                continue;
            }
        }
        return true;
    }
}

module.exports = RouteResolver;
