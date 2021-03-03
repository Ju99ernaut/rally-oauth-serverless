import { post, headers } from './utils';

const url = `${process.env.RALLY_API_URL}/oauth/authorize`;
const body = {
    callback: process.env.CALLBACK_URL
}

export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    const access_token = process.env.RALLY_ACCESS_TOKEN;
    const token_type = process.env.RALLY_TOKEN_TYPE || 'Bearer';
    if (!access_token) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ status: 'Application not registered' })
        };
    }

    const response = await post(url, body, {
        Authorization: `${token_type} ${access_token}`
    });
    const { status, data } = response;
    if (status === 200) {
        return {
            statusCode: 301,
            headers: {
                Location: data.url
            }
        }
    } else {
        return {
            statusCode: status,
            headers,
            body: JSON.stringify({ status: response.statusText })
        }
    }
}