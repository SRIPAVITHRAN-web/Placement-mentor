const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Aptitude questions pool (same as frontend for consistency)
const aptitudeQuestions = [
    {
        id: 1,
        question: "If a train travels at 60 km/h, how long will it take to cover 180 km?",
        options: ["2 hours", "3 hours", "4 hours", "5 hours"],
        correct: 1,
        explanation: "Time = Distance/Speed = 180 km / 60 km/h = 3 hours"
    },
    {
        id: 2,
        question: "What is 25% of 400?",
        options: ["100", "150", "200", "250"],
        correct: 0,
        explanation: "25% of 400 = (25/100) × 400 = 0.25 × 400 = 100"
    },
    {
        id: 3,
        question: "If 3 apples cost $6, how much do 7 apples cost?",
        options: ["$12", "$14", "$16", "$18"],
        correct: 1,
        explanation: "Cost of 1 apple = $6/3 = $2. Cost of 7 apples = 7 × $2 = $14"
    },
    {
        id: 4,
        question: "A shopkeeper buys a item for $80 and sells it for $100. What is the profit percentage?",
        options: ["20%", "25%", "30%", "35%"],
        correct: 1,
        explanation: "Profit = Selling Price - Cost Price = $100 - $80 = $20. Profit % = (20/80) × 100 = 25%"
    },
    {
        id: 5,
        question: "If the ratio of boys to girls in a class is 3:2 and there are 25 students, how many boys are there?",
        options: ["10", "12", "15", "18"],
        correct: 2,
        explanation: "Total parts = 3 + 2 = 5. Boys = (3/5) × 25 = 15"
    },
    {
        id: 6,
        question: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        options: ["24", "32", "28", "30"],
        correct: 1,
        explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
    },
    {
        id: 7,
        question: "If a man can complete a work in 10 days, how many men are needed to complete it in 2 days?",
        options: ["4", "5", "6", "8"],
        correct: 1,
        explanation: "Work done by 1 man in 1 day = 1/10. For 2 days: 5 men needed (1/10 × 2 × men = 1, so men = 5)"
    },
    {
        id: 8,
        question: "What is the area of a square with side 12 cm?",
        options: ["24 cm²", "48 cm²", "144 cm²", "288 cm²"],
        correct: 2,
        explanation: "Area of square = side² = 12² = 144 cm²"
    },
    {
        id: 9,
        question: "If A is 20% more than B, what percentage is B less than A?",
        options: ["16.67%", "20%", "25%", "30%"],
        correct: 0,
        explanation: "If B = 100, A = 120. B is less than A by (20/120)×100 = 16.67%"
    },
    {
        id: 10,
        question: "A car travels 240 km in 4 hours. What is its average speed?",
        options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"],
        correct: 2,
        explanation: "Average speed = Total distance / Total time = 240 km / 4 hours = 60 km/h"
    }
];

// @route   GET /api/aptitude/daily
// @desc    Get today's aptitude question
// @access  Private
router.get('/daily', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const questionIndex = dayOfYear % aptitudeQuestions.length;
    const question = aptitudeQuestions[questionIndex];

    // Check if user has completed today's question
    const user = await User.findById(req.user.id);
    const hasCompletedToday = user.stats.lastAptitudeDate === today;

    res.json({
      success: true,
      question: {
        id: question.id,
        question: question.question,
        options: question.options,
        date: today
      },
      completed: hasCompletedToday,
      streak: user.stats.aptitudeStreak || 0
    });

  } catch (error) {
    console.error('Get daily aptitude error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/aptitude/submit
// @desc    Submit aptitude answer and update streak
// @access  Private
router.post('/submit', [
  body('questionId')
    .isInt({ min: 1 })
    .withMessage('Valid question ID is required'),
  body('answer')
    .isInt({ min: 0, max: 3 })
    .withMessage('Valid answer index is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { questionId, answer } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Find the question
    const question = aptitudeQuestions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const user = await User.findById(req.user.id);
    const hasCompletedToday = user.stats.lastAptitudeDate === today;

    if (hasCompletedToday) {
      return res.status(400).json({
        success: false,
        message: 'Question already completed today'
      });
    }

    const isCorrect = answer === question.correct;

    if (isCorrect) {
      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (user.stats.lastAptitudeDate === yesterdayStr) {
        user.stats.aptitudeStreak = (user.stats.aptitudeStreak || 0) + 1;
      } else {
        user.stats.aptitudeStreak = 1;
      }

      user.stats.lastAptitudeDate = today;
      user.stats.totalTasksCompleted += 1;
      user.stats.totalPoints += 5; // 5 points for aptitude questions

      await user.save();

      res.json({
        success: true,
        correct: true,
        explanation: question.explanation,
        streak: user.stats.aptitudeStreak,
        points: 5
      });
    } else {
      res.json({
        success: true,
        correct: false,
        correctAnswer: question.correct,
        explanation: question.explanation
      });
    }

  } catch (error) {
    console.error('Submit aptitude answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/aptitude/streak
// @desc    Get user's aptitude streak information
// @access  Private
router.get('/streak', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      streak: {
        currentStreak: user.stats.aptitudeStreak || 0,
        longestStreak: user.stats.longestStreak || 0,
        lastCompletedDate: user.stats.lastAptitudeDate
      }
    });

  } catch (error) {
    console.error('Get aptitude streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;