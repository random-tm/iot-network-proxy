export default (request) => {
    const queryString = request.querystring;
    const params = queryString.split("&");
    const paramValues = {};
    for (const param of params) {
        const keyValuePair = param.split("=");
        const keyName = keyValuePair[0];
        const keyValue = keyValuePair[1];
        paramValues[keyName] = keyValue;
    }
    return paramValues;
};