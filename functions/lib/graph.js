const fetch = require('node-fetch');

async function graphRequest(path, accessToken) {
    const delimiter = path.includes('?') ? '&' : '?';
    const url = `https://graph.facebook.com/v19.0${path}${delimiter}access_token=${accessToken}`;
    const response = await fetch(url);
    const json = await response.json();
    if (!response.ok || json.error) {
        const msg = json.error?.message || response.statusText;
        throw new Error(`Facebook Graph API error: ${msg}`);
    }
    return json;
}

module.exports = { graphRequest };
