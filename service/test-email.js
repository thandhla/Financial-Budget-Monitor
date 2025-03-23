const { sendTestEmail } = require('./notificationService');
require('dotenv').config();

async function runEmailTest() {
  try {
    console.log('Sending test email...');
    const result = await sendTestEmail();
    
    if (result.success) {
      console.log("✅ Email sent successfully!");
      console.log("Message ID:", result.messageId);
    } else {
      console.error("❌ Error sending email:", result.error || result.message);
      console.log("Please check your .env file for correct email configuration:");
      console.log("- EMAIL_HOST (e.g., smtp.gmail.com)");
      console.log("- EMAIL_PORT (e.g., 587)");
      console.log("- EMAIL_USER (your email address)");
      console.log("- EMAIL_PASS (your email password or app password)");
      console.log("- NOTIFICATION_EMAIL (recipient email address)");
    }
  } catch (error) {
    console.error("Unexpected error during email test:", error);
  }
}

runEmailTest();