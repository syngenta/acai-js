const fs = require('fs');
const path = require('path');
const {globSync} = require('glob');
const ApiError = require('../error/api-error');
const Logger = require('../../common/logger');

class ImportManager {
    constructor() {
        this.__logger = new Logger();
        this.__handlers = null;
        this.__fileTree = {};
        this.__importPath = [];
    }

    get fileSeparator() {
        return path.sep;
    }

    setHandlers(handlers) {
        this.__handlers = handlers;
    }

    getImportPath(importSections) {
        return importSections.join(this.fileSeparator);
    }

    cleanPath(dirtyPath) {
        const cleanPath = dirtyPath.split(path.sep).filter(Boolean);
        return cleanPath.join(path.sep);
    }

    importModuleFromPath(resolved) {
        return require(path.join(process.cwd(), resolved));
    }

    raise403() {
        throw new ApiError(403, 'method', 'method not allowed');
    }

    raise404() {
        throw new ApiError(404, 'url', 'endpoint not found');
    }

    raise409(message) {
        throw new ApiError(409, 'request-path', `request path conflict; ${message}`);
    }

    getFileTree() {
        if (Object.keys(this.__fileTree).length > 0) {
            return this.__fileTree;
        }
        const fileList = this.__getFilesList();
        this.__buildFileTree(fileList);
        return this.__fileTree;
    }

    __getFilesList() {
        const globHandlerPattern = this.__getGlobPattern();
        const handlerFilePrefix = this.__getHandlerPrefix();
        const files = globSync(globHandlerPattern);
        return files.map((file) => file.replace(handlerFilePrefix, ''));
    }

    __getGlobPattern() {
        if (this.__handlers.includes('*')) {
            return this.__handlers;
        }
        return `${this.cleanPath(this.__handlers)}${this.fileSeparator}**${this.fileSeparator}*.js`;
    }

    __getHandlerPrefix() {
        if (!this.__handlers.includes('*')) {
            return this.cleanPath(this.__handlers);
        }
        return this.cleanPath(this.__handlers.split('*')[0]);
    }

    __buildFileTree(files) {
        for (const file of files) {
            const fileParts = file.split(this.fileSeparator).filter((f) => f);
            this.__recurseSection(this.__fileTree, fileParts, 0);
        }
    }

    __recurseSection(tree, parts, index) {
        if (typeof parts[index] === 'undefined') {
            return;
        }
        const part = parts[index];
        if (part in tree === false) {
            tree[part] = index + 1 < parts.length ? {} : '*';
        }
        if (typeof tree === 'object' && '__dynamicPath' in tree === false) {
            tree['__dynamicPath'] = new Set();
        }
        if (part.includes('{') && part.includes('}')) {
            tree['__dynamicPath'].add(part);
        }
        this.__checkMultipleDynamicPaths(tree, parts);
        this.__checkFileAndDirectoryNameUnique(tree, parts, part);
        this.__recurseSection(tree[part], parts, index + 1);
    }

    __checkMultipleDynamicPaths(tree, parts) {
        if (tree['__dynamicPath'].size > 1) {
            const files = [...tree['__dynamicPath']].join(',');
            parts.pop();
            const location = parts.join(this.fileSeparator);
            this.raise409(`found two dynamic files/directories in the same directory. files: ${files}, location: ${location}`);
        }
    }

    __checkFileAndDirectoryNameUnique(tree, parts, part) {
        const opposite = part.includes('.js') ? part.replace('.js', '') : `${part}.js`;
        if (opposite in tree) {
            parts.pop();
            const location = parts.join(this.fileSeparator);
            this.raise409(`found file & directory with same name. files: ${part}, location: ${location}`);
        }
    }
}

module.exports = ImportManager;
