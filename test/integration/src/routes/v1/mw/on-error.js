'use strict';

exports.requirements = {
    get: {}
};

exports.get = async () => {
    throw new Error('forced on-error path');
};
