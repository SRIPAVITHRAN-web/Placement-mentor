const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['LeetCode', 'CodeChef', 'HackerRank', 'CodeForces', 'AtCoder', 'GeeksforGeeks', 'InterviewBit', 'Internal', 'Other']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Math', 'Bit Manipulation', 'Aptitude', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  problemUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  timeLimit: {
    type: Number, // in minutes
    default: 60,
    min: [1, 'Time limit must be at least 1 minute'],
    max: [480, 'Time limit cannot exceed 8 hours']
  },
  points: {
    type: Number,
    default: function() {
      const difficultyPoints = { 'Easy': 10, 'Medium': 20, 'Hard': 30 };
      return difficultyPoints[this.difficulty] || 20;
    },
    min: 1
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  completedAt: {
    type: Date
  },
  solution: {
    code: { type: String },
    language: { type: String, enum: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Other'] },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
    notes: { type: String, maxlength: 500 }
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  },
  hints: [{
    text: { type: String, required: true },
    order: { type: Number, default: 0 },
    unlockedAt: { type: Date }
  }],
  reminders: [{
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true },
    sent: { type: Boolean, default: false }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task creator is required']
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
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ platform: 1, difficulty: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for days until deadline
taskSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.deadline) return null;
  const now = new Date();
  const diffTime = this.deadline - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (!this.deadline || this.status === 'completed') return false;
  return new Date() > this.deadline;
});

// Method to mark as completed
taskSchema.methods.markCompleted = function(solution = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  if (solution.code) this.solution = { ...this.solution, ...solution };
  return this.save();
};

// Method to unlock hint
taskSchema.methods.unlockHint = function(hintIndex) {
  if (this.hints[hintIndex]) {
    this.hints[hintIndex].unlockedAt = new Date();
  }
  return this.save();
};

// Static method to get tasks by user and status
taskSchema.statics.getTasksByUser = function(userId, status = null) {
  const query = { assignedTo: userId, isActive: true };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = function() {
  return this.find({
    deadline: { $lt: new Date() },
    status: { $ne: 'completed' },
    isActive: true
  });
};

// Ensure virtual fields are serialized
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);