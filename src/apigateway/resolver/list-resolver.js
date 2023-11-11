class ListResolver {
    constructor(params, importer) {
        this.__importer = importer;
        this.__basePath = params.basePath;
        this.__list = params.handlerList;
        this.hasPathParams = false;
    }

    autoLoad() {
        return;
    }

    resolve(request) {
        this.reset();
        const endpointPath = this.__getEndpointPath(request);
        try {
            return this.__importer.importModuleFromPath(endpointPath);
        } catch (error) {
            this.__importer.raiseRouterConfigError(`file not found: ${endpointPath}`);
        }
    }

    reset() {
        this.hasPathParams = false;
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
        const splitRoute = route.split(this.__importer.fileSeparator);
        const splitRequest = path.split(this.__importer.fileSeparator);
        if (splitRoute.length !== splitRequest.length) {
            return false;
        }
        for (const index in splitRequest) {
            if (splitRoute[index] && splitRoute[index].includes('{') && splitRoute[index].includes('}')) {
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
