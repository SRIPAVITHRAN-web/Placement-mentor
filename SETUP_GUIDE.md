# AI Placement Mentor - Setup & Installation Guide

## Project Overview
AI Placement Mentor is an intelligent coding platform that provides:
- Daily AI-powered task recommendations
- Streak and time tracking
- Multi-platform integration (LeetCode, HackerRank, CodeChef, etc.)
- Performance analytics and insights
- Personalized learning paths

---

## Prerequisites

### Required Software
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MongoDB** (Local or Cloud) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Recommended Tools
- **Postman** - For API testing
- **MongoDB Compass** - For database visualization
- **VS Code** - Code editor

---

## Installation Steps

### 1. Clone the Repository
```bash
cd your-work-directory
git clone https://github.com/yourusername/ai-placement-mentor.git
cd ai-placement-mentor
```

### 2. Install Dependencies
```bash
npm install
```

This will install all packages from `package.json`:
- express
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- mongoose
- express-validator
- nodemailer
- axios

### 3. Setup Environment Variables
Create a `.env` file in the root directory (already provided) and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ai-placement-mentor
MONGODB_TEST_URI=mongodb://localhost:27017/ai-placement-mentor-test

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail

# Rate Limiting
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15m

# Daily Goals
DAILY_GOAL_MINUTES=45
```

---

### 4. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string and set as `MONGODB_URI` in `.env`

---

### 5. Start the Server

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

Expected output:
```
🚀 AI Placement Mentor Server running on http://localhost:3000
📊 API Health: http://localhost:3000/api/health
📚 Tasks: http://localhost:3000/api/tasks
```

---

## Project Structure

```
ai-placement-mentor/
├── index.html                 # Homepage
├── features.html              # Features page
├── about.html                 # About page
├── login.html                 # Login page
├── styles.css                 # Main stylesheet
├── server.js                  # Express server
├── package.json               # Dependencies
├── .env                       # Environment variables
├── .env.example               # Example env file
├── database-schema.js         # MongoDB schemas
├── auth-middleware.js         # Authentication logic
├── recommendation-engine.js   # AI recommendation system
├── API_DOCUMENTATION.md       # API endpoints docs
└── SETUP_GUIDE.md            # This file
```

---

## Frontend Pages

### 1. Homepage (index.html)
- **Path**: `/`
- **Features**:
  - Hero section with CTA
  - Daily task recommendations
  - Streak and time tracking
  - Performance metrics

### 2. Features Page (features.html)
- **Path**: `/features`
- **Highlights**:
  - Intelligent weakness mapping
  - Dynamic problem intelligence
  - AI interview simulator
  - Platform integration showcase

### 3. About Page (about.html)
- **Path**: `/about`
- **Content**:
  - Mission statement
  - How it works
  - Key highlights

### 4. Login Page (login.html)
- **Path**: `/login`
- **Functionality**:
  - User authentication
  - Registration
  - Password recovery

---

## Backend API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user

### User Profile
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

### Tasks
- `GET /api/tasks` - Get daily AI tasks
- `GET /api/tasks/all` - Get all available tasks
- `POST /api/task-progress` - Submit task progress

### Analytics
- `GET /api/progress` - Get progress summary
- `GET /api/analytics/weekly` - Weekly statistics
- `GET /api/analytics/monthly` - Monthly statistics

### Streak
- `GET /api/streak` - Get streak information
- `GET /api/streak/calendar` - Get streak calendar

### Recommendations
- `GET /api/recommendations` - Get AI recommendations

### Platforms
- `GET /api/platforms` - Get supported platforms

---

## Testing the Application

### 1. Test Server Health
```bash
curl http://localhost:3000/api/health
```

### 2. Get Daily Tasks
```bash
curl http://localhost:3000/api/tasks
```

### 3. Register User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 4. Login User
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

---

## Database Design

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  college: String,
  year: String,
  streak: Number,
  totalProblemsAttempted: Number,
  totalProblemsSolved: Number,
  accuracy: Number,
  weeklyTimeSpent: Number,
  weakAreas: Array,
  strongAreas: Array,
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  platform: String,
  difficulty: String,
  category: String,
  timeEstimate: Number,
  externalUrl: String,
  likes: Number,
  createdAt: Date
}
```

#### UserTaskProgress
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  taskId: ObjectId (ref: Task),
  status: String,
  attempts: Number,
  isSolved: Boolean,
  timeSpent: Number,
  feedback: String,
  completedAt: Date,
  createdAt: Date
}
```

---

## Configuration

### Environment Variables Explained

| Variable | Purpose | Default |
|----------|---------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Development/Production | development |
| MONGODB_URI | Database URL | localhost:27017 |
| JWT_SECRET | Token signing key | your_key |
| JWT_EXPIRE | Token expiration | 7d |
| CORS_ORIGIN | Allowed origins | localhost:3000 |
| DAILY_GOAL_MINUTES | Daily target | 45 |

---

## Common Issues & Solutions

### 1. MongoDB Connection Error
```bash
# Error: connect ECONNREFUSED 127.0.0.1:27017

# Solution:
# Make sure MongoDB is running
mongod  # Windows/Mac/Linux
```

### 2. Port Already In Use
```bash
# Error: listen EADDRINUSE :::3000

# Solution:
# Change PORT in .env or kill the process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### 3. npm Install Fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### 4. JWT Secret Not Set
```bash
# Error: Cannot read property 'sign' of undefined

# Solution:
# Ensure JWT_SECRET is set in .env
JWT_SECRET=your_strong_secret_here
```

---

## Performance Optimization

### 1. Enable Caching
```javascript
// In server.js
app.use(compression());
app.set('view cache', true);
```

### 2. Database Indexing
```javascript
// Create indexes for frequently queried fields
db.users.createIndex({ email: 1 });
db.tasks.createIndex({ category: 1, difficulty: 1 });
db.userTaskProgress.createIndex({ userId: 1, taskId: 1 });
```

### 3. Rate Limiting
Already implemented in `auth-middleware.js`

### 4. Load Balancing (Production)
Use Nginx or HAProxy to distribute traffic

---

## Deployment

### Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create App**
```bash
heroku create ai-placement-mentor
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_url
```

5. **Deploy**
```bash
git push heroku main
```

### Deploy to AWS/GCP
See respective cloud provider documentation

---

## Monitoring & Logging

### Enable Logging
```javascript
// Add to server.js
import morgan from 'morgan';
app.use(morgan('combined')); // HTTP request logger
```

### Monitor Performance
```bash
npm install pm2 -g
pm2 start server.js
pm2 monit
```

---

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** only for production
3. **Implement HTTPS redirect**
4. **Set secure cookies**
5. **Validate all inputs**
6. **Use environment variables** for sensitive data
7. **Enable CORS** selectively
8. **Implement rate limiting** (already done)
9. **Hash passwords** with bcryptjs (already done)
10. **Regular security audits**

---

## Next Steps

1. ✅ Install and setup the project
2. ✅ Start the server
3. ✅ Test API endpoints using Postman
4. ✅ Create database collections
5. ✅ Implement user authentication
6. ✅ Add task scheduling
7. ✅ Setup email notifications
8. ✅ Deploy to production

---

## Support & Resources

- **Documentation**: See `API_DOCUMENTATION.md`
- **Issues**: Create an issue on GitHub
- **Contributing**: Fork and submit a pull request
- **License**: MIT

---

## Quick Start Command

```bash
# Clone
git clone <repo-url>
cd ai-placement-mentor

# Install
npm install

# Configure
# Edit .env file with your settings

# Start MongoDB
mongod

# Run
npm run dev

# Test
curl http://localhost:3000/api/health
```

---

**Happy Coding! 🚀**

For more help, refer to `API_DOCUMENTATION.md`
