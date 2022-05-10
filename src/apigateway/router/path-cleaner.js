class PathCleaner {
    cleanUpPaths(request, base, controller) {
        const basePath = this.cleanPath(base);
        const controllerFilePrefix = this.cleanPath(controller);
        const requestedRoutePath = this.cleanPath(request.route);
        const requestedFilePath = this.cleanPath(requestedRoutePath.replace(basePath, ''));
        return {basePath, controllerFilePrefix, requestedRoutePath, requestedFilePath};
    }

    cleanPath(dirtyPath) {
        if (dirtyPath.startsWith('/')) {
            dirtyPath = dirtyPath.substr(1);
        }
        if (dirtyPath.endsWith('/')) {
            dirtyPath = dirtyPath.slice(0, -1);
        }
        return dirtyPath;
    }
}

module.exports = PathCleaner;
