# Financial-Budget-Monitor

## Overview

### Explanation of the Solution

The Financial Health App provides a comprehensive solution for monitoring and managing personal finances. Integrating with the Investec API allows users to authenticate securely, fetch account details, and monitor transactions. The app alerts users when spending exceeds predefined budget limits, helping them maintain financial discipline.

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
![Screenshot 2025-03-15 at 01 12 50](https://github.com/user-attachments/assets/81af913d-a801-4c0e-a1e0-5b61abc05532)

5. **Monitor Your Financial Health**: A new section is added under "Running the Application" to instruct users to run `node index.js` to monitor their financial health.

6. **Running the Application**: After starting the server, you can access the application through your web browser at http://localhost:5000.

## Installation Instructions
### Prerequisites

- Ensure you have Node.js and npm installed on your system.

### Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd financial-health-app

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

Running the Application

1. **Start the Server**:
    ```bash
    node server.js
    ```
![Screenshot 2025-03-15 at 03 08 11](https://github.com/user-attachments/assets/d00d90dd-bf58-43bd-ab76-67447aedf797)
![Screenshot 2025-03-15 at 03 13 36](https://github.com/user-attachments/assets/7b6fa7a5-0c74-4022-ace0-b5d9b5c0af71)

**To monitor your financial health, run**:
    ```bash
     node index.js
    ```

2. **Access the Application**:
   Open your web browser and navigate to http://localhost:5000.

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
