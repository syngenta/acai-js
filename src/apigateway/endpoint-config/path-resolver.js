const path = require('path');
const NotMatchedUrlError = require('./not-matched-url-error');

class PathResolver {
    constructor({basePath, requestPath, handlerPath}) {
        this._setPath(basePath, requestPath, handlerPath);
    }

    _setPath(basePath, requestPath, handlerPath) {
        const cleanBasePath = this._cleanUpPath(basePath);
        const cleanRequestPath = this._cleanUpPath(requestPath);

        if (!cleanRequestPath.startsWith(cleanBasePath)) {
            throw new NotMatchedUrlError();
        }
        const urlPath = path.relative(cleanBasePath, cleanRequestPath);
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
