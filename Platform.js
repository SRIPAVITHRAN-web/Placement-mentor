const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Platform name is required'],
    unique: true,
    trim: true,
    enum: ['LeetCode', 'CodeChef', 'HackerRank', 'CodeForces', 'AtCoder', 'GeeksforGeeks', 'InterviewBit', 'SPOJ', 'UVa', 'TopCoder', 'Other']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  website: {
    type: String,
    required: [true, 'Website URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  logo: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  categories: [{
    type: String,
    enum: ['Competitive Programming', 'Interview Preparation', 'Learning', 'Contest Platform', 'Practice Platform']
  }],
  features: [{
    name: { type: String, required: true },
    description: { type: String },
    available: { type: Boolean, default: true }
  }],
  difficultyDistribution: {
    easy: { type: Number, default: 0, min: 0, max: 100 },
    medium: { type: Number, default: 0, min: 0, max: 100 },
    hard: { type: Number, default: 0, min: 0, max: 100 }
  },
  stats: {
    totalProblems: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  apiInfo: {
    hasApi: { type: Boolean, default: false },
    apiDocs: { type: String, trim: true },
    rateLimit: { type: String },
    authentication: { type: String, enum: ['None', 'API Key', 'OAuth', 'Username/Password'] }
  },
  supportedLanguages: [{
    type: String,
    enum: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'C#', 'TypeScript', 'Scala', 'Other']
  }],
  popularity: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
platformSchema.index({ name: 1 });
platformSchema.index({ categories: 1 });
platformSchema.index({ popularity: -1 });
platformSchema.index({ isActive: 1 });

// Pre-save middleware to update updatedAt
platformSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for total difficulty percentage
platformSchema.virtual('totalDifficultyPercentage').get(function() {
  return this.difficultyDistribution.easy + this.difficultyDistribution.medium + this.difficultyDistribution.hard;
});

// Method to update stats
platformSchema.methods.updateStats = function(newStats) {
  this.stats = { ...this.stats, ...newStats, lastUpdated: new Date() };
  return this.save();
};

// Static method to get active platforms
platformSchema.statics.getActivePlatforms = function() {
  return this.find({ isActive: true }).sort({ popularity: -1 });
};

// Static method to get platforms by category
platformSchema.statics.getPlatformsByCategory = function(category) {
  return this.find({
    categories: category,
    isActive: true
  }).sort({ popularity: -1 });
};

// Static method to initialize default platforms
platformSchema.statics.initializeDefaultPlatforms = async function() {
  const defaultPlatforms = [
    {
      name: 'LeetCode',
      displayName: 'LeetCode',
      description: 'Technical interview preparation with thousands of coding problems',
      website: 'https://leetcode.com',
      logo: 'https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo-dark.e99485d9b.svg',
      categories: ['Interview Preparation', 'Competitive Programming'],
      features: [
        { name: 'Problem Sets', description: 'Curated problem collections' },
        { name: 'Contests', description: 'Weekly and bi-weekly contests' },
        { name: 'Mock Interviews', description: 'Interview simulation' }
      ],
      difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
      stats: { totalProblems: 2500, activeUsers: 2000000 },
      apiInfo: { hasApi: false },
      supportedLanguages: ['C++', 'Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust', 'Kotlin'],
      popularity: 95
    },
    {
      name: 'CodeChef',
      displayName: 'CodeChef',
      description: 'Programming competition platform with monthly contests',
      website: 'https://codechef.com',
      logo: 'https://cdn.codechef.com/images/cc-logo.svg',
      categories: ['Competitive Programming', 'Contest Platform'],
      features: [
        { name: 'Monthly Contests', description: 'Long contests every month' },
        { name: 'Cook-off', description: 'Short contests every 2 weeks' },
        { name: 'LunchTime', description: 'Educational contests' }
      ],
      difficultyDistribution: { easy: 25, medium: 45, hard: 30 },
      stats: { totalProblems: 3000, activeUsers: 800000 },
      apiInfo: { hasApi: true, apiDocs: 'https://www.codechef.com/api' },
      supportedLanguages: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust'],
      popularity: 85
    },
    {
      name: 'HackerRank',
      displayName: 'HackerRank',
      description: 'Coding challenges and skill assessments platform',
      website: 'https://hackerrank.com',
      logo: 'https://hrcdn.net/fcore/assets/brand/h_mark_sm-966d2b7cb0.png',
      categories: ['Interview Preparation', 'Skill Assessment'],
      features: [
        { name: 'Skill Certifications', description: 'Industry-recognized certifications' },
        { name: 'Company Challenges', description: 'Custom coding challenges' },
        { name: 'Practice Domains', description: 'Topic-wise practice' }
      ],
      difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
      stats: { totalProblems: 1500, activeUsers: 1500000 },
      apiInfo: { hasApi: true, apiDocs: 'https://www.hackerrank.com/api/docs' },
      supportedLanguages: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Ruby', 'Swift'],
      popularity: 90
    },
    {
      name: 'CodeForces',
      displayName: 'CodeForces',
      description: 'Competitive programming platform with regular contests',
      website: 'https://codeforces.com',
      logo: 'https://codeforces.org/s/0/favicon-32x32.png',
      categories: ['Competitive Programming', 'Contest Platform'],
      features: [
        { name: 'Regular Contests', description: 'Multiple contests per week' },
        { name: 'Rating System', description: 'Elo-based rating system' },
        { name: 'Educational Rounds', description: 'Learning-focused contests' }
      ],
      difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
      stats: { totalProblems: 8000, activeUsers: 1000000 },
      apiInfo: { hasApi: true, apiDocs: 'https://codeforces.com/apiHelp' },
      supportedLanguages: ['C++', 'Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust'],
      popularity: 88
    }
  ];

  for (const platform of defaultPlatforms) {
    await this.findOneAndUpdate(
      { name: platform.name },
      platform,
      { upsert: true, new: true }
    );
  }
};

// Ensure virtual fields are serialized
platformSchema.set('toJSON', { virtuals: true });
platformSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Platform', platformSchema);