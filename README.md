# 🚀 AI Placement Mentor

**An AI-Powered Placement Preparation Platform for Students**

Transform your placement journey with intelligent daily task recommendations, streak motivation, and comprehensive performance tracking.

---

## ✨ Features

### 🎯 Intelligent Task Recommendations
- AI analyzes your coding performance in real-time
- Personalized daily tasks from multiple platforms
- Smart difficulty progression based on your skill level
- Tasks from LeetCode, HackerRank, CodeChef, and more

### 🔥 Streak & Motivation System
- Track your daily consistency with streaks
- Visual progress indicators
- Milestone celebrations
- Habit-building gamification

### ⏱️ Time Management
- Daily 45-minute goal tracking
- Weekly progress visualization
- Time spent per problem analysis
- Habit tracking and insights

### 📊 Advanced Analytics
- Comprehensive performance metrics
- Category-wise accuracy analysis
- Weekly and monthly trends
- Placement readiness score

### 🌐 Multi-Platform Integration
- **LeetCode** - 1500+ DSA problems
- **HackerRank** - Structured challenges
- **CodeChef** - Competitive programming
- **GeeksforGeeks** - Problems with explanations
- **InterviewBit** - Interview prep
- **Codewars** - Gamified challenges

### 🤖 AI-Powered Features
- Weakness detection algorithm
- Strength reinforcement
- Interview readiness prediction
- Personalized learning path generation

---

## 🎨 Design Highlights

### Modern UI/UX
- **Glassmorphism Design**: Sleek, contemporary aesthetic
- **Smooth Animations**: Engaging micro-interactions
- **Responsive Layout**: Perfect on all devices
- **Dark Theme**: Easy on the eyes, professional look
- **Color Gradients**: Vibrant cyan and blue accents

### Target Audience
- **18-21 years old students** (primary)
- College students preparing for placements
- Self-learners wanting structured guidance
- Competitive programmers

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Advanced styling with animations
- **JavaScript (Vanilla)** - Interactive features
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Tools & Libraries
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **Bcryptjs** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation
- **Dotenv** - Environment variable management
- **Nodemon** - Development auto-reload

---

## 📁 Project Structure

```
ai-placement-mentor/
├── 📄 index.html                   # Homepage
├── 📄 features.html                # Features showcase
├── 📄 about.html                   # About us page
├── 📄 login.html                   # Login/Register
├── 📄 styles.css                   # Main stylesheet (2000+ lines)
├── 🔧 api-client.js                # Frontend API integration
├── 📖 README.md                    # Project documentation
├── backend/                        # Backend application
│   ├── 📦 package.json             # Backend dependencies
│   ├── 🔧 server.js                # Express server
│   ├── 🔑 .env                     # Environment variables
│   ├── 📖 README.md                # Backend documentation
│   ├── models/                     # Database models
│   │   ├── User.js                 # User model
│   │   ├── Task.js                 # Task model
│   │   └── Platform.js             # Platform model
│   ├── routes/                     # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   ├── tasks.js                # Task management routes
│   │   ├── users.js                # User management routes
│   │   └── platforms.js            # Platform routes
│   └── middleware/                 # Custom middleware
│       └── auth.js                 # Authentication middleware
└── 🔧 SETUP_GUIDE.md               # Installation guide
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14.0.0+
- MongoDB (local installation or MongoDB Atlas cloud)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/ai-placement-mentor.git
   cd ai-placement-mentor
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Edit backend/.env with your settings
   # For MongoDB Atlas: Update MONGODB_URI
   # For local MongoDB: Use default mongodb://localhost:27017/ai-placement-mentor
   ```

4. **Database Setup**
   ```bash
   # Option 1: Local MongoDB
   mongod  # Start local MongoDB service

   # Option 2: MongoDB Atlas (Recommended for production)
   # Create account at https://cloud.mongodb.com
   # Create cluster and update MONGODB_URI in .env
   ```

5. **Start the Backend Server**
   ```bash
   cd backend
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```
   Backend runs on `http://localhost:5000`

6. **Start the Frontend**
   ```bash
   # Option 1: Open directly in browser
   # Open index.html in your web browser

   # Option 2: Use local server (recommended)
   cd ..  # Back to root directory
   npx serve . -p 8000
   # or
   python -m http.server 8000
   ```
   Frontend runs on `http://localhost:8000`

7. **Test the Application**
   - Open `http://localhost:8000` in browser
   - Backend API available at `http://localhost:5000/api/health`

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/deactivate` - Deactivate account

### Tasks (`/api/tasks`)
- `GET /api/tasks` - Get all user tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/complete` - Mark task as completed
- `PUT /api/tasks/:id/unlock-hint` - Unlock task hint
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

### Users (`/api/users`)
- `GET /api/users/profile` - Get user profile
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/achievements` - Get achievements
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/search` - Search users

### Platforms (`/api/platforms`)
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

See `backend/README.md` for detailed API documentation with request/response examples.

---

## 🔗 Frontend-Backend Integration

The frontend communicates with the backend through RESTful APIs using the provided `api-client.js` library.

### Include API Client
```html
<script src="api-client.js"></script>
```

### Example Usage
```javascript
// Test API connection
const isConnected = await testAPIConnection();

// User registration
const user = await registerUser('john_doe', 'john@example.com', 'password123');

// User login
const session = await loginUser('john@example.com', 'password123');

// Get user tasks
const tasks = await getUserTasks('pending', 1, 10);

// Create new task
const task = await createNewTask({
  title: 'Two Sum',
  description: 'Solve the Two Sum problem',
  platform: 'LeetCode',
  difficulty: 'Easy',
  category: 'Array'
});

// Get leaderboard
const leaderboard = await getLeaderboard(10);
```

### Authentication Flow
1. User registers/logs in through frontend
2. JWT token stored in localStorage
3. API client automatically includes token in requests
4. Protected routes validate token on backend
5. Logout clears token from storage

---

## 🎯 Key Features Explained

### 1. Daily AI Tasks
Every morning, students get 3 personalized tasks:
- 1 easy warm-up problem
- 1-2 medium problems targeting weak areas
- 1 hard problem to reinforce strengths

Time allocation: 45 minutes per day

### 2. Streak System
- **Current Streak**: Consecutive days of practice
- **Longest Streak**: Personal best record
- **Calendar View**: Visual representation of activity
- **Milestone Badges**: Celebrate consistency

### 3. Performance Metrics
- **Accuracy Rate**: Problems solved correctly
- **Weekly Time**: Total practice time per week
- **Task Completion**: Percentage of assigned tasks completed
- **Skill Level**: Beginner → Intermediate → Advanced

### 4. AI Recommendation Engine
Algorithm considers:
- Accuracy percentage
- Problems attempted
- Category completion
- Time spent
- Streak consistency

Generates:
- Placement readiness score (0-100%)
- Weak area identification
- Strength reinforcement tasks
- Milestone predictions

---

## 💡 How It Works

```
1. User Registers → Profile Created
   ↓
2. Daily Check-in → AI Analyzes Performance
   ↓
3. Generate Tasks → Based on Weak Areas & Level
   ↓
4. Solve Problems → Track Time & Accuracy
   ↓
5. Get Insights → Analytics & Recommendations
   ↓
6. Build Streak → Maintain Consistency
   ↓
7. Interview Ready → Reach 80%+ Readiness Score
```

---

## 📊 Database Schema

### Collections
- **users** - User profiles and progress
- **tasks** - Curated coding problems
- **userTaskProgress** - Problem-solving history
- **dailyTasks** - Daily assignments
- **streaks** - Streak tracking
- **analytics** - Performance data
- **recommendations** - AI suggestions

See **database-schema.js** for detailed schema definitions.

---

## 🔐 Security Features

✅ Password hashing with bcryptjs  
✅ JWT-based authentication  
✅ Rate limiting (5 attempts/15 minutes)  
✅ CORS protection  
✅ Input validation  
✅ Environment variables for secrets  
✅ HTTPS ready  
✅ Session management  

---

## 📈 Future Enhancements

- [ ] Real-time websocket updates
- [ ] Video explanations for problems
- [ ] Code collaboration features
- [ ] Interview simulation mode
- [ ] LinkedIn resume builder
- [ ] Company-specific prep tracks
- [ ] Mobile app (React Native)
- [ ] AI chat mentor
- [ ] Marketplace for problem editorials
- [ ] Integration with GitHub for portfolio

---

## 🚀 Deployment

### Frontend Deployment
The frontend is static and can be deployed to any static hosting service:

- **Netlify**: Drag & drop the project files
- **Vercel**: Connect GitHub repo for automatic deployments
- **GitHub Pages**: Use GitHub Actions for deployment
- **AWS S3 + CloudFront**: For scalable static hosting

### Backend Deployment
Deploy the backend to a cloud platform:

- **Railway**: Simple Node.js deployment with MongoDB
- **Render**: Free tier with automatic deployments
- **Heroku**: Traditional PaaS with easy scaling
- **DigitalOcean App Platform**: Cloud-native deployment
- **AWS EC2**: Full control with auto-scaling

### Production Configuration
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
```

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Get connection string and update `MONGODB_URI`
5. Add your server IP to whitelist (or 0.0.0.0/0 for all)

### Environment Variables Checklist
- [ ] `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] MongoDB Atlas connection string
- [ ] Correct `FRONTEND_URL` for CORS
- [ ] HTTPS enabled in production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🆘 Support & Contact

- 📧 Email: support@aiplacementmentor.com
- 💬 Discord: [Join our community](https://discord.gg/yourlink)
- 🐦 Twitter: [@AIPlacementMentor](https://twitter.com/yourprofile)
- 🤝 LinkedIn: [Company Page](https://linkedin.com/company/yourcompany)

---

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Installation & configuration
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](./database-schema.js)** - Data models
- **[Auth Middleware](./auth-middleware.js)** - Security implementation
- **[Recommendation Engine](./recommendation-engine.js)** - AI algorithm

---

## 🏆 Why Choose AI Placement Mentor?

| Feature | AI Mentor | Others |
|---------|-----------|--------|
| AI-Powered Recommendations | ✅ | ❌ |
| Multi-Platform Support | ✅ | Partial |
| Streak Tracking | ✅ | ❌ |
| Time Management | ✅ | Limited |
| Weekly/Monthly Analytics | ✅ | Basic |
| Placement Readiness Score | ✅ | ❌ |
| Interview Simulation | Planned | Some |
| Free Version | ✅ | Some |

---

## 📊 Statistics

- **2500+** Curated problems
- **6** Supported platforms
- **14** Problem categories
- **100%** Free platform
- **24/7** AI recommendations
- **0** Ads or paywalls (during beta)

---

## 🎓 For Students

This platform is designed specifically for:
- College students preparing for placements
- Coding interview preparation
- Building consistent coding habits
- Skill improvement tracking
- Confidence building

**Perfect for:**
- CSE/IT/ECE students
- Self-taught developers
- Career switchers
- Competitive programmers

---

## 💼 For Companies

**Coming Soon:**
- Candidate screening tools
- Bulk hiring solutions
- Custom problem sets
- Analytics dashboards
- Integration with ATS

---

## 🌟 Star Us!

If you find this project helpful, please give it a star ⭐ on GitHub!

---

## 📄 Changelog

### v1.0.0 (January 2024)
- ✅ Initial release
- ✅ Homepage with hero section
- ✅ Daily task recommendations
- ✅ Streak tracking
- ✅ Performance analytics
- ✅ Multi-platform support
- ✅ User authentication
- ✅ API endpoints

---

## 🙏 Acknowledgments

Special thanks to:
- The open-source community
- LeetCode, HackerRank, and CodeChef for APIs
- All beta testers and early adopters
- Contributors and supporters

---

<div align="center">

**Built with ❤️ for students, by students**

[⬆ back to top](#ai-placement-mentor)

</div>
