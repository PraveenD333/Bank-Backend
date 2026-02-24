# Bank Backend API

A secure, RESTful backend API for a banking application built with Node.js and Express. This API handles user authentication, account management, and financial transactions.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Account Management**: Create, update, and manage user accounts
- **Transaction Processing**: Handle deposits, withdrawals, and transfers
- **Email Notifications**: Send emails for account activities and OTP verification
- **Password Security**: Bcryptjs encryption for stored passwords
- **Blacklist Management**: Token blacklisting for logout functionality
- **Ledger Tracking**: Maintain transaction history and ledger records

## 📁 Project Structure

```
Bank Backend/
├── server.js                   # Entry point
├── package.json                # Project dependencies & scripts
├── .env                        # Environment variables
└── src/
    ├── app.js               # Express app configuration
    ├── Database/
    │   └── db.js            # MongoDB connection
    ├── Controllers/
    │   ├── auth.cont.js     # Authentication logic
    │   ├── account.cont.js  # Account management logic
    │   └── transation.cont.js # Transaction processing logic
    |   └── statement.cont.js # Statement generation logic
    ├── Routes/
    │   ├── auth.route.js    # Auth endpoints
    │   ├── account.route.js # Account endpoints
    │   └── transaction.route.js # Transaction endpoints
    |   └── statement.route.js # Statement endpoints
    ├── Middleware/
    │   └── auth.middle.js   # JWT authentication middleware
    ├── Model/
    │   ├── uers.model.js    # User schema
    │   ├── account.model.js # Account schema
    │   ├── transation.model.js # Transaction schema
    │   ├── ledger.model.js  # Ledger schema
    │   └── balacklist.model.js # Blacklist schema
    └── Services/
        ├── email.js         # Email service
        ├── generatetoken.js # JWT token generation
        ├── randomGenerator.js  # Accout number and IdempotanceKey generation service
        └── response.js      # Response formatting utility
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=9000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_address
   EMAIL_PASSWORD=your_email_password
   NODE_ENV=development
   ```

## 🚀 Getting Started

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Account Routes (`/api/account`)
- `POST /api/account/create` - Create new account
- `GET /api/account/get` - Get account details
- `GET /api/account//balance/:accountId` - Get account balance

### Transaction Routes (`/api/transaction`)
- `POST /api/transaction/tran` - create transaction  

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for password encryption
- **Token Blacklisting**: Support for token revocation on logout
- **Protected Routes**: Middleware-based route protection

## 📦 Dependencies

- **express**: ^5.2.1 - Web application framework
- **mongoose**: ^9.2.1 - MongoDB object modeling
- **jsonwebtoken**: ^9.0.3 - JWT implementation
- **bcryptjs**: ^3.0.3 - Password hashing
- **nodemailer**: ^8.0.1 - Email sending service
- **cookie-parser**: ^1.4.7 - Cookie parsing middleware
- **dotenv**: ^17.3.1 - Environment variable management
- **pdfkit**: "^0.17.2" - PDF generation service


## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Created and maintained by Praveen.

**Last Updated**: February 2026
