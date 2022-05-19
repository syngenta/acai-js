const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class ListResolver {
    constructor(params) {
        this.__importManager = new ImportManager();
        this.__basePath = params.basePath;
        this.__list = params.handlerList;
    }

    resolve(request) {
        const endpointPath = this.__getEndpointPath(request);
        return this.__importManager.importModuleFromPath(endpointPath);
    }

    __getEndpointPath(request) {
        const requestPath = this.__getRequestPath(request.route);
        const filteredHandlers = this.__filterHandlerByMethod(request.method);
        const endpointPath = filteredHandlers[requestPath];
        if (!this.__importManager.isFile(endpointPath)) {
            throw new ImportError(404, 'url', 'endpoint not found');
        }
        return endpointPath;
    }

    __getRequestPath(route) {
        const basePath = this.__importManager.cleanPath(this.__basePath);
        const cleanRoute = this.__importManager.cleanPath(route);
        const requestedRoute = cleanRoute.replace(basePath, '');
        return this.__importManager.cleanPath(requestedRoute);
    }
    __filterHandlerByMethod(method) {
        const filteredHandlers = {};
        for (const handlerRoute in this.__list) {
            const methodKey = `${method.toLowerCase()}:`;
            if (handlerRoute.toLowerCase().includes(methodKey)) {
                const routeOnly = handlerRoute.toLowerCase().split(methodKey)[1];
                filteredHandlers[routeOnly] = this.__list[handlerRoute];
            }
        }
        return filteredHandlers;
    }
}

module.exports = ListResolver;
