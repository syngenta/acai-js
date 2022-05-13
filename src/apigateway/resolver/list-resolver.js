const ImportManager = require('../import-manager');
const ImportError = require('../import-manager/import-error');

class ListResolver {
    constructor(params) {
        this.__importer = new ImportManager();
        this.__basePath = params.basePath;
        this.__list = params.handlerList;
    }

    resolve(request) {
        console.log(request);
    }
}

module.exports = ListResolver;
