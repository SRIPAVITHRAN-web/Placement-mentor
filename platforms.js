const express = require('express');
const Platform = require('../models/Platform');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/platforms
// @desc    Get all active platforms
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;

    let query = { isActive: true };

    if (category) {
      query.categories = category;
    }

    const platforms = await Platform.find(query)
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: platforms
    });

  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/platforms/:id
// @desc    Get single platform
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const platform = await Platform.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!platform) {
      return res.status(404).json({
        success: false,
        message: 'Platform not found'
      });
    }

    res.json({
      success: true,
      data: platform
    });

  } catch (error) {
    console.error('Get platform error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/platforms/categories/list
// @desc    Get all unique platform categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Platform.distinct('categories', { isActive: true });

    res.json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/platforms/initialize
// @desc    Initialize default platforms (admin only)
// @access  Private (should be admin only in production)
router.post('/initialize', protect, async (req, res) => {
  try {
    await Platform.initializeDefaultPlatforms();

    res.json({
      success: true,
      message: 'Default platforms initialized successfully'
    });

  } catch (error) {
    console.error('Initialize platforms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/platforms/:id/connect
// @desc    Connect user to a platform
// @access  Private
router.put('/:id/connect', protect, async (req, res) => {
  try {
    const { username, solvedCount = 0, rating = 0 } = req.body;

    const platform = await Platform.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!platform) {
      return res.status(404).json({
        success: false,
        message: 'Platform not found'
      });
    }

    // Find existing platform connection or create new one
    let userPlatform = req.user.platforms.find(p => p.name === platform.name);

    if (userPlatform) {
      // Update existing connection
      userPlatform.username = username || userPlatform.username;
      userPlatform.solvedCount = solvedCount;
      userPlatform.rating = rating;
      userPlatform.isConnected = true;
    } else {
      // Add new platform connection
      req.user.platforms.push({
        name: platform.name,
        username: username,
        solvedCount: solvedCount,
        rating: rating,
        isConnected: true
      });
    }

    await req.user.save();

    res.json({
      success: true,
      message: `Successfully connected to ${platform.name}`,
      platform: req.user.platforms.find(p => p.name === platform.name)
    });

  } catch (error) {
    console.error('Connect platform error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/platforms/:id/disconnect
// @desc    Disconnect user from a platform
// @access  Private
router.put('/:id/disconnect', protect, async (req, res) => {
  try {
    const platform = await Platform.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!platform) {
      return res.status(404).json({
        success: false,
        message: 'Platform not found'
      });
    }

    // Find platform connection
    const platformIndex = req.user.platforms.findIndex(p => p.name === platform.name);

    if (platformIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Platform not connected'
      });
    }

    // Disconnect platform
    req.user.platforms[platformIndex].isConnected = false;
    req.user.platforms[platformIndex].username = '';
    req.user.platforms[platformIndex].solvedCount = 0;
    req.user.platforms[platformIndex].rating = 0;

    await req.user.save();

    res.json({
      success: true,
      message: `Successfully disconnected from ${platform.name}`
    });

  } catch (error) {
    console.error('Disconnect platform error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/platforms/user/connections
// @desc    Get user's platform connections
// @access  Private
router.get('/user/connections', protect, async (req, res) => {
  try {
    const connectedPlatforms = req.user.platforms.filter(p => p.isConnected);

    // Get platform details for connected platforms
    const platformDetails = await Platform.find({
      name: { $in: connectedPlatforms.map(p => p.name) },
      isActive: true
    });

    // Combine user platform data with platform details
    const enrichedConnections = connectedPlatforms.map(userPlatform => {
      const platformDetail = platformDetails.find(p => p.name === userPlatform.name);
      return {
        ...userPlatform.toObject(),
        platform: platformDetail
      };
    });

    res.json({
      success: true,
      data: enrichedConnections
    });

  } catch (error) {
    console.error('Get user connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/platforms/:id/sync
// @desc    Sync platform statistics (would integrate with platform APIs)
// @access  Private
router.put('/:id/sync', protect, async (req, res) => {
  try {
    const platform = await Platform.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!platform) {
      return res.status(404).json({
        success: false,
        message: 'Platform not found'
      });
    }

    // Find user's platform connection
    const userPlatform = req.user.platforms.find(p => p.name === platform.name && p.isConnected);

    if (!userPlatform) {
      return res.status(400).json({
        success: false,
        message: 'Platform not connected'
      });
    }

    // In a real implementation, this would call the platform's API
    // For now, we'll simulate a sync with mock data
    const mockSyncData = {
      solvedCount: userPlatform.solvedCount + Math.floor(Math.random() * 5),
      rating: userPlatform.rating + Math.floor(Math.random() * 50) - 25,
      lastSync: new Date()
    };

    // Update user platform data
    userPlatform.solvedCount = Math.max(0, mockSyncData.solvedCount);
    userPlatform.rating = Math.max(0, mockSyncData.rating);

    await req.user.save();

    res.json({
      success: true,
      message: 'Platform data synced successfully',
      data: {
        platform: platform.name,
        solvedCount: userPlatform.solvedCount,
        rating: userPlatform.rating,
        lastSync: mockSyncData.lastSync
      }
    });

  } catch (error) {
    console.error('Sync platform error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;