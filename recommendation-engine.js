// Task Recommendation Algorithm for AI Placement Mentor

/**
 * AI-Powered Task Recommendation Engine
 * Analyzes user performance and recommends personalized daily tasks
 */

class RecommendationEngine {
    
    /**
     * Generate daily tasks for a user based on their performance
     * @param {Object} user - User object with performance metrics
     * @param {Array} allTasks - All available tasks
     * @returns {Array} - Recommended tasks for the day
     */
    static generateDailyTasks(user, allTasks) {
        const recommendations = [];
        const dailyTaskCount = 3; // 3 tasks per day
        
        // Categorize tasks
        const easyTasks = allTasks.filter(t => t.difficulty === 'Easy');
        const mediumTasks = allTasks.filter(t => t.difficulty === 'Medium');
        const hardTasks = allTasks.filter(t => t.difficulty === 'Hard');
        
        // Determine task distribution based on user accuracy
        if (user.accuracy < 60) {
            // Low accuracy: more easy + medium tasks
            recommendations.push(...this.selectRandomTasks(easyTasks, 1, user.weakAreas));
            recommendations.push(...this.selectRandomTasks(mediumTasks, 1, user.weakAreas));
            recommendations.push(...this.selectRandomTasks(easyTasks, 1, user.weakAreas));
        } else if (user.accuracy < 80) {
            // Medium accuracy: balanced distribution
            recommendations.push(...this.selectRandomTasks(easyTasks, 1, user.weakAreas));
            recommendations.push(...this.selectRandomTasks(mediumTasks, 2, user.weakAreas));
        } else {
            // High accuracy: more challenging tasks
            recommendations.push(...this.selectRandomTasks(mediumTasks, 1, user.weakAreas));
            recommendations.push(...this.selectRandomTasks(hardTasks, 1, user.strongAreas)); // Reinforce strength
            recommendations.push(...this.selectRandomTasks(mediumTasks, 1, user.weakAreas));
        }
        
        return recommendations.slice(0, dailyTaskCount);
    }
    
    /**
     * Select random tasks from a category, prioritizing weak areas
     * @param {Array} tasks - Tasks to select from
     * @param {Number} count - Number of tasks to select
     * @param {Array} priority - Priority categories (weak areas)
     * @returns {Array} - Selected tasks
     */
    static selectRandomTasks(tasks, count, priority = []) {
        let selected = [];
        
        // First, get tasks from priority categories
        const priorityTasks = tasks.filter(t => priority.includes(t.category));
        const otherTasks = tasks.filter(t => !priority.includes(t.category));
        
        const priorityCount = Math.min(Math.ceil(count / 2), priorityTasks.length);
        const otherCount = count - priorityCount;
        
        selected.push(...this.shuffleArray(priorityTasks).slice(0, priorityCount));
        selected.push(...this.shuffleArray(otherTasks).slice(0, otherCount));
        
        return selected;
    }
    
    /**
     * Calculate user readiness for placement interviews
     * @param {Object} user - User performance data
     * @returns {Number} - Readiness percentage (0-100)
     */
    static calculateReadiness(user) {
        const weights = {
            accuracy: 0.3,
            problemsAttempted: 0.2,
            streak: 0.2,
            categoryCompletion: 0.15,
            timeSpent: 0.15
        };
        
        const accuracyScore = user.accuracy || 0;
        const problemsScore = Math.min(user.totalProblemsAttempted / 150, 100); // Target: 150 problems
        const streakScore = Math.min(user.streak / 30, 100); // Target: 30 day streak
        const categoryScore = this.calculateCategoryCompletion(user);
        const timeScore = Math.min(user.totalTimeSpent / 10800, 100); // Target: 180 hours
        
        const readiness = 
            accuracyScore * weights.accuracy +
            problemsScore * weights.problemsAttempted +
            streakScore * weights.streak +
            categoryScore * weights.categoryCompletion +
            timeScore * weights.timeSpent;
        
        return Math.min(readiness, 100);
    }
    
    /**
     * Calculate percentage of categories completed
     * @param {Object} user - User data
     * @returns {Number} - Completion percentage (0-100)
     */
    static calculateCategoryCompletion(user) {
        const categories = [
            'Arrays', 'Strings', 'Trees', 'Graphs', 'DP',
            'Sorting', 'Searching', 'Hashing', 'LinkedList',
            'Stacks', 'Queues', 'Greedy', 'BIT', 'Math'
        ];
        
        // In real implementation, count solved problems per category
        const completedCategories = user.strongAreas?.length || 0;
        return (completedCategories / categories.length) * 100;
    }
    
    /**
     * Identify weak areas for focused training
     * @param {Array} performanceData - User's problem-solving history
     * @returns {Array} - Weak areas ranked by priority
     */
    static identifyWeakAreas(performanceData) {
        const categoryStats = {};
        
        performanceData.forEach(attempt => {
            if (!categoryStats[attempt.category]) {
                categoryStats[attempt.category] = {
                    attempted: 0,
                    solved: 0,
                    accuracy: 0
                };
            }
            categoryStats[attempt.category].attempted++;
            if (attempt.isSolved) {
                categoryStats[attempt.category].solved++;
            }
        });
        
        // Calculate accuracy per category and sort by weakness
        const weaknessRanking = Object.entries(categoryStats)
            .map(([category, stats]) => ({
                category,
                accuracy: (stats.solved / stats.attempted) * 100,
                attempted: stats.attempted
            }))
            .filter(item => item.attempted >= 3) // Only consider if 3+ attempts
            .sort((a, b) => a.accuracy - b.accuracy);
        
        return weaknessRanking.map(item => item.category);
    }
    
    /**
     * Recommend next problem based on learning curve
     * @param {Object} user - User data
     * @param {Array} allTasks - All available tasks
     * @returns {Object} - Recommended task
     */
    static recommendNextProblem(user, allTasks) {
        const userLevel = this.getUserLevel(user);
        const weakAreas = this.identifyWeakAreas(user.performanceHistory || []);
        
        // Filter tasks appropriate for user level and weak areas
        let candidates = allTasks.filter(task => {
            const difficultyMatch = this.isDifficultyAppropriate(task.difficulty, userLevel);
            const categoryMatch = weakAreas.includes(task.category);
            return difficultyMatch && categoryMatch;
        });
        
        // If no candidates found, expand search
        if (candidates.length === 0) {
            candidates = allTasks.filter(task => 
                this.isDifficultyAppropriate(task.difficulty, userLevel)
            );
        }
        
        return candidates.length > 0 
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : null;
    }
    
    /**
     * Determine user's skill level
     * @param {Object} user - User data
     * @returns {String} - 'Beginner', 'Intermediate', 'Advanced'
     */
    static getUserLevel(user) {
        if (user.accuracy < 50 || user.totalProblemsAttempted < 20) {
            return 'Beginner';
        } else if (user.accuracy < 75 || user.totalProblemsAttempted < 75) {
            return 'Intermediate';
        } else {
            return 'Advanced';
        }
    }
    
    /**
     * Check if task difficulty is appropriate for user
     * @param {String} difficulty - Task difficulty
     * @param {String} userLevel - User's skill level
     * @returns {Boolean}
     */
    static isDifficultyAppropriate(difficulty, userLevel) {
        const mapping = {
            'Beginner': ['Easy', 'Medium'],
            'Intermediate': ['Medium', 'Hard'],
            'Advanced': ['Hard']
        };
        return mapping[userLevel]?.includes(difficulty) || false;
    }
    
    /**
     * Shuffle array randomly
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array
     */
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * Generate performance insights and tips
     * @param {Object} user - User data
     * @returns {Object} - Insights and recommendations
     */
    static generateInsights(user) {
        const readiness = this.calculateReadiness(user);
        const weakAreas = this.identifyWeakAreas(user.performanceHistory || []);
        
        return {
            placementReadiness: readiness,
            readinessLevel: readiness > 80 ? 'Excellent' : readiness > 60 ? 'Good' : 'Needs Improvement',
            weakAreas: weakAreas.slice(0, 3),
            recommendations: [
                ...(readiness < 60 ? [`Focus on weak areas: ${weakAreas[0] || 'Arrays'}`] : []),
                ...(user.streak < 7 ? ['Build your streak - consistency is key!'] : []),
                ...(user.totalProblemsAttempted < 50 ? ['Increase problem count - aim for 50+ this month'] : []),
                ...(user.accuracy < 75 ? ['Improve accuracy - review failed problems'] : [])
            ],
            nextMilestone: readiness > 80 ? 'Interview Ready!' : `${Math.round(readiness)}% to Interview Ready`
        };
    }
}

export default RecommendationEngine;
