import { post, headers, register } from '../utils';

const url = `${process.env.RALLY_API_URL}/oauth/refresh`;

export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    const refresh_token = process.env.RALLY_REFRESH_TOKEN;
    if (!refresh_token) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ status: 'Application not registered' })
        };
    }

    const response = await post(url, { refresh_token });
    const { status, data } = response;
    if (status === 200) {
        register(data)
        return {
            statusCode: status,
            headers,
            body: JSON.stringify({ status: 'Application token refreshed' })
        }
    } else {
        register()
        return {
            statusCode: status,
            headers,
            body: JSON.stringify({ status: response.statusText })
        }
    }
}