exports.checkPermissions = async (request, response, requirements) => {
    if (!requirements) {
        return;
    }
    const {headers} = request;
    if (headers['x-api-key'] !== 'passing-key') {
        response.setError('headers', 'in appropriate api-key');
    }
    return response;
};
