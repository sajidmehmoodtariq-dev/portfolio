'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function GitHubStatsManager() {
  const [config, setConfig] = useState([]);
  const [githubStats, setGithubStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewData, setPreviewData] = useState({});

  useEffect(() => {
    loadConfig();
    loadGitHubStats();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/github-stats/config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const loadGitHubStats = async () => {
    try {
      const response = await fetch('/api/github-stats');
      const data = await response.json();
      if (data.success) {
        setGithubStats(data);
        setPreviewData(data);
      }
    } catch (error) {
      console.error('Error loading GitHub stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisibilityChange = (index, visible) => {
    const updatedConfig = [...config];
    updatedConfig[index].visible = visible;
    setConfig(updatedConfig);
  };

  const handleOrderChange = (index, newOrder) => {
    const updatedConfig = [...config];
    updatedConfig[index].order = parseInt(newOrder);
    setConfig(updatedConfig);
  };

  const moveItem = (index, direction) => {
    const newConfig = [...config];
    const item = newConfig[index];
    
    if (direction === 'up' && index > 0) {
      [newConfig[index], newConfig[index - 1]] = [newConfig[index - 1], newConfig[index]];
      newConfig[index].order = index + 1;
      newConfig[index - 1].order = index;
    } else if (direction === 'down' && index < newConfig.length - 1) {
      [newConfig[index], newConfig[index + 1]] = [newConfig[index + 1], newConfig[index]];
      newConfig[index].order = index + 1;
      newConfig[index + 1].order = index + 2;
    }
    
    setConfig(newConfig);
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/github-stats/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayedStats: config })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('Error saving configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const refreshGitHubStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github-stats', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setGithubStats(data);
        setPreviewData(data);
        setMessage('GitHub stats refreshed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error refreshing stats: ${data.error}`);
      }
    } catch (error) {
      console.error('Error refreshing GitHub stats:', error);
      setMessage('Failed to refresh GitHub stats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatValue = (key) => {
    if (!githubStats) return '—';
    
    const value = githubStats[key];
    if (value === undefined || value === null) return '—';
    
    // Format specific stats
    if (key.includes('Streak')) {
      return `${value} days`;
    }
    
    return value.toLocaleString();
  };

  const visibleStats = config.filter(stat => stat.visible).sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="md" text="Loading GitHub stats management..." />
      </div>
    );
  }

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

      {/* Controls */}
      <div className="flex gap-4 items-center justify-between">
        <h3 className="text-lg font-semibold text-white">GitHub Stats Configuration</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshGitHubStats}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '🔄 Refresh Data'}
          </button>
          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-md font-semibold text-white mb-4">Available Stats</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {config.map((stat, index) => (
              <div key={stat.key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={stat.visible}
                    onChange={(e) => handleVisibilityChange(index, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{stat.title}</div>
                      <div className="text-gray-400 text-xs">{stat.description}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-emerald-400 font-mono text-sm">
                    {getStatValue(stat.key)}
                  </div>
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === config.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-md font-semibold text-white mb-4">
            Live Preview ({visibleStats.length} stats visible)
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {visibleStats.map((stat) => (
              <div
                key={stat.key}
                className="relative overflow-hidden rounded-lg bg-gray-900 p-4 border border-gray-600"
              >
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${stat.gradient}`}></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="text-white text-xs font-medium">{stat.title}</span>
                  </div>
                  <div className="text-emerald-400 text-lg font-bold mb-1">
                    {getStatValue(stat.key)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {visibleStats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <div>No stats selected for display</div>
              <div className="text-sm">Check some boxes to see the preview</div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats Info */}
      {githubStats && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h4 className="text-md font-semibold text-white mb-4">Raw GitHub Data</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Last Updated</div>
              <div className="text-white">{new Date(githubStats.lastUpdated).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Data Source</div>
              <div className="text-white capitalize">{githubStats.source || 'unknown'}</div>
            </div>
            <div>
              <div className="text-gray-400">Top Language</div>
              <div className="text-white">{githubStats.topLanguages?.[0]?.name || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400">Featured Projects</div>
              <div className="text-white">{githubStats.featuredProjects?.length || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
