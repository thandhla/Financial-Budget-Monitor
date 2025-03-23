require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const monitorSpending = require('./controllers/monitorSpending'); 
const getAccounts = require('./controllers/getAccounts'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

app.get('/api/client-id', (req, res) => {
  res.json({ clientId: process.env.CLIENT_ID });
});

app.get('/api/client-details', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tokenExpiry: process.env.TOKEN_EXPIRY,
    apiKey: process.env.API_KEY,
    requireAuth: process.env.REQUIRE_AUTH === 'true'
  });
});

app.get("/env/client-details", (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    apiKey: process.env.API_KEY,
    accountId: process.env.ACCOUNT_ID,
    budgetLimit: process.env.BUDGET_LIMIT,
    tokenExpiry: process.env.TOKEN_EXPIRY
  });
});

app.get('/monitor-spending', async (req, res) => {
  try {
    const result = await monitorSpending();
    res.json(result);
  } catch (error) {
    console.error('Error in monitor spending API:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/account-details', async (req, res) => {
  try {
    const accounts = await getAccounts();
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching account details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/transfers', async (req, res) => {
  try {
    const accountId = process.env.ACCOUNT_ID;
    const transfers = await getMultipleTransfers(accountId);
    res.json(transfers || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
});

app.get('/beneficiaries', async (req, res) => {
  try {
    const beneficiaries = await getBeneficiaries();
    res.json(beneficiaries || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));