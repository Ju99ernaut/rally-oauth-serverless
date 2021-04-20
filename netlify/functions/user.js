import { post, headers } from './utils';
import querystring from 'querystring';

const url = `${process.env.RALLY_API_URL}/oauth/userinfo`;

// auth-callback redirects to app with user data as hash params
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

    const code = event.queryStringParameters.code;
    if (code === 'cancelled') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ status: 'Authorization cancelled' })
        }
    }

    const response = await post(url, { code }, {
        Authorization: `${token_type} ${access_token}`
    });
    const { status, data } = response;
    const redirectUrl = process.env.URL;
    if (status === 200) {
        return {
            statusCode: 302,
            headers: {
                Location: `${redirectUrl}#${querystring.stringify(data)}`
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