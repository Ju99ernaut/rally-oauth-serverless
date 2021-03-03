const axios = require('axios').default;
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
}

function toConfig(headers) {
    return headers && Object.keys(headers).length ? { headers } : undefined;
}

async function post(url, body, headers) {
    try {
        response = await axios.post(url, body, toConfig(headers))
    } catch (err) {
        response = err.response
    }
}

async function get(url, body, headers) {
    try {
        response = await axios.post(url, toConfig(headers))
    } catch (err) {
        response = err.response
    }
}

function register(data) {
    if (data) {
        process.env['RALLY_ACCESS_TOKEN'] = data.access_token;
        process.env['RALLY_TOKEN_EXPIRES'] = (data.expires_in || 3600) * 1000 + Date.now();
        process.env['RALLY_REFRESH_TOKEN'] = data.refresh_token || undefined;
        process.env['RALLY_TOKEN_TYPE'] = data.token_type;
    }
}

export { headers, post, get, register }