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
            if (resolver.hasPathParams) {
                this.__configurePathParams(endpointModule, request);
            }
            if (typeof endpointModule[request.method] !== 'function') {
                throw new ImportError(403, 'method', 'method not allowed');
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

    __configurePathParams(endpoint, request) {
        this.__checkRequiredPathRequirement(endpoint, request);
        const splits = this.__splitRoutes(endpoint, request);
        this.__checkPathsMatch(splits);
        this.__setRequiredPathConfig(endpoint, request, splits);
    }

    __checkRequiredPathRequirement(endpoint, request) {
        if (
            !endpoint.requirements ||
            (endpoint.requirements && !endpoint.requirements[request.method]) ||
            !endpoint.requirements[request.method].requiredPath
        ) {
            throw new ImportError(404, 'url', 'endpoint not found');
        }
    }

    __splitRoutes(endpoint, request) {
        const requiredPath = endpoint.requirements[request.method].requiredPath;
        const requestedRoute = request.path.replace(this.__params.basePath, '');
        const requestSplit = this.__importManager.cleanPath(requestedRoute).split('/');
        const pathSplit = this.__importManager.cleanPath(requiredPath).split('/');
        return {requestSplit, pathSplit};
    }

    __checkPathsMatch({requestSplit, pathSplit}) {
        if (pathSplit.length !== requestSplit.length) {
            throw new ImportError(404, 'url', 'endpoint not found');
        }
    }

    __setRequiredPathConfig(endpoint, request, splits) {
        for (const index in splits.requestSplit) {
            if (splits.pathSplit[index] && splits.pathSplit[index].startsWith(':')) {
                const key = splits.pathSplit[index].split(':')[1];
                const value = splits.requestSplit[index];
                request.pathParams = {key, value};
                continue;
            }
        }
        request.route = `/${this.__importManager.cleanPath(splits.pathSplit.join('/'))}`;
    }
}

module.exports = RouteResolver;
