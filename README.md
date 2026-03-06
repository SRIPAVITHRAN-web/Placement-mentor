# AI Placement Mentor Backend

A comprehensive backend API for the AI Placement Mentor platform, built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based authentication with secure password hashing
- 📊 **Task Management** - Complete CRUD operations for coding tasks with progress tracking
- 👥 **User Management** - User profiles, statistics, achievements, and leaderboard
- 🏆 **Platform Integration** - Support for multiple coding platforms (LeetCode, CodeChef, etc.)
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation
- 📈 **Analytics** - User statistics, task completion tracking, and performance metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-placement-mentor
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:8000
   ```

4. **Start MongoDB**
   - For local MongoDB: Start your MongoDB service
   - For MongoDB Atlas: Update `MONGODB_URI` with your Atlas connection string

5. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/deactivate` - Deactivate account

### Tasks
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/complete` - Mark task as completed
- `PUT /api/tasks/:id/unlock-hint` - Unlock task hint
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/achievements` - Get achievements
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/search` - Search users

### Platforms
- `GET /api/platforms` - Get all platforms
- `GET /api/platforms/:id` - Get single platform
- `GET /api/platforms/categories/list` - Get platform categories
- `POST /api/platforms/initialize` - Initialize default platforms
- `PUT /api/platforms/:id/connect` - Connect to platform
- `PUT /api/platforms/:id/disconnect` - Disconnect from platform
- `GET /api/platforms/user/connections` - Get user connections
- `PUT /api/platforms/:id/sync` - Sync platform data

### Health Check
- `GET /api/health` - API health check

## API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "pagination": {}, // Pagination info (if applicable)
  "errors": [] // Validation errors (if applicable)
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Models

### User
- Personal information, authentication, statistics
- Platform connections and achievements
- Preferences and settings

### Task
- Problem details, difficulty, platform
- Completion status, hints, solutions
- Time tracking and deadlines

### Platform
- Platform information and features
- Statistics and supported languages
- User connections and data

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation with express-validator
- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Data Sanitization**: Automatic trimming and validation

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (Jest)

### Project Structure

```
backend/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── .env            # Environment variables
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment variables
5. Add your IP address to the whitelist

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub or contact the development team.