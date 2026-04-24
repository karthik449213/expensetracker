# Expense Tracker Backend - Production Ready

A **production-ready** Express.js backend service for managing personal expenses with advanced features like authentication, CRUD operations, analytics, and dashboard insights.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)

### Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start development server
npm run dev

# 4. Test the server
curl http://localhost:5000/health
```

Server running on **http://localhost:5000** ✓

## 📋 Features

| Feature | Status |
|---------|--------|
| ✅ User Registration & Login | Implemented |
| ✅ JWT Authentication | Implemented |
| ✅ Password Hashing (bcrypt) | Implemented |
| ✅ Expense CRUD Operations | Implemented |
| ✅ Advanced Filtering | Implemented |
| ✅ Dashboard Analytics | Implemented |
| ✅ Error Handling | Implemented |
| ✅ Input Validation | Implemented |
| ✅ Pagination | Implemented |

## 📁 Project Structure

```
expense-tracker-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── expenseController.js  # Expense management logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── errorMiddleware.js    # Error handling middleware
│   ├── models/
│   │   ├── User.js               # User schema & validation
│   │   └── Expense.js            # Expense schema & validation
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── expenseRoutes.js      # Expense endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT token utilities
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── .env                          # Environment variables
├── .env.example                  # Example env template
├── package.json                  # Dependencies
├── API_DOCUMENTATION.md          # API docs
├── Expense_Tracker_API.postman_collection.json  # Postman collection
└── README.md                     # This file
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses` | Get all expenses (paginated) |
| GET | `/api/expenses/:id` | Get single expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/summary/dashboard` | Get analytics & summary |

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Example Usage

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  ' {"username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }
   
  -d '
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.99,
    "category": "Food",
    "date": "2024-04-23T12:30:00Z",
    "note": "Lunch"
  }'
```

### 4. Get All Expenses
```bash
curl -X GET "http://localhost:5000/api/expenses?category=Food&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 5. Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/expenses/summary/dashboard" \
  -H "Authorization: Bearer <token>"
```

## 📚 Detailed Documentation

For comprehensive API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🛠️ Development

### Scripts

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/expense-tracker

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Security
BCRYPT_ROUNDS=10
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT tokens with expiration
- ✅ CORS protection
- ✅ Input validation on all endpoints
- ✅ Error handling middleware
- ✅ Centralized security practices

## 📦 Available Categories

- Food
- Transportation
- Entertainment
- Shopping
- Utilities
- Healthcare
- Education
- Other

## 💳 Payment Methods

- Cash
- Card
- UPI
- Bank Transfer
- Other

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
✗ Ensure MongoDB is running
✗ Check MONGO_URI in .env file
✗ Verify network connectivity
```

### Invalid Token Error
```
✗ Include token in Authorization header
✗ Check token hasn't expired
✗ Verify JWT_SECRET matches
```

### Port Already in Use
```bash
# Change PORT in .env or kill process
# On Windows: netstat -ano | findstr :5000
# On Mac/Linux: lsof -i :5000
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (min 32 chars)
- [ ] Configure `MONGO_URI` for production DB
- [ ] Set proper `CORS_ORIGIN` for frontend domain
- [ ] Enable HTTPS/SSL
- [ ] Setup environment variables securely
- [ ] Enable logging and monitoring
- [ ] Setup backup strategy for MongoDB
- [ ] Configure rate limiting
- [ ] Setup CI/CD pipeline

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=<your-mongo-uri>
heroku config:set JWT_SECRET=<your-secret>
```

### Deploy to AWS Lambda

Use serverless framework or AWS Amplify:

```bash
serverless deploy
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT handling
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment management

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📝 License

ISC

## 💡 Next Steps

1. ✅ Backend API complete
2. 🔄 Connect frontend React Native app
3. 📱 Setup mobile authentication
4. 📊 Integrate dashboard UI
5. 🔔 Add push notifications
6. 📈 Add advanced analytics

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Email: support@expensetracker.dev

---

**Built with ❤️ using Express.js, MongoDB, and modern Node.js practices**

Happy tracking! 💰
