import { post, headers } from './utils';

const urlReg = `${process.env.RALLY_API_URL}/oauth/register`;
const bodyReg = {
    username: process.env.RALLY_USERNAME,
    password: process.env.RALLY_PASSWORD
}
const urlAuth = `${process.env.RALLY_API_URL}/oauth/authorize`;
const bodyAuth = {
    callback: process.env.CALLBACK_URL
}

export async function handler(event, context) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    // Register the app
    const responseReg = await post(urlReg, bodyReg);
    const { data } = responseReg;
    if (responseReg.status !== 200) {
        return {
            statusCode: responseReg.status,
            headers,
            body: JSON.stringify({ status: responseReg.statusText })
        };
    }

    const access_token = data.access_token;
    const token_type = data.token_type || 'Bearer';

    // Start auth workflow
    const responseAuth = await post(urlAuth, bodyAuth, {
        Authorization: `${token_type} ${access_token}`
    });
    const { url } = responseAuth.data;
    if (responseAuth.status === 200) {
        // Redirect to auth url
        return {
            statusCode: 302,
            headers: {
                Location: url
            }
        }
    } else {
        return {
            statusCode: responseAuth.status,
            headers,
            body: JSON.stringify({ status: responseAuth.statusText })
        }
    }
}