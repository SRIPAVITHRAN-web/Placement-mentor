const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get current user profile (alternative to /api/auth/me)
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        stats: user.stats,
        preferences: user.preferences,
        platforms: user.platforms,
        achievements: user.achievements,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate additional stats
    const totalPlatformsConnected = user.platforms.filter(p => p.isConnected).length;
    const totalSolvedProblems = user.platforms.reduce((sum, p) => sum + p.solvedCount, 0);

    const stats = {
      ...user.stats,
      totalPlatformsConnected,
      totalSolvedProblems,
      accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)), // days
      lastActive: user.lastLogin
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const { theme, notifications, difficulty } = req.body;

    const allowedPreferences = {};
    if (theme !== undefined) allowedPreferences['preferences.theme'] = theme;
    if (notifications !== undefined) allowedPreferences['preferences.notifications'] = notifications;
    if (difficulty !== undefined) allowedPreferences['preferences.difficulty'] = difficulty;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      allowedPreferences,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('achievements stats');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      achievements: user.achievements,
      stats: user.stats
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard (top users by points)
// @access  Private
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await User.find({ isActive: true })
      .select('username profile.firstName profile.lastName stats.totalPoints stats.level stats.totalTasksCompleted')
      .sort({ 'stats.totalPoints': -1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      name: user.profile.firstName && user.profile.lastName
        ? `${user.profile.firstName} ${user.profile.lastName}`
        : user.username,
      totalPoints: user.stats.totalPoints,
      level: user.stats.level,
      totalTasksCompleted: user.stats.totalTasksCompleted
    }));

    res.json({
      success: true,
      leaderboard: rankedLeaderboard
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by username (for mentions, etc.)
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await User.find({
      isActive: true,
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.firstName': { $regex: q, $options: 'i' } },
        { 'profile.lastName': { $regex: q, $options: 'i' } }
      ]
    })
    .select('username profile.firstName profile.lastName')
    .limit(parseInt(limit));

    const userResults = users.map(user => ({
      id: user._id,
      username: user.username,
      name: user.profile.firstName && user.profile.lastName
        ? `${user.profile.firstName} ${user.profile.lastName}`
        : user.username
    }));

    res.json({
      success: true,
      users: userResults
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;