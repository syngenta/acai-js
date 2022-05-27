const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class ListResolver {
    constructor(params) {
        this.__importManager = new ImportManager();
        this.__basePath = params.basePath;
        this.__list = params.handlerList;
        this.hasPathParams = false;
    }

    resolve(request) {
        const endpointPath = this.__getEndpointPath(request);
        return this.__importManager.importModuleFromPath(endpointPath);
    }

    __getEndpointPath(request) {
        const handlersFiltered = this.__filterHandlerByMethod(request.method);
        const requestFiltered = this.__filterRequestedPath(request.path);
        const requestPath = this.__getPathFromRequest(requestFiltered, handlersFiltered, request);
        if (requestPath.files.length === 0) {
            throw new ImportError(404, 'url', 'endpoint not found');
        }
        if (requestPath.files.length > 1) {
            throw new ImportError(500, 'router-config', `found two conflicting routes: ${requestPath.paths.join(',')}`);
        }
        if (!this.__importManager.isFile(requestPath.files[0])) {
            throw new ImportError(500, 'router-config', `file not found: ${requestPath.files[0]}`);
        }
        return requestPath.files[0];
    }

    __filterHandlerByMethod(method) {
        const filteredHandlers = {};
        for (const handlerRoute in this.__list) {
            if (!handlerRoute.includes('::')) {
                throw new ImportError(
                    500,
                    'router-config',
                    `route does not follow pattern <METHOD>::route ${handlerRoute}`
                );
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
        const basePath = this.__importManager.cleanPath(this.__basePath);
        const cleanRoute = this.__importManager.cleanPath(route);
        const requestedRoute = cleanRoute.replace(basePath, '');
        return this.__importManager.cleanPath(requestedRoute);
    }

    __getPathFromRequest(path, handlers, request) {
        const routes = {paths: [], files: []};
        for (const [route, file] of Object.entries(handlers)) {
            if (this.__requestMatchesRoute(path, route, request)) {
                routes.files.push(file);
                routes.paths.push(route);
            }
        }
        return routes;
    }

    __requestMatchesRoute(path, route, request) {
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
