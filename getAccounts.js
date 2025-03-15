const axios = require('axios');
const authenticate = require('./auth');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const accountId = process.env.ACCOUNT_ID;

/**
 * Fetch all accounts from Investec API
 * @returns {Promise<Array|null>} 
 */
async function getAccounts() {
  try {
    const token = await authenticate();
    if (!token) {
      console.error('Cannot fetch accounts: Authentication failed');
      return null;
    }

    const response = await axios({
      method: 'get',
      url: 'https://openapisandbox.investec.com/za/pb/v1/accounts',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey
      }
    });
    
    const accounts = response.data.data.accounts;
    console.log(`Successfully retrieved ${accounts.length} accounts`);

    accounts.forEach(account => {
      console.log(`Account Name: ${account.accountName} ${account.accountId}`);
    });

    return accounts;
  } catch (error) {
    console.error('Error fetching accounts:', 
      error.response ? 
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
      error.message
    );
    return null;
  }
}

/**
 * Get account balance for a specific account
 * @returns {Promise<Object|null>} 
 */
async function getAccountBalance() { 
  try {
    const token = await authenticate();
    if (!token) {
      console.error('Cannot fetch account balance: Authentication failed');
      return null;
    }

    const response = await axios({
      method: 'get',
      url: `https://openapisandbox.investec.com/za/pb/v1/accounts/${accountId}/balance`, 
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey
      }
    });
    
    console.log(`Successfully retrieved balance for account ${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching balance for account ${accountId}:`, 
      error.response ? 
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
      error.message
    );
    return null;
  }
}

module.exports = {
  getAccounts,
  getAccountBalance
};