'use strict';

exports.requirements = {
    get: {
        timeout: 5
    }
};

exports.get = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {message: 'timeout should have occurred'};
};
