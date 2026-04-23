# Quick Start Guide - Expense Tracker Backend

Get your expense tracker backend running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd expense-tracker-backend
npm install
```

## Step 2: Configure Environment

Create `.env` file:

```bash
# Copy example to actual
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRE=7d
```

**Note:** If using MongoDB Atlas, replace `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

## Step 3: Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Output should show:

```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Environment: development
```

## Step 4: Test the API

### Health Check

```bash
curl http://localhost:5000/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-23T10:30:00.000Z"
}
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Save the returned `token` for next requests.

### Create Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "category": "Food",
    "date": "2024-04-23T12:30:00Z",
    "note": "Lunch"
  }'
```

### Get All Expenses

```bash
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Dashboard Summary

```bash
curl -X GET http://localhost:5000/api/expenses/summary/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import collection: `Expense_Tracker_API.postman_collection.json`
3. Set `token` variable in Postman environment
4. Start testing!

**Setup Token Variable:**
- Get token from login/register response
- Click "Settings" (top-right) → "Manage Environments"
- Create new environment
- Add variable: `token` = your_jwt_token_here

## Database Setup

### Local MongoDB

```bash
# Install MongoDB (if not already)
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB
# Windows: mongod
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify connection
mongo mongodb://localhost:27017/expense-tracker
```

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create cluster
4. Get connection string
5. Update `MONGO_URI` in `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

## Troubleshooting

### Server won't start

```bash
# Check if port is in use
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000

# Kill process and try again or change PORT in .env
```

### MongoDB connection error

```bash
# Verify MongoDB is running
# Windows: Check MongoDB in Services
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Check connection string in .env
# Local: mongodb://localhost:27017/expense-tracker
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/db
```

### JWT token issues

```bash
# Token expired? Login again to get new token
# Token invalid? Check Authorization header format: "Bearer <token>"
# Wrong secret? Check JWT_SECRET in .env matches
```

## Next Steps

1. ✅ Server running
2. ✅ Database connected
3. ✅ API tested
4. 📱 Connect mobile frontend (React Native)
5. 🔔 Add notifications
6. 📊 Enhance analytics

## File Structure Reference

```
src/
├── config/db.js           # DB connection
├── controllers/
│   ├── authController.js  # Login, Register
│   └── expenseController.js # CRUD, Dashboard
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   └── errorMiddleware.js # Error handling
├── models/
│   ├── User.js            # User model
│   └── Expense.js         # Expense model
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── expenseRoutes.js   # Expense endpoints
├── utils/
│   └── generateToken.js   # JWT utilities
├── app.js                 # Express setup
└── server.js              # Entry point
```

## Common Tasks

### Change port

```env
PORT=3001
```

### Change JWT expiration

```env
JWT_EXPIRE=30d
```

### Enable debug logging

```bash
# Windows
set DEBUG=*&npm run dev

# Mac/Linux
DEBUG=* npm run dev
```

### Reset database

```bash
# Delete all collections
# Use MongoDB Compass or mongosh CLI
```

## Performance Tips

1. **Use pagination**: Add `?page=1&limit=10` to GET requests
2. **Filter data**: Use `?category=Food&startDate=2024-04-01` to reduce data
3. **Connection pooling**: Mongoose manages this automatically
4. **Indexes**: Already configured on userId and category

## Production Deployment

Before deploying:

1. Change `NODE_ENV=production`
2. Use strong `JWT_SECRET` (32+ chars)
3. Use production MongoDB URI
4. Set up environment variables securely
5. Configure CORS for your frontend domain
6. Enable HTTPS/SSL
7. Setup monitoring and logging

## Support

- 📖 See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full API reference
- 🐛 Check [README.md](./README.md) for troubleshooting
- 💬 Open an issue for help

---

**Happy coding! 🚀**
