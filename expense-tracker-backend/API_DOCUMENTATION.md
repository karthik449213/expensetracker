# Expense Tracker Backend API Documentation

A production-ready Express.js backend for managing personal expenses with authentication, CRUD operations, and dashboard analytics.

## Features

- 🔐 **JWT Authentication** - Secure user login and registration with bcrypt password hashing
- 💰 **Expense Management** - Create, read, update, and delete expenses
- 📊 **Dashboard Analytics** - Category-wise aggregation, monthly summaries, and top categories
- 🔍 **Advanced Filtering** - Filter expenses by category, date range, and pagination
- ✅ **Input Validation** - Comprehensive validation for all inputs
- 🛡️ **Error Handling** - Centralized error handling middleware
- 📱 **Production Ready** - Follows MVC architecture and best practices

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   cd expense-tracker-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

4. **Start the server**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-04-23T10:30:00.000Z"
  }
}
```

### Expenses

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 50.99,
  "category": "Food",
  "date": "2024-04-23T12:30:00Z",
  "note": "Lunch at restaurant",
  "paymentMethod": "Card",
  "isRecurring": false,
   "tags": ["business-trip", "client-meeting", "reimbursable"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "expense": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 50.99,
    "category": "Food",
    "date": "2024-04-23T12:30:00.000Z",
    "note": "Lunch at restaurant",
    "paymentMethod": "Card",
    "isRecurring": false,
    "createdAt": "2024-04-23T10:30:00.000Z",
    "updatedAt": "2024-04-23T10:30:00.000Z"
  }
}
```

#### Get All Expenses
```http
GET /api/expenses?category=Food&startDate=2024-04-01&endDate=2024-04-30&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category (Food, Transportation, Entertainment, Shopping, Utilities, Healthcare, Education, Other)
- `startDate` (optional): ISO date format (YYYY-MM-DD or ISO 8601)
- `endDate` (optional): ISO date format (YYYY-MM-DD or ISO 8601)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "limit": 10,
  "pages": 3,
  "expenses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 50.99,
      "category": "Food",
      "date": "2024-04-23T12:30:00.000Z",
      "note": "Lunch at restaurant",
      "paymentMethod": "Card",
      "isRecurring": false,
      "createdAt": "2024-04-23T10:30:00.000Z",
      "updatedAt": "2024-04-23T10:30:00.000Z"
    }
  ]
}
```

#### Get Single Expense
```http
GET /api/expenses/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "expense": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 50.99,
    "category": "Food",
    "date": "2024-04-23T12:30:00.000Z",
    "note": "Lunch at restaurant",
    "paymentMethod": "Card",
    "isRecurring": false,
    "createdAt": "2024-04-23T10:30:00.000Z",
    "updatedAt": "2024-04-23T10:30:00.000Z"
  }
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 55.99,
  "note": "Updated lunch expense"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "expense": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 55.99,
    "category": "Food",
    "date": "2024-04-23T12:30:00.000Z",
    "note": "Updated lunch expense",
    "paymentMethod": "Card",
    "isRecurring": false,
    "createdAt": "2024-04-23T10:30:00.000Z",
    "updatedAt": "2024-04-23T11:45:00.000Z"
  }
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

### Dashboard

#### Get Expense Summary
```http
GET /api/expenses/summary/dashboard?startDate=2024-04-01&endDate=2024-04-30
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "summary": {
    "totalExpenses": 1250.75,
    "totalTransactions": 32,
    "categoryWise": [
      {
        "_id": "Food",
        "total": 450.50,
        "count": 12
      },
      {
        "_id": "Transportation",
        "total": 320.00,
        "count": 8
      },
      {
        "_id": "Entertainment",
        "total": 200.25,
        "count": 5
      }
    ],
    "topCategories": [
      {
        "_id": "Food",
        "total": 450.50,
        "count": 12
      },
      {
        "_id": "Transportation",
        "total": 320.00,
        "count": 8
      },
      {
        "_id": "Entertainment",
        "total": 200.25,
        "count": 5
      }
    ],
    "monthlySummary": [
      {
        "_id": {
          "year": 2024,
          "month": 4
        },
        "total": 1250.75,
        "count": 32
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Please provide amount, category, and date"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token. Please login again."
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Expense not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "statusCode": 409,
  "message": "email already exists"
}
```

### 500 Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

## Categories

Available expense categories:
- Food
- Transportation
- Entertainment
- Shopping
- Utilities
- Healthcare
- Education
- Other

## Payment Methods

Available payment methods:
- Cash
- Card
- UPI
- Bank Transfer
- Other

## Best Practices

### Authentication
1. **Always include JWT token** in the Authorization header: `Authorization: Bearer <token>`
2. **Store token securely** in your mobile app (use secure storage)
3. **Refresh token** before expiration (default: 7 days)
4. **Log out properly** to clear token from client storage

### Expense Management
1. **Use ISO 8601 format** for dates: `YYYY-MM-DDTHH:mm:ssZ`
2. **Validate amounts** - must be positive numbers
3. **Use proper category** from the predefined list
4. **Add meaningful notes** for future reference
5. **Set payment method** for accurate tracking

### API Usage
1. **Use pagination** for large datasets (default limit: 10)
2. **Filter data** server-side using query parameters
3. **Handle errors** gracefully in your client
4. **Cache responses** when appropriate
5. **Rate limit** requests to prevent abuse

## Development

### Project Structure
```
src/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic
│   └── expenseController.js  # Expense logic
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── errorMiddleware.js    # Error handling
├── models/
│   ├── User.js               # User schema
│   └── Expense.js            # Expense schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── expenseRoutes.js      # Expense endpoints
├── utils/
│   └── generateToken.js      # JWT utilities
├── app.js                    # Express app setup
└── server.js                 # Entry point
```

### Running Tests
```bash
npm test
```

### Code Quality
- Follows ES6+ standards
- Uses async/await for asynchronous operations
- Comprehensive error handling
- Clean code with comments
- Separation of concerns (MVC pattern)

## Security Considerations

1. **Passwords**: Hashed with bcryptjs (10 rounds)
2. **JWT**: Signed with secret key, expires in 7 days
3. **Validation**: Input validation on all endpoints
4. **Database**: Indexed queries for performance
5. **CORS**: Configured for allowed origins
6. **Environment**: Secrets stored in .env file

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or provide valid Atlas URI
- Check `MONGO_URI` in .env file
- Verify network connectivity

### JWT Token Invalid
- Ensure token is passed in Authorization header: `Bearer <token>`
- Check token hasn't expired
- Verify JWT_SECRET matches between registration and login

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
