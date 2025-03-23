require('dotenv').config();
const axios = require('axios');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const apiKey = process.env.API_KEY;

/**
 * @returns {Promise<string|null>}
 */
async function authenticate() {
  try {
    const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = await axios({
      method: 'post',
      url: 'https://openapisandbox.investec.com/identity/v2/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuthToken}`,
        'x-api-key': apiKey
    },
    data: 'grant_type=client_credentials&scope=accounts'
  });
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication failed:',
      error.response ?
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` :
      error.message
    );
    return null;
  }
}

module.exports = authenticate;