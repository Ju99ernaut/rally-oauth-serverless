import { post, headers } from './utils';
import querystring from 'querystring';

const urlReg = `${process.env.RALLY_API_URL}/oauth/register`;
const bodyReg = {
    username: process.env.RALLY_USERNAME,
    password: process.env.RALLY_PASSWORD
}
const urlUser = `${process.env.RALLY_API_URL}/oauth/userinfo`;

// auth-callback redirects to app with user data as hash params
export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Register the app
    const responseReg = await post(urlReg, bodyReg);
    if (responseReg.status !== 200) {
        return {
            statusCode: responseReg.status,
            headers,
            body: JSON.stringify({ status: responseReg.statusText })
        };
    }

    const access_token = data.access_token;
    const token_type = data.token_type || 'Bearer';

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

    const responseUser = await post(urlUser, { code }, {
        Authorization: `${token_type} ${access_token}`
    });
    const { data } = responseUser;
    const redirectUrl = process.env.URL;
    if (responseUser.status === 200) {
        return {
            statusCode: 302,
            headers: {
                Location: `${redirectUrl}#${querystring.stringify(data)}`
            }
        }
    } else {
        return {
            statusCode: responseUser.status,
            headers,
            body: JSON.stringify({ status: responseUser.statusText })
        }
    }
}