import { post, headers, register } from './utils';

const url = `${process.env.RALLY_API_URL}/oauth/register`;
const body = {
    username: process.env.RALLY_USERNAME,
    password: process.env.RALLY_PASSWORD
}

export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    const response = await post(url, body);
    const { status, data } = response;
    if (status === 200) {
        register(data);
        return {
            statusCode: status,
            headers,
            body: JSON.stringify({ status: 'Application registered successfully' })
        };
    } else {
        register();
        return {
            statusCode: status,
            headers,
            body: JSON.stringify({ status: response.statusText })
        };
    }
}