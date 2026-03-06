// AI Placement Mentor - Frontend API Integration
// This file demonstrates how to connect the frontend to the backend API

const API_BASE_URL = 'http://localhost:5000/api';

// API Client Class
class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set JWT token for authenticated requests
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove token (logout)
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    this.removeToken();
  }

  // Task Methods
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tasks?${queryString}`);
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async completeTask(taskId, solution = {}) {
    return this.request(`/tasks/${taskId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ solution })
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  async getTaskStats() {
    return this.request('/tasks/stats/overview');
  }

  // User Methods
  async getUserStats() {
    return this.request('/users/stats');
  }

  async getLeaderboard(limit = 10) {
    return this.request(`/users/leaderboard?limit=${limit}`);
  }

  async updatePreferences(preferences) {
    return this.request('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // Aptitude Methods
  async getDailyAptitude() {
    return this.request('/aptitude/daily');
  }

  async submitAptitudeAnswer(questionId, answer) {
    return this.request('/aptitude/submit', {
      method: 'POST',
      body: JSON.stringify({ questionId, answer })
    });
  }

  async getAptitudeStreak() {
    return this.request('/aptitude/streak');
  }
  async getPlatforms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/platforms?${queryString}`);
  }

  async getPlatform(platformId) {
    return this.request(`/platforms/${platformId}`);
  }

  async connectPlatform(platformId, connectionData) {
    return this.request(`/platforms/${platformId}/connect`, {
      method: 'PUT',
      body: JSON.stringify(connectionData)
    });
  }

  async disconnectPlatform(platformId) {
    return this.request(`/platforms/${platformId}/disconnect`, {
      method: 'PUT'
    });
  }

  async getUserPlatformConnections() {
    return this.request('/platforms/user/connections');
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

// Global API instance
const api = new APIService();

// Example usage functions (for testing/integration)

// Test API connection
async function testAPIConnection() {
  try {
    const health = await api.healthCheck();
    console.log('✅ API Connection Successful:', health);
    return true;
  } catch (error) {
    console.error('❌ API Connection Failed:', error.message);
    return false;
  }
}

// Example: User registration
async function registerUser(username, email, password, firstName = '', lastName = '') {
  try {
    const response = await api.register({
      username,
      email,
      password,
      firstName,
      lastName
    });
    console.log('✅ User registered:', response.user);
    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
}

// Example: User login
async function loginUser(email, password) {
  try {
    const response = await api.login({ email, password });
    console.log('✅ User logged in:', response.user);
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
}

// Example: Get user tasks
async function getUserTasks(status = '', page = 1, limit = 10) {
  try {
    const response = await api.getTasks({ status, page, limit });
    console.log('✅ Tasks retrieved:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Failed to get tasks:', error.message);
    throw error;
  }
}

// Example: Create a new task
async function createNewTask(taskData) {
  try {
    const response = await api.createTask(taskData);
    console.log('✅ Task created:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Failed to create task:', error.message);
    throw error;
  }
}

// Example: Get platforms
async function getAvailablePlatforms() {
  try {
    const response = await api.getPlatforms();
    console.log('✅ Platforms retrieved:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Failed to get platforms:', error.message);
    throw error;
  }
}

// Example: Get leaderboard
async function getLeaderboard(limit = 10) {
  try {
    const response = await api.getLeaderboard(limit);
    console.log('✅ Leaderboard retrieved:', response.leaderboard);
    return response;
  } catch (error) {
    console.error('❌ Failed to get leaderboard:', error.message);
    throw error;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIService, api };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
  window.APIService = APIService;
  window.api = api;
  window.testAPIConnection = testAPIConnection;
  window.registerUser = registerUser;
  window.loginUser = loginUser;
  window.getUserTasks = getUserTasks;
  window.createNewTask = createNewTask;
  window.getAvailablePlatforms = getAvailablePlatforms;
  window.getLeaderboard = getLeaderboard;
}