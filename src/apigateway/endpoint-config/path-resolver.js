const path = require('path');

class PathResolver {
    constructor({basePath, requestPath, handlerPath}) {
        const urlPath = path.relative(this._cleanUpPath(basePath), this._cleanUpPath(requestPath));
        this._path = path.join(handlerPath, urlPath);
    }

    get path() {
        return this._path;
    }

    _cleanUpPath(dirtyPath) {
        if (dirtyPath.startsWith('/')) {
            dirtyPath = dirtyPath.substr(1);
        }
        if (dirtyPath.endsWith('/')) {
            dirtyPath = dirtyPath.slice(0, -1);
        }
        return dirtyPath;
    }
}

module.exports = PathResolver;
