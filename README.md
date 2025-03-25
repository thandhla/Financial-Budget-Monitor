# Financial Budget Monitor

## Overview

### Explanation of the Solution

The Financial Budget Monitor provides a comprehensive solution for monitoring and managing personal finances. By integrating with the Investec API, it allows users to authenticate securely, fetch account details, and monitor transactions. The app alerts users when their spending exceeds predefined budget limits, helping them maintain financial discipline.

## Features

- **Authentication**: Securely authenticate with the Investec API using client credentials.
- **Account Management**: Fetch and display account details.
- **Transaction Monitoring**: Track spending and alert users when they exceed their budget.
- **Postman Integration**: Use Postman collections to test API endpoints.
- **Visual Budget Status**: The app visually indicates budget status by displaying the total spend and budget status in red if spending exceeds the budget, and in green if spending is within the budget.

## How It Works

The app uses OAuth2 for authentication, ensuring secure access to the Investec API. It fetches account details and transactions, calculates total spending, and compares it against a budget limit. If the spending exceeds the limit, it logs an alert and provides details of the top transactions. The app is built using Node.js and Express, providing a robust server setup for handling API requests and serving static files.

1. **Authentication**: The app uses OAuth2 to authenticate with the Investec API. The `auth.js` file handles the authentication process, obtaining an access token using client credentials.

2. **Fetching Accounts**: The `getAccounts.js` file contains functions to fetch account details from the Investec API. It uses the access token obtained during authentication to make secure API requests.

3. **Monitoring Spending**: The `monitorSpending.js` file monitors transactions for each account. It calculates total spending and compares it against a predefined budget limit. If the spending exceeds the limit, it logs an alert and provides details of the top transactions.

4. **Server Setup**: The `server.js` file sets up an Express server to serve static files and provide API endpoints for fetching client details. When you run `node server.js`, it first loads all the necessary data in the terminal and then displays it afterward, ensuring that the server is ready to handle incoming requests.

5. **Monitor Your Financial Budget**: A new section is added under "Running the Application" to instruct users to run `node index.js` to monitor their financial budget.

6. **Running the Application**: After starting the server, you can access the application through your web browser at http://localhost:3000.

## Installation Instructions
### Prerequisites

- Ensure you have Node.js and npm installed on your system.

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/thandhla/Financial-Budget-Monitor.git
   cd Financial-Budget-Monitor

2. **Install Dependencies**:
    ```bash
    npm install
   ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory. 
    Add your Investec API credentials or the necessary environment variables as shown in the `.env.example` file below:
    ```bash
    CLIENT_ID=<your-client-id>
    CLIENT_SECRET=<your-client-secret>
    API_KEY=<your-api-key>
    ACCOUNT_ID=<your-account-id>
    ```
   
    If you choose not to use the alert notification feature, the application will still compile and run successfully using the Investec API credentials.

4. **Configure Gmail for Notification**:

   **Step 1: Enable 2-Step Verification**
   - Visit Google Account settings at https://myaccount.google.com/
   - Navigate to "Security" in the left menu
   - Find "Signing in to Google" section
   - Select "2-Step Verification"
   - Verify identity with phone
   - Follow Google's instructions to complete setup

   **Step 2: Generate App Password**
   - Return to Google Account security settings
   - Locate "App passwords" under "Signing in to Google"
   - Click "App passwords" and verify password
   - Choose "Other (Custom name)" from dropdown
   - Name it "Budget Monitor App"
   - Click "Generate"
   - Copy the 16-character password (only shown once)

   **Step 3: Add the .env file**
   - Add your Gmail settings to your .env file:
   ```bash
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   NOTIFICATION_EMAIL=recipient@example.com
   ```

   **Step 4: Install Nodemailer**
   - If you haven't already, install Nodemailer package:
   ```bash
   npm install nodemailer
   ```

<img width="1122" alt="Screenshot 2025-03-23 at 14 37 00" src="https://github.com/user-attachments/assets/136d223c-af77-41bf-aded-339eaa3cd80f" />


Running the Application

1. **Start the Server**:
    ```bash
    node server.js
    ```

![Screenshot 2025-03-23 at 14 24 22](https://github.com/user-attachments/assets/8a7c2598-b559-4a59-8c51-7104abaeda9f)

![Screenshot 2025-03-23 at 14 55 32](https://github.com/user-attachments/assets/ed455e3a-b937-497c-a810-82c7051a74a9)
![Screenshot 2025-03-23 at 14 55 57](https://github.com/user-attachments/assets/913c3c0d-6026-4e68-a08c-bedd90b449cf)

- **Monitor Your Financial Budget**:
   To monitor your financial budget, run:
   ```bash
   node index.js
    ```
![Screenshot 2025-03-23 at 14 20 57](https://github.com/user-attachments/assets/779f21dc-ae13-4f95-9e99-3aafabe163c3)


2. **Access the Application**:
   Open your web browser and navigate to http://localhost:3000.

### Using Postman
- Postman Collection :
  - Click the Postman link in the application to open the sandbox specifically created for this environment.
  - Select the environment named "PB Sandbox[hwjwdhwevdwed]" - am using openaisandbox to set up the variables used throughout the collections.

#### Verify Setup
- Ensure that the server is running and accessible.
- Use Postman to send requests and verify that you receive the expected responses.

## Additional Resources
- Documentation

This guide should help you get started with the project. If you encounter any issues, refer to the documentation or reach out for support.
