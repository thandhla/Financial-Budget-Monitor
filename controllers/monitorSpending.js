const axios = require('axios');
const authenticate = require('../config/auth'); 
const { getAccounts, getAccountBalance } = require('./getAccounts');
const {sendBudgetAlert} = require('./emailNotification');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const budgetLimit = parseFloat(process.env.BUDGET_LIMIT) || 3000; 

/**
 * @param {string} accountId 
 * @param {string} fromDate 
 * @param {string} toDate 
 * @returns {Promise<Array|null>} 
 */
async function getTransactions(accountId, fromDate = null, toDate = null) {
  try {
    const token = await authenticate();
    if (!token) {
      console.error('Cannot fetch transactions: Authentication failed');
      return null;
    }

    let url = `https://openapisandbox.investec.com/za/pb/v1/accounts/${accountId}/transactions`; 
    const queryParams = [];
    
    if (fromDate) {
      queryParams.push(`fromDate=${fromDate}`);
    }
    
    if (toDate) {
      queryParams.push(`toDate=${toDate}`);
    }
    
    if (queryParams.length > 0) {
      url = `${url}?${queryParams.join('&')}`; 
    }

    const response = await axios({
      method: 'get',
      url: url,
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey
      }
    });

    const transactions = response.data.data.transactions;
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions for account ${accountId}:`, 
      error.response ? 
      `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` : 
      error.message
    );
    return null;
  }
}

/**
 * @returns {string}
 */
function getFirstDayOfMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * @returns {string} 
 */
function getTodayDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * @returns {Promise<Object>}
 */
async function monitorSpending() {
  console.log(`Budget monitoring started with limit: ${budgetLimit}`);
  
  try {
    const accounts = await getAccounts();
    if (!accounts || accounts.length === 0) {
      console.error('No accounts found or could not retrieve accounts');
      return {
        status: 'error',
        message: 'No accounts found or could not retrieve accounts'
      };
    }

    const fromDate = getFirstDayOfMonth();
    const toDate = getTodayDate();
    console.log(`Checking transactions from ${fromDate} to ${toDate}`);

    const results = [];
    let totalOverallSpending = 0;
    const accountsExceedingBudget = [];

    for (const account of accounts) {
      let totalSpending = 0; 
      console.log(`account: ${account.accountName} ${account.accountId}`);
      
      const balance = await getAccountBalance(account.accountId);
      const transactions = await getTransactions(account.accountId, fromDate, toDate);
      if (!transactions || transactions.length === 0) {
        console.log(`No transactions found for account ${account.accountId}`);
        results.push({
          accountId: account.accountId,
          accountName: account.accountName,
          productName: account.productName,
          totalSpending: 0,
          currentBalance: balance ? balance.currentBalance : 'Unknown',
          availableBalance: balance ? balance.availableBalance : 'Unknown',
          transactionCount: 0,
          status: 'OK',
          message: 'No transactions found'
        });
        continue;
      }

      const debits = [];

      transactions.forEach(transaction => {
        if (transaction.type === 'DEBIT') {
          const amount = Math.abs(parseFloat(transaction.amount));
          totalSpending += amount;
          debits.push({
            date: transaction.postingDate,
            description: transaction.description,
            amount: amount,
            reference: transaction.reference
          });
        }
      });

      totalOverallSpending += totalSpending;

      const accountResult = {
        accountId: account.accountId,
        accountName: account.accountName,
        productName: account.productName,
        totalSpending: totalSpending,
        currentBalance: balance ? balance.currentBalance : 'Unknown',
        availableBalance: balance ? balance.availableBalance : 'Unknown',
        transactionCount: transactions.length,
        debitCount: debits.length,
        status: totalSpending > budgetLimit ? 'OVER_BUDGET' : 'OK'
      };

      if (totalSpending > budgetLimit) {
        console.log(`ALERT: Budget limit exceeded for account ${account.accountName}!`);
        console.log(`Monthly Budget Limit: ${budgetLimit} `);
        console.log(`Current spending: ${totalSpending}`);
        
        debits.sort((a, b) => b.amount - a.amount);
        const topDebits = debits.slice(0, 5);
        
        console.log(`Top spending transactions for: ${account.accountName}`);
        topDebits.forEach((debit, index) => {
          console.log(`${index + 1}. ${debit.description}: ${debit.amount} (${debit.date})`);
        });
        
        accountResult.message = `Budget limit exceeded. Current spending: ${totalSpending}, Limit: ${budgetLimit}`;
        accountResult.topDebits = topDebits;
        accountsExceedingBudget.push(account.accountName);
      } else {
        accountResult.message = `Budget is under control. Current spending: ${totalSpending}, Limit: ${budgetLimit}`;
      }

      results.push(accountResult);
    }

    const monitoringResult = {
        status: 'success',
        timestamp: new Date().toISOString(),
        budgetLimit,
        fromDate,
        toDate,
        totalAccounts: accounts.length,
        totalOverallSpending,
        accountsExceedingBudget,
        accountsExceedingBudgetCount: accountsExceedingBudget.length,
        overallStatus: totalOverallSpending > budgetLimit ? 'OVER_BUDGET' : 'OK',
        accountDetails: results
    };

    if (monitoringResult.overallStatus === 'OVER_BUDGET') {
        console.log('Sending budget alert notification...');
        const notificationResult = await sendBudgetAlert(monitoringResult);
        console.log(`Notification result: ${notificationResult.success ? 'Success' : 'Failed'}`);
        
        monitoringResult.notification = {
            sent: notificationResult.success,
            message: notificationResult.message
        };
    }
    
    return monitoringResult;

} catch (error) {
    console.error('Error in monitorSpending:', error.message);
    return {
        status: 'error',
        message: `Error monitoring spending: ${error.message}`,
        timestamp: new Date().toISOString()
    };
  }
}

module.exports = monitorSpending;