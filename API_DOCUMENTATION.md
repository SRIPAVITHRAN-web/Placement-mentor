# AI Placement Mentor - API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "fullName": "John Doe",
  "college": "IIT Delhi",
  "year": "3rd Year"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Login User
**POST** `/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

## User Profile Endpoints

### 1. Get User Profile
**GET** `/user`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "1234567890",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "college": "IIT Delhi",
  "year": "3rd Year",
  "avatar": "https://...",
  "streak": 12,
  "totalProblemsAttempted": 120,
  "totalProblemsSolved": 85,
  "accuracy": 87,
  "weeklyTimeSpent": 420,
  "totalTimeSpent": 5400,
  "weakAreas": ["Dynamic Programming", "Graphs"],
  "strongAreas": ["Arrays", "Strings"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Update User Profile
**PUT** `/user`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "weakAreas": ["DP", "Graphs"],
  "preferredDifficulty": "Medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ...updated user data... }
}
```

---

## Task Endpoints

### 1. Get Daily Tasks (AI-Generated)
**GET** `/tasks?date=2024-01-20`

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
- `date` (optional): YYYY-MM-DD format. Defaults to today

**Response:**
```json
{
  "success": true,
  "date": "2024-01-20",
  "tasks": [
    {
      "id": "task_001",
      "title": "Two Sum Array",
      "description": "Find two numbers that add up to target",
      "platform": "LeetCode",
      "difficulty": "Medium",
      "category": "Arrays & Hashing",
      "timeEstimate": 30,
      "externalUrl": "https://leetcode.com/problems/two-sum/",
      "reason": "Practicing weak area - Arrays",
      "priority": "High"
    },
    {
      "id": "task_002",
      "title": "Tree Traversal Basics",
      "description": "Master tree traversal techniques",
      "platform": "HackerRank",
      "difficulty": "Easy",
      "category": "Trees & Graphs",
      "timeEstimate": 20,
      "externalUrl": "https://www.hackerrank.com/challenges/...",
      "reason": "Warm-up exercise",
      "priority": "Medium"
    },
    {
      "id": "task_003",
      "title": "DP Challenge",
      "description": "Advanced DP problem",
      "platform": "CodeChef",
      "difficulty": "Hard",
      "category": "Dynamic Programming",
      "timeEstimate": 60,
      "externalUrl": "https://www.codechef.com/...",
      "reason": "Strengthen strong areas",
      "priority": "Low"
    }
  ],
  "totalTimeTarget": 110,
  "dailyGoalMinutes": 45
}
```

### 2. Get All Available Tasks
**GET** `/tasks/all`

**Parameters:**
- `difficulty`: Easy, Medium, Hard (optional)
- `platform`: LeetCode, HackerRank, etc. (optional)
- `category`: Arrays, DP, etc. (optional)
- `page`: Pagination (optional)

**Response:**
```json
{
  "success": true,
  "total": 500,
  "page": 1,
  "limit": 20,
  "tasks": [ ...array of tasks... ]
}
```

### 3. Get Task Details
**GET** `/tasks/:taskId`

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "task_001",
    "title": "Two Sum Array",
    "difficulty": "Medium",
    "category": "Arrays",
    "platform": "LeetCode",
    "description": "...",
    "examples": [ ... ],
    "constraints": [ ... ],
    "acceptanceRate": 47,
    "likes": 1250,
    "dislikes": 120,
    "editorial": "https://..."
  }
}
```

---

## Task Progress Endpoints

### 1. Submit Task Progress
**POST** `/task-progress`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "taskId": "task_001",
  "status": "Completed",
  "isSolved": true,
  "timeSpent": 35,
  "submissionCode": "// Python code...",
  "rating": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task progress updated",
  "progress": {
    "userId": "user_001",
    "taskId": "task_001",
    "status": "Completed",
    "attempts": 2,
    "timeSpent": 35,
    "isSolved": true,
    "completedAt": "2024-01-20T14:30:00Z"
  }
}
```

### 2. Get Task Progress
**GET** `/task-progress/:taskId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "taskId": "task_001",
    "status": "Completed",
    "attempts": 2,
    "hints": 1,
    "timeSpent": 35,
    "isSolved": true,
    "rating": 4,
    "completedAt": "2024-01-20T14:30:00Z"
  }
}
```

---

## Progress & Analytics Endpoints

### 1. Get User Progress Summary
**GET** `/progress`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "streak": 12,
    "weeklyGoalMinutes": 300,
    "weeklyTimeSpent": 420,
    "weeklyGoalProgress": 140,
    "tasksCompleted": 18,
    "tasksTotal": 21,
    "completionRate": 85,
    "accuracy": 87,
    "problemsSolved": 85,
    "problemsAttempted": 120
  }
}
```

### 2. Get Weekly Analytics
**GET** `/analytics/weekly`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "week": "2024-01-15 to 2024-01-21",
  "dailyBreakdown": [
    {
      "date": "2024-01-15",
      "problemsSolved": 2,
      "timeSpent": 45,
      "accuracy": 100,
      "tasksCompleted": 2
    },
    // ... 6 more days
  ],
  "weeklyStats": {
    "totalProblems": 15,
    "totalTime": 420,
    "averageAccuracy": 87,
    "bestDay": "2024-01-17",
    "streak": 12
  }
}
```

### 3. Get Monthly Analytics
**GET** `/analytics/monthly`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "month": "January 2024",
  "stats": {
    "totalProblems": 60,
    "totalTime": 1800,
    "averageAccuracy": 85,
    "topDays": [ "2024-01-17", "2024-01-19" ]
  },
  "trend": [ 45, 52, 48, 58, ... ]
}
```

---

## Streak Endpoints

### 1. Get Streak Information
**GET** `/streak`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "streak": {
    "currentStreak": 12,
    "longestStreak": 25,
    "lastActiveDate": "2024-01-20",
    "totalActiveDays": 45,
    "streakPercentage": 82
  }
}
```

### 2. Get Streak Calendar
**GET** `/streak/calendar?month=2024-01`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "calendar": {
    "January 2024": {
      "1": 0,  // 0 = inactive, 1 = active
      "2": 1,
      "3": 1,
      // ... rest of days
    }
  }
}
```

---

## Recommendation Endpoints

### 1. Get AI Recommendations
**GET** `/recommendations`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "recommendations": {
    "placementReadiness": 78,
    "readinessLevel": "Good",
    "weakAreas": ["Dynamic Programming", "Graphs", "Greedy"],
    "nextRecommendations": [
      {
        "taskId": "task_045",
        "reason": "Focus on weak area - DP",
        "priority": "High"
      },
      // ... more recommendations
    ],
    "nextMilestone": "75% to Interview Ready",
    "tips": [
      "Increase problem count - aim for 100+ this month",
      "Review failed problems to improve accuracy",
      "Build your streak - consistency is key!"
    ]
  }
}
```

---

## Platform Endpoints

### 1. Get Supported Platforms
**GET** `/platforms`

**Response:**
```json
{
  "success": true,
  "platforms": [
    {
      "name": "LeetCode",
      "icon": "💎",
      "description": "1500+ DSA problems across difficulty levels",
      "url": "https://leetcode.com",
      "categories": ["Arrays", "Strings", "DP", ...],
      "problemCount": 2500
    },
    // ... more platforms
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized - Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting
- **Limit**: 100 requests per hour per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 75
  - `X-RateLimit-Reset`: 1705604400

---

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'

# Get Daily Tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_token>"
```

### Using Postman
1. Import the API collection
2. Set `{{base_url}}` to `http://localhost:3000/api`
3. Set `{{token}}` after login
4. Test all endpoints

---

## WebSocket Events (Real-time Updates)

```javascript
// Connect
const socket = io('http://localhost:3000');

// Events
socket.on('task-completed', (data) => {
  console.log('Task completed:', data);
});

socket.on('streak-milestone', (data) => {
  console.log('Streak milestone reached!', data);
});

socket.on('new-recommendation', (data) => {
  console.log('New recommendation:', data);
});
```

---

## Version History
- **v1.0** (Jan 2024): Initial API release
- **v1.1** (Feb 2024): Added WebSocket support
- **v2.0** (Coming Soon): Enhanced AI recommendations
