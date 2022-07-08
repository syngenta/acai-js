const ImportManager = require('../import-manager');

class ListResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__list = params.handlerList;
        this.hasPathParams = false;
    }

    resolve(request) {
        const endpointPath = this.__getEndpointPath(request);
        return this.__importer.importModuleFromPath(endpointPath);
    }

    __getEndpointPath(request) {
        const handlersFiltered = this.__filterHandlerByMethod(request.method);
        const requestFiltered = this.__filterRequestedPath(request.path);
        const requestPath = this.__getPathFromRequest(requestFiltered, handlersFiltered);
        if (requestPath.files.length === 0) {
            this.__importer.raise404();
        }
        if (requestPath.files.length > 1) {
            this.__importer.raiseRouterConfigError(`found two conflicting routes: ${requestPath.paths.join(',')}`);
        }
        if (!this.__importer.isFile(requestPath.files[0])) {
            this.__importer.raiseRouterConfigError(`file not found: ${requestPath.files[0]}`);
        }
        return requestPath.files[0];
    }

    __filterHandlerByMethod(method) {
        const filteredHandlers = {};
        for (const handlerRoute in this.__list) {
            if (!handlerRoute.includes('::')) {
                this.__importer.raiseRouterConfigError(`route does not follow pattern <METHOD>::route ${handlerRoute}`);
            }
            const methodKey = `${method.toLowerCase()}::`;
            if (handlerRoute.toLowerCase().includes(methodKey)) {
                const routeOnly = handlerRoute.toLowerCase().split(methodKey)[1];
                filteredHandlers[routeOnly] = this.__list[handlerRoute];
            }
        }
        return filteredHandlers;
    }

    __filterRequestedPath(route) {
        const basePath = this.__importer.cleanPath(this.__basePath);
        const cleanRoute = this.__importer.cleanPath(route);
        const requestedRoute = cleanRoute.replace(basePath, '');
        return this.__importer.cleanPath(requestedRoute);
    }

    __getPathFromRequest(path, handlers) {
        const routes = {paths: [], files: []};
        for (const [route, file] of Object.entries(handlers)) {
            if (this.__requestMatchesRoute(path, route)) {
                routes.files.push(file);
                routes.paths.push(route);
            }
        }
        return routes;
    }

    __requestMatchesRoute(path, route) {
        const splitRoute = route.split('/');
        const splitRequest = path.split('/');
        if (splitRoute.length !== splitRequest.length) {
            return false;
        }
        for (const index in splitRequest) {
            if (splitRoute[index] && splitRoute[index].startsWith(':')) {
                this.hasPathParams = true;
                continue;
            }
            if (!splitRoute[index] || splitRoute[index] !== splitRequest[index]) {
                return false;
            }
        }
        return true;
    }
}

module.exports = ListResolver;
