const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, platform, difficulty, category, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { assignedTo: req.user.id, isActive: true };

    if (status) query.status = status;
    if (platform) query.platform = platform;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username profile.firstName profile.lastName');

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
      isActive: true
    }).populate('createdBy', 'username profile.firstName profile.lastName');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('platform')
    .isIn(['LeetCode', 'CodeChef', 'HackerRank', 'CodeForces', 'AtCoder', 'GeeksforGeeks', 'InterviewBit', 'Other'])
    .withMessage('Invalid platform'),
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('category')
    .isIn(['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Math', 'Bit Manipulation', 'Other'])
    .withMessage('Invalid category'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Time limit must be between 1 and 480 minutes'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const taskData = {
      ...req.body,
      assignedTo: req.user.id,
      createdBy: req.user.id
    };

    const task = await Task.create(taskData);

    await task.populate('createdBy', 'username profile.firstName profile.lastName');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('platform')
    .optional()
    .isIn(['LeetCode', 'CodeChef', 'HackerRank', 'CodeForces', 'AtCoder', 'GeeksforGeeks', 'InterviewBit', 'Other'])
    .withMessage('Invalid platform'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('category')
    .optional()
    .isIn(['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Math', 'Bit Manipulation', 'Other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'failed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),
  body('timeLimit')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Time limit must be between 1 and 480 minutes'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline format')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
      isActive: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        task[key] = req.body[key];
      }
    });

    await task.save();
    await task.populate('createdBy', 'username profile.firstName profile.lastName');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id/complete
// @desc    Mark task as completed
// @access  Private
router.put('/:id/complete', [
  body('solution.code')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Solution code cannot exceed 10000 characters'),
  body('solution.language')
    .optional()
    .isIn(['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Other'])
    .withMessage('Invalid programming language'),
  body('solution.timeComplexity')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Time complexity description too long'),
  body('solution.spaceComplexity')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Space complexity description too long'),
  body('solution.notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Solution notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
      isActive: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Task is already completed'
      });
    }

    // Mark as completed
    await task.markCompleted(req.body.solution);

    // Update user stats
    await req.user.updateStats(true);

    res.json({
      success: true,
      message: 'Task marked as completed',
      data: task
    });

  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/tasks/:id/unlock-hint
// @desc    Unlock a hint for a task
// @access  Private
router.put('/:id/unlock-hint/:hintIndex', async (req, res) => {
  try {
    const { hintIndex } = req.params;

    if (isNaN(hintIndex) || hintIndex < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hint index'
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
      isActive: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!task.hints[hintIndex]) {
      return res.status(400).json({
        success: false,
        message: 'Hint not found'
      });
    }

    if (task.hints[hintIndex].unlockedAt) {
      return res.status(400).json({
        success: false,
        message: 'Hint already unlocked'
      });
    }

    await task.unlockHint(parseInt(hintIndex));

    res.json({
      success: true,
      message: 'Hint unlocked successfully',
      hint: task.hints[hintIndex]
    });

  } catch (error) {
    console.error('Unlock hint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
      isActive: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Soft delete
    task.isActive = false;
    await task.save();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/tasks/stats/overview
// @desc    Get task statistics overview
// @access  Private
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Task.aggregate([
      { $match: { assignedTo: userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          failedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'completed'] },
                    { $lt: ['$deadline', new Date()] },
                    { $ne: ['$deadline', null] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const taskStats = stats[0] || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      failedTasks: 0,
      overdueTasks: 0
    };

    // Calculate completion rate
    taskStats.completionRate = taskStats.totalTasks > 0
      ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
      : 0;

    res.json({
      success: true,
      data: taskStats
    });

  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;