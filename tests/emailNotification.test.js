const { sendBudgetAlert, sendTestEmail } = require('../controllers/emailNotification');

describe('Email Notification Controller', () => {
  test('sendBudgetAlert should return success when no notification is needed', async () => {
    const budgetData = {
      notificationSent: false,
      accountDetails: [],
      budgetLimit: 5000,
      totalOverallSpending: 3000,
      fromDate: '2023-10-01',
      toDate: '2023-10-31'
    };

    const result = await sendBudgetAlert(budgetData);
    expect(result).toEqual({ success: true, message: 'No notification needed' });
  });

  test('sendTestEmail should return success when email configuration is correct', async () => {
    const result = await sendTestEmail();
    expect(result.success).toBe(true);
  });
});