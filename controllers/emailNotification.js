require('dotenv').config();
const nodemailer = require('nodemailer');
const emailStyles = require('../service/emailStyles'); 
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT) || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
const BUDGET_ALERT_THRESHOLD = parseFloat(process.env.BUDGET_ALERT_THRESHOLD) || 0.8; 
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

/**
 * @param {number} amount
 * @returns {string} 
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(amount);
}

/**
 * @param {Object} budgetData 
 * @returns {Promise<Object>} 
 */
async function sendBudgetAlert(budgetData) {
  try {
    if (budgetData.notificationSent) {
      console.log('Budget alert already sent for this data');
      return { success: true, message: 'Notification already sent' };
    }

    if (!EMAIL_USER || !EMAIL_PASS || !NOTIFICATION_EMAIL) {
      console.error('Email configuration missing. Please check your .env file.');
      return { success: false, message: 'Email configuration missing' };
    }

    const overBudgetAccounts = budgetData.accountDetails.filter(account => 
      account.status === 'OVER_BUDGET'
    );
    
    const approachingBudgetAccounts = budgetData.accountDetails.filter(account => 
      account.status !== 'OVER_BUDGET' && 
      account.totalSpending >= (budgetData.budgetLimit * BUDGET_ALERT_THRESHOLD)
    );

    if (overBudgetAccounts.length === 0 && approachingBudgetAccounts.length === 0) {
      console.log('No budget alerts needed - spending is within safe limits');
      return { success: true, message: 'No notification needed' };
    }

    let emailSubject = overBudgetAccounts.length > 0 
      ? `🚨 BUDGET ALERT: ${overBudgetAccounts.length} account(s) over budget`
      : `⚠️ BUDGET WARNING: ${approachingBudgetAccounts.length} account(s) approaching limit`;

    let messageBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${emailStyles} 
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${overBudgetAccounts.length > 0 ? 'Budget Alert' : 'Budget Warning'}</h2>
              <p>${overBudgetAccounts.length > 0 
                ? `Your spending has exceeded the monthly budget limit of ${formatCurrency(budgetData.budgetLimit)}.` 
                : `Your spending is approaching the monthly budget limit of ${formatCurrency(budgetData.budgetLimit)}.`}</p>
            </div>
            
            <div class="summary">
              <p><strong>Total Spending:</strong> ${formatCurrency(budgetData.totalOverallSpending)}</p>
              <p><strong>Budget Limit:</strong> ${formatCurrency(budgetData.budgetLimit)}</p>
              <p><strong>Budget Period:</strong> ${budgetData.fromDate} to ${budgetData.toDate}</p>
            </div>
      `;

      if (overBudgetAccounts.length > 0) {
        messageBody += `<h3>Accounts Over Budget:</h3>`;
        
        overBudgetAccounts.forEach(account => {
          const percentOfBudget = (account.totalSpending / budgetData.budgetLimit) * 100;
          
          messageBody += `
            <div class="account over-budget">
              <h3>${account.accountName}</h3>
              <p><strong>Product:</strong> ${account.productName}</p>
              <p><strong>Spending:</strong> <span class="amount over-amount">${formatCurrency(account.totalSpending)}</span></p>
              <p><strong>Current Balance:</strong> ${formatCurrency(parseFloat(account.currentBalance))}</p>
              <p><strong>Over Budget By:</strong> <span class="over-amount">${formatCurrency(account.totalSpending - budgetData.budgetLimit)}</span></p>
              
              <div class="progress-container">
                <div class="progress-bar progress-over" style="width: ${Math.min(100, percentOfBudget)}%"></div>
              </div>
              <p style="text-align: right; font-size: 0.8em;">${Math.round(percentOfBudget)}% of budget used</p>
            </div>
          `;
        });
      }

      if (approachingBudgetAccounts.length > 0) {
        messageBody += `<div class="section-title">Accounts Approaching Budget Limit</div>`;
        
        approachingBudgetAccounts.forEach(account => {
          const percentOfBudget = (account.totalSpending / budgetData.budgetLimit) * 100;
          const remainingBudget = budgetData.budgetLimit - account.totalSpending;
          
          messageBody += `
            <div class="account approaching-budget">
              <h3>
                ${account.accountName}
                <span class="status-tag status-warning">WARNING</span>
              </h3>
              
              <div class="detail-row">
                <span class="detail-label">Product:</span>
                <span>${account.productName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Current Spending:</span>
                <span class="amount warning-amount">${formatCurrency(account.totalSpending)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Current Balance:</span>
                <span>${formatCurrency(parseFloat(account.currentBalance))}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Remaining Budget:</span>
                <span class="amount">${formatCurrency(remainingBudget)}</span>
              </div>
              
              <div class="progress-container">
                <div class="progress-bar progress-warning" style="width: ${percentOfBudget}%"></div>
              </div>
              <div style="text-align: right; font-size: 12px; font-weight: 500;">
                ${Math.round(percentOfBudget)}% of budget used
              </div>
            </div>
          `;
        });
      }

      messageBody += `
            <p style="text-align: center; font-weight: 500; margin-top: 24px;">
              Please review your spending immediately and make necessary adjustments to avoid exceeding your budget limits.
            </p>
            <a href="http://localhost:${process.env.PORT || 3000}" class="cta-button">
              Click To View Detailed Budget & Spending Dashboard
            </a>
            <div class="footer">
              <p>This is an automated message from your Budget Monitor application.</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Budget Monitor" <${EMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: emailSubject,
      html: messageBody
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Budget alert email successfully sent to ${NOTIFICATION_EMAIL}`);
    
    budgetData.notificationSent = true;
    
    return { 
      success: true, 
      messageId: info.messageId,
      alertType: overBudgetAccounts.length > 0 ? 'OVER_BUDGET' : 'APPROACHING_BUDGET',
      overBudgetCount: overBudgetAccounts.length,
      approachingBudgetCount: approachingBudgetAccounts.length
    };
  } catch (error) {
    console.error('Error sending budget alert email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * @returns {Promise<Object>} 
 */
async function sendTestEmail() {
  try {
    if (!EMAIL_USER || !EMAIL_PASS || !NOTIFICATION_EMAIL) {
      console.error('Email configuration missing. Please check your .env file.');
      return { success: false, message: 'Email configuration missing' };
    }

    const messageBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${emailStyles} 
          </style>
        </head>
        <body>
          <div class="container">
            <div class="banner">
              <h1>Budget Monitor</h1>
              <p>Email Configuration Test</p>
            </div>
            
            <div class="content">
              <div class="success-icon">✅</div>
              <p style="text-align: center; font-weight: 500; font-size: 18px;">Email Configuration Successful</p>
              <p>If you're receiving this email, your Budget Monitor email notifications are working correctly.</p>
              
              <div class="config-list">
                <p style="margin-top: 0; font-weight: 500;">Configuration details:</p>
                <ul style="list-style: none; padding-left: 0; margin: 0;">
                  <li><strong>SMTP Host:</strong> ${EMAIL_HOST}</li>
                  <li><strong>SMTP Port:</strong> ${EMAIL_PORT}</li>
                  <li><strong>Sender Email:</strong> ${EMAIL_USER}</li>
                  <li><strong>Notification Email:</strong> ${NOTIFICATION_EMAIL}</li>
                </ul>
              </div>
            </div>
            
            <a href="http://localhost:${process.env.PORT || 5000}" class="cta-button">
              Go to Dashboard
            </a>
            
            <div class="footer">
              <p>This is an automated message from your Budget Monitor application.</p>
              <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Budget Monitor" <${EMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject: "✅ Budget Monitor Email Configuration Test",
      html: messageBody
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Test email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendBudgetAlert,
  sendTestEmail
};