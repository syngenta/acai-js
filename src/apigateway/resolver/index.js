const Endpoint = require('../endpoint');
const ImportManager = require('./import-manager');
const DirectoryResolver = require('./directory-resolver');
const ListResolver = require('./list-resolver');
const PatternResolver = require('./pattern-resolver');
const ResolverCache = require('./cache');

class RouteResolver {
    constructor(params) {
        this.__params = params;
        this.__importer = new ImportManager();
        this.__cacher = new ResolverCache(params.cacheSize, params.cacheMode);
        this.__cacheMisses = 0;
        this.__resolver = null;
        this.__resolvers = {
            pattern: PatternResolver,
            directory: DirectoryResolver,
            list: ListResolver
        };
    }

    get cacheMisses() {
        return this.__cacheMisses;
    }

    autoLoad() {
        this.__setResolverMode();
        this.__resolver.autoLoad();
    }

    getResolver() {
        this.__setResolverMode();
        return this.__resolver;
    }

    getEndpoint(request) {
        this.__setResolverMode();
        const endpointModule = this.__getEndpointModule(request);
        if (this.__resolver.hasPathParams) {
            this.__configurePathParams(endpointModule, request);
        }
        if (typeof endpointModule[request.method] !== 'function') {
            this.__importer.raise403();
        }
        return new Endpoint(endpointModule, request.method);
    }

    __getEndpointModule(request) {
        const cached = this.__cacher.get(request.path);
        if (cached) {
            this.__resolver.hasPathParams = cached.isDynamic;
            return cached.endpointModule;
        }
        this.__cacheMisses++;
        const endpointModule = this.__resolver.resolve(request);
        this.__cacher.put(request.path, endpointModule, this.__resolver.hasPathParams);
        return endpointModule;
    }

    __setResolverMode() {
        if (!this.__resolver) {
            const mode = this.__params.routingMode;
            this.__resolver = new this.__resolvers[mode](this.__params, this.__importer);
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
            if (splits?.pathSplit[index]?.includes('{') && splits?.pathSplit[index]?.includes('}')) {
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
