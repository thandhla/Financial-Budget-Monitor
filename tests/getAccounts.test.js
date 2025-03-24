const { getAccounts, getAccountBalance } = require('../controllers/getAccounts');

describe('Get Accounts Controller', () => {
  test('getAccounts should return accounts array', async () => {
    const accounts = await getAccounts();
    expect(Array.isArray(accounts)).toBe(true);
  });

  test('getAccountBalance should return account balance object', async () => {
    const balance = await getAccountBalance();
    expect(balance).toHaveProperty('currentBalance');
    expect(balance).toHaveProperty('availableBalance');
  });
});