'use client';

import { useState, useEffect } from 'react';

export default function GitHubStatsForm() {
  const [stats, setStats] = useState({
    totalRepos: 47,
    publicRepos: 47,
    totalStars: 2,
    totalForks: 0,
    followers: 2,
    following: 4,
    contributionsThisYear: 850,
    contributionsLastWeek: 15,
    longestStreak: 45,
    currentStreak: 12,
    topLanguages: [
      { name: 'JavaScript', percentage: 45, color: '#f1e05a' },
      { name: 'TypeScript', percentage: 20, color: '#2b7489' },
      { name: 'HTML', percentage: 15, color: '#e34c26' },
      { name: 'CSS', percentage: 10, color: '#563d7c' },
      { name: 'Python', percentage: 5, color: '#3572A5' },
      { name: 'C++', percentage: 3, color: '#f34b7d' },
      { name: 'C', percentage: 2, color: '#555555' }
    ],
    projectsByCategory: {
      'Frontend Projects': 16,
      'Web Applications': 3,
      'Backend & APIs': 3,
      'Learning Projects': 3,
      'Tools & Utilities': 0,
      'Mobile Apps': 0,
      'Other': 22
    },
    recentActivity: [
      {
        type: 'commit',
        repo: 'portfolio',
        message: 'Add contact form with Nodemailer integration',
        date: '2025-08-21'
      },
      {
        type: 'repo',
        repo: 'portfolio',
        message: 'Created new repository',
        date: '2025-08-20'
      }
    ],
    featuredProjects: [
      'Job_Portal_Frontend',
      'PGC-DHA', 
      'Inkly',
      'MovieFlix',
      '3d_Portfolio'
    ],
    productivity: {
      commitsThisWeek: 15,
      issuesOpened: 0,
      pullRequests: 2,
      repositoriesContributedTo: 3,
      codeReviews: 1
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [newLanguage, setNewLanguage] = useState({ name: '', percentage: 0, color: '#000000' });
  const [newActivity, setNewActivity] = useState({ type: 'commit', repo: '', message: '', date: '' });

  useEffect(() => {
    // Load existing stats from the data file if needed
    loadCurrentStats();
  }, []);

  const loadCurrentStats = async () => {
    try {
      const response = await fetch('/api/github-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    setStats(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const handleTopLevelChange = (field, value) => {
    setStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.percentage > 0) {
      setStats(prev => ({
        ...prev,
        topLanguages: [...prev.topLanguages, { ...newLanguage, percentage: parseInt(newLanguage.percentage) }]
      }));
      setNewLanguage({ name: '', percentage: 0, color: '#000000' });
    }
  };

  const removeLanguage = (index) => {
    setStats(prev => ({
      ...prev,
      topLanguages: prev.topLanguages.filter((_, i) => i !== index)
    }));
  };

  const addActivity = () => {
    if (newActivity.repo && newActivity.message && newActivity.date) {
      setStats(prev => ({
        ...prev,
        recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)] // Keep last 10
      }));
      setNewActivity({ type: 'commit', repo: '', message: '', date: '' });
    }
  };

  const removeActivity = (index) => {
    setStats(prev => ({
      ...prev,
      recentActivity: prev.recentActivity.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats)
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('GitHub stats updated successfully! Changes are now live on your portfolio.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setMessage(`Failed to update GitHub stats: ${errorData.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error saving stats:', error);
      setMessage('Error saving stats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Defensive fallback for nested objects/arrays
  const productivity = stats.productivity || {
    commitsThisWeek: 0,
    issuesOpened: 0,
    pullRequests: 0,
    repositoriesContributedTo: 0,
    codeReviews: 0
  };
  const topLanguages = stats.topLanguages || [];

  return (
    <div className="space-y-8">
      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-900/20 border border-green-800 text-green-300' 
            : 'bg-red-900/20 border border-red-800 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Overview Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Overview Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Total Repos</label>
            <input
              type="number"
              value={stats.totalRepos}
              onChange={(e) => handleTopLevelChange('totalRepos', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Total Stars</label>
            <input
              type="number"
              value={stats.totalStars}
              onChange={(e) => handleTopLevelChange('totalStars', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Followers</label>
            <input
              type="number"
              value={stats.followers}
              onChange={(e) => handleTopLevelChange('followers', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Activity Stats (Update Weekly)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contributions This Year</label>
            <input
              type="number"
              value={stats.contributionsThisYear}
              onChange={(e) => handleTopLevelChange('contributionsThisYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contributions Last Week</label>
            <input
              type="number"
              value={stats.contributionsLastWeek}
              onChange={(e) => handleTopLevelChange('contributionsLastWeek', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Current Streak (days)</label>
            <input
              type="number"
              value={stats.currentStreak}
              onChange={(e) => handleTopLevelChange('currentStreak', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Longest Streak</label>
            <input
              type="number"
              value={stats.longestStreak}
              onChange={(e) => handleTopLevelChange('longestStreak', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Productivity Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Productivity (This Week)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Commits</label>
            <input
              type="number"
              value={productivity.commitsThisWeek ?? 0}
              onChange={(e) => handleInputChange('productivity', 'commitsThisWeek', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Issues Opened</label>
            <input
              type="number"
              value={productivity.issuesOpened ?? 0}
              onChange={(e) => handleInputChange('productivity', 'issuesOpened', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Pull Requests</label>
            <input
              type="number"
              value={productivity.pullRequests ?? 0}
              onChange={(e) => handleInputChange('productivity', 'pullRequests', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Repos Contributed</label>
            <input
              type="number"
              value={productivity.repositoriesContributedTo ?? 0}
              onChange={(e) => handleInputChange('productivity', 'repositoriesContributedTo', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Code Reviews</label>
            <input
              type="number"
              value={productivity.codeReviews ?? 0}
              onChange={(e) => handleInputChange('productivity', 'codeReviews', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Top Languages */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top Languages</h3>
        <div className="space-y-4">
          {topLanguages.map((lang, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
              <input
                type="text"
                value={lang.name ?? ''}
                onChange={(e) => {
                  const newLangs = [...topLanguages];
                  newLangs[index] = { ...newLangs[index], name: e.target.value };
                  setStats(prev => ({ ...prev, topLanguages: newLangs }));
                }}
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                placeholder="Language name"
              />
              <input
                type="number"
                value={lang.percentage ?? 0}
                onChange={(e) => {
                  const newLangs = [...topLanguages];
                  newLangs[index] = { ...newLangs[index], percentage: parseInt(e.target.value) };
                  setStats(prev => ({ ...prev, topLanguages: newLangs }));
                }}
                className="w-20 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                placeholder="%"
              />
              <input
                type="color"
                value={lang.color ?? '#000000'}
                onChange={(e) => {
                  const newLangs = [...topLanguages];
                  newLangs[index] = { ...newLangs[index], color: e.target.value };
                  setStats(prev => ({ ...prev, topLanguages: newLangs }));
                }}
                className="w-12 h-10 bg-gray-600 border border-gray-500 rounded"
              />
              <button
                onClick={() => removeLanguage(index)}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          
          {/* Add New Language */}
          <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600">
            <input
              type="text"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
              placeholder="New language name"
            />
            <input
              type="number"
              value={newLanguage.percentage}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, percentage: e.target.value }))}
              className="w-20 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
              placeholder="%"
            />
            <input
              type="color"
              value={newLanguage.color}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-10 bg-gray-600 border border-gray-500 rounded"
            />
            <button
              onClick={addLanguage}
              className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Saving...' : 'Save GitHub Stats'}
        </button>
      </div>
    </div>
  );
}
