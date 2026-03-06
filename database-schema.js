// Database Schema Models for AI Placement Mentor

// User Model
const UserSchema = {
    _id: "ObjectId",
    username: {
        type: "String",
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: "String",
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: "String",
        required: true,
        minlength: 6
    },
    fullName: "String",
    avatar: "String",
    college: "String",
    year: "String",
    
    // Performance Metrics
    streak: {
        type: "Number",
        default: 0
    },
    lastActiveDate: "Date",
    totalProblemsAttempted: {
        type: "Number",
        default: 0
    },
    totalProblemsSolved: {
        type: "Number",
        default: 0
    },
    accuracy: {
        type: "Number",
        default: 0
    },
    
    // Time Tracking
    weeklyGoalMinutes: {
        type: "Number",
        default: 300 // 5 hours per week
    },
    dailyGoalMinutes: {
        type: "Number",
        default: 45
    },
    weeklyTimeSpent: {
        type: "Number",
        default: 0
    },
    totalTimeSpent: {
        type: "Number",
        default: 0
    },
    
    // Preferences
    platforms: ["String"], // ['LeetCode', 'HackerRank', 'CodeChef']
    weakAreas: ["String"], // ['Arrays', 'DP', 'Graphs']
    strongAreas: ["String"],
    preferredDifficulty: {
        type: "String",
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    
    // Account Status
    isActive: {
        type: "Boolean",
        default: true
    },
    emailVerified: {
        type: "Boolean",
        default: false
    },
    createdAt: {
        type: "Date",
        default: "Date.now"
    },
    updatedAt: {
        type: "Date",
        default: "Date.now"
    }
};

// Task Model
const TaskSchema = {
    _id: "ObjectId",
    title: {
        type: "String",
        required: true
    },
    description: "String",
    platform: {
        type: "String",
        enum: ["LeetCode", "HackerRank", "CodeChef", "GeeksforGeeks", "InterviewBit", "Codewars"],
        required: true
    },
    difficulty: {
        type: "String",
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    category: {
        type: "String",
        enum: ["Arrays", "Strings", "Trees", "Graphs", "DP", "Sorting", "Searching", "Hashing", "LinkedList", "Stacks", "Queues", "Greedy", "BIT", "Math"],
        required: true
    },
    timeEstimate: "Number", // in minutes
    difficulty_level: {
        type: "Number",
        min: 1,
        max: 10
    },
    externalUrl: "String",
    tags: ["String"],
    acceptanceRate: "Number",
    likes: {
        type: "Number",
        default: 0
    },
    createdAt: {
        type: "Date",
        default: "Date.now"
    }
};

// User Task Progress Model
const UserTaskProgressSchema = {
    _id: "ObjectId",
    userId: {
        type: "ObjectId",
        ref: "User",
        required: true
    },
    taskId: {
        type: "ObjectId",
        ref: "Task",
        required: true
    },
    status: {
        type: "String",
        enum: ["Not Started", "In Progress", "Completed", "Attempted"],
        default: "Not Started"
    },
    attempts: {
        type: "Number",
        default: 0
    },
    isSolved: {
        type: "Boolean",
        default: false
    },
    hintsUsed: {
        type: "Number",
        default: 0
    },
    timeSpent: "Number", // in minutes
    submissionCode: "String",
    feedback: "String",
    rating: {
        type: "Number",
        min: 1,
        max: 5
    },
    completedAt: "Date",
    createdAt: {
        type: "Date",
        default: "Date.now"
    },
    updatedAt: {
        type: "Date",
        default: "Date.now"
    }
};

// Daily Task Assignment Model
const DailyTaskSchema = {
    _id: "ObjectId",
    userId: {
        type: "ObjectId",
        ref: "User",
        required: true
    },
    date: {
        type: "Date",
        required: true
    },
    tasks: [
        {
            taskId: "ObjectId",
            estimatedTime: "Number",
            completed: {
                type: "Boolean",
                default: false
            }
        }
    ],
    totalTimeTarget: "Number",
    totalTimeSpent: {
        type: "Number",
        default: 0
    },
    completionPercentage: {
        type: "Number",
        default: 0
    },
    createdAt: {
        type: "Date",
        default: "Date.now"
    }
};

// Streak Model
const StreakSchema = {
    _id: "ObjectId",
    userId: {
        type: "ObjectId",
        ref: "User",
        required: true
    },
    currentStreak: {
        type: "Number",
        default: 0
    },
    longestStreak: {
        type: "Number",
        default: 0
    },
    lastActiveDate: "Date",
    streakStartDate: "Date",
    totalActiveDay: {
        type: "Number",
        default: 0
    },
    createdAt: {
        type: "Date",
        default: "Date.now"
    },
    updatedAt: {
        type: "Date",
        default: "Date.now"
    }
};

// Performance Analytics Model
const PerformanceAnalyticsSchema = {
    _id: "ObjectId",
    userId: {
        type: "ObjectId",
        ref: "User",
        required: true
    },
    date: {
        type: "Date",
        default: "Date.now"
    },
    problemsSolved: "Number",
    problemsAttempted: "Number",
    accuracy: "Number",
    timeSpent: "Number",
    categorywisePerformance: {
        category: "String",
        attempted: "Number",
        solved: "Number",
        accuracy: "Number"
    },
    platformPerformance: {
        platform: "String",
        attempted: "Number",
        solved: "Number",
        accuracy: "Number"
    },
    weeklyTrend: ["Number"], // 7 days data
    monthlyTrend: ["Number"] // 30 days data
};

// Recommendation Model
const RecommendationSchema = {
    _id: "ObjectId",
    userId: {
        type: "ObjectId",
        ref: "User",
        required: true
    },
    generatedAt: {
        type: "Date",
        default: "Date.now"
    },
    recommendedTasks: [
        {
            taskId: "ObjectId",
            reason: "String", // "Weak in Arrays", "Practice Medium", etc.
            priority: {
                type: "String",
                enum: ["High", "Medium", "Low"]
            },
            confidence: "Number" // 0-1
        }
    ],
    weakAreas: ["String"],
    strongAreas: ["String"],
    nextMilestone: "String",
    predictedReadiness: "Number" // 0-100%
};

export {
    UserSchema,
    TaskSchema,
    UserTaskProgressSchema,
    DailyTaskSchema,
    StreakSchema,
    PerformanceAnalyticsSchema,
    RecommendationSchema
};
