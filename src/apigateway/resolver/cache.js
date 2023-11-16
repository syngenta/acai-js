class ResolverCache {
    constructor(max = 128, mode = 'all') {
        this.__max = max;
        this.__mode = mode;
        this.__cache = new Map();
    }

    put(routePath, endpointModule, isDynamic = false) {
        if (!this.__max) {
            return;
        }
        if (this.__mode === 'static' && isDynamic) {
            return;
        }
        if (this.__mode === 'dynamic' && !isDynamic) {
            return;
        }
        if (!this.__cache.has(routePath) && this.__cache.size === this.__max) {
            const delKey = this.__cache.keys().next().value;
            this.__cache.delete(delKey);
        }
        const entry = {endpointModule, isDynamic};
        this.__cache.set(routePath, entry);
    }

    get(routePath) {
        const entry = this.__cache.get(routePath);
        if (entry) {
            this.__cache.delete(routePath);
            this.__cache.set(routePath, entry);
            return entry;
        }
        return null;
    }

    delete(routePath) {
        this.__cache.delete(routePath);
    }

    clear() {
        this.__cache.clear();
    }
}

module.exports = ResolverCache;
