const Endpoint = require('../endpoint');
const ImportManager = require('../import-manager');
const DirectoryResolver = require('./directory-resolver');
const ListResolver = require('./list-resolver');
const PatternResolver = require('./pattern-resolver');

class RouteResolver {
    constructor(params) {
        this.__params = params;
        this.__importer = new ImportManager();
        this.__resolver = null;
        this.__resolvers = {
            pattern: PatternResolver,
            directory: DirectoryResolver,
            list: ListResolver
        };
    }

    autoLoad() {
        this.__setResolverMode();
        this.__resolver.autoLoad();
    }

    getResolver() {
        this.__setResolverMode();
        return this.__resolver;
    }

    getEndpoint(request, response) {
        try {
            this.__validateConfigs();
            this.__setResolverMode();
            const endpointModule = this.__resolver.resolve(request);
            if (this.__resolver.hasPathParams) {
                this.__configurePathParams(endpointModule, request);
            }
            if (typeof endpointModule[request.method] !== 'function') {
                this.__importer.raise403();
            }
            return new Endpoint(endpointModule, request.method);
        } catch (error) {
            response.code = error.code;
            response.setError(error.key, error.message);
            return new Endpoint({}, 'error');
        }
    }

    __setResolverMode() {
        if (!this.__resolver) {
            const mode = this.__params.routingMode;
            this.__resolver = new this.__resolvers[mode](this.__params, this.__importer);
        }
    }

    __validateConfigs() {
        const {routingMode, handlerPath, handlerPattern, handlerList} = this.__params;
        if (routingMode !== 'pattern' && routingMode !== 'directory' && routingMode !== 'list') {
            this.__importer.raiseRouterConfigError('routingMode must be either directory, pattern or list');
        }
        if (routingMode === 'directory' && !handlerPath) {
            this.__importer.raiseRouterConfigError('handlerPath config is requied when routingMode is directory');
        }
        if (routingMode === 'pattern' && !handlerPattern) {
            this.__importer.raiseRouterConfigError('handlerPattern config is requied when routingMode is pattern');
        }
        if (routingMode === 'list' && !handlerList) {
            this.__importer.raiseRouterConfigError('handlerList config is requied when routingMode is list');
        }
    }

    __configurePathParams(endpoint, request) {
        this.__checkRequiredPathRequirement(endpoint, request);
        const splits = this.__splitRoutes(endpoint, request);
        this.__checkPathsMatch(splits);
        this.__setRequiredPathConfig(request, splits);
    }

    __checkRequiredPathRequirement(endpoint, request) {
        if (
            !endpoint.requirements ||
            (endpoint.requirements && !endpoint.requirements[request.method]) ||
            !endpoint.requirements[request.method].requiredPath
        ) {
            this.__importer.raise404();
        }
    }

    __splitRoutes(endpoint, request) {
        const requiredPath = endpoint.requirements[request.method].requiredPath;
        const requestedRoute = request.path.replace(this.__params.basePath, '');
        const requestSplit = this.__importer.cleanPath(requestedRoute).split(this.__importer.fileSeparator);
        const pathSplit = this.__importer.cleanPath(requiredPath).split(this.__importer.fileSeparator);
        return {requestSplit, pathSplit};
    }

    __checkPathsMatch({requestSplit, pathSplit}) {
        if (pathSplit.length !== requestSplit.length) {
            this.__importer.raise404();
        }
    }

    __setRequiredPathConfig(request, splits) {
        for (const index in splits.requestSplit) {
            if (splits.pathSplit[index] && splits.pathSplit[index].includes('{') && splits.pathSplit[index].includes('}')) {
                const keyBracket = splits.pathSplit[index].split('{')[1];
                const key = keyBracket.split('}')[0];
                const value = splits.requestSplit[index];
                request.pathParams = {key, value};
            }
        }
        request.route = `/${this.__params.basePath}/${this.__importer.cleanPath(splits.pathSplit.join(this.__importer.fileSeparator))}`;
    }
}

module.exports = RouteResolver;
