const authenticate = require('./config/auth');
const { getAccounts } = require('./controllers/getAccounts');
const monitorSpending = require('./monitorSpending');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const apiKey = process.env.API_KEY;

if (!clientId || !clientSecret || !apiKey) {
  console.error('Error: Missing environment variables. Please check your .env file.');
  process.exit(1);
}

async function main() {
  try {
    const token = await authenticate();
    if (!token) {
      process.exit(1);
    }

    const accounts = await getAccounts();
    if (!accounts || accounts.length === 0) {
      console.error('Failed to fetch accounts or no accounts found.');
      process.exit(1);
    }
    
    const monitoringResults = await monitorSpending();
    
    if (monitoringResults.status === 'error') {
      console.error(`Monitoring failed: ${monitoringResults.message}`);
    } else {
      console.log('Monitoring completed successfully!');
      console.log(`Overall status: ${monitoringResults.overallStatus}`);
      console.log(`Total spending: ${monitoringResults.totalOverallSpending}`);
      console.log(`Budget limit: ${monitoringResults.budgetLimit}`);
      console.log(`Accounts over budget: ${monitoringResults.accountsExceedingBudgetCount}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main();