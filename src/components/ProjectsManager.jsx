'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Image from 'next/image';

export default function ProjectsManager() {
  const [config, setConfig] = useState({ portfolioProjects: [], githubProjects: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('github');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects/config');
      const data = await response.json();
      if (data.success) {
        setConfig({
          portfolioProjects: data.portfolioProjects || [],
          githubProjects: data.githubProjects || []
        });
        // Load categories from API, fallback to empty object if not available
        setCategories(data.categories || {});
      }
    } catch (error) {
      console.error('Error loading projects config:', error);
      setMessage('Error loading projects configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGitHubProjects = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/projects/config?refresh=true');
      const data = await response.json();
      
      if (data.success) {
        setConfig({
          portfolioProjects: data.portfolioProjects || [],
          githubProjects: data.githubProjects || []
        });
        // Update categories as well
        if (data.categories) {
          setCategories(data.categories);
        }
        setMessage('GitHub projects refreshed successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error refreshing projects: ${data.error}`);
      }
    } catch (error) {
      console.error('Error refreshing GitHub projects:', error);
      setMessage('Failed to refresh GitHub projects. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGitHubProjectChange = (index, field, value) => {
    const updatedProjects = [...config.githubProjects];
    updatedProjects[index][field] = value;
    setConfig(prev => ({ ...prev, githubProjects: updatedProjects }));
  };

  const handlePortfolioProjectChange = (index, field, value) => {
    const updatedProjects = [...config.portfolioProjects];
    updatedProjects[index][field] = value;
    setConfig(prev => ({ ...prev, portfolioProjects: updatedProjects }));
  };

  const moveProject = (type, index, direction) => {
    const projects = type === 'github' ? [...config.githubProjects] : [...config.portfolioProjects];
    
    if (direction === 'up' && index > 0) {
      [projects[index], projects[index - 1]] = [projects[index - 1], projects[index]];
      projects[index].order = index + 1;
      projects[index - 1].order = index;
    } else if (direction === 'down' && index < projects.length - 1) {
      [projects[index], projects[index + 1]] = [projects[index + 1], projects[index]];
      projects[index].order = index + 1;
      projects[index + 1].order = index + 2;
    }
    
    if (type === 'github') {
      setConfig(prev => ({ ...prev, githubProjects: projects }));
    } else {
      setConfig(prev => ({ ...prev, portfolioProjects: projects }));
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/projects/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          categories: categories
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Projects configuration and categories saved successfully!');
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

  const updateCategory = (categoryName, field, value) => {
    setCategories(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [field]: value
      }
    }));
  };

  const addNewCategory = () => {
    const newCategoryName = prompt('Enter new category name:');
    if (newCategoryName && !categories[newCategoryName]) {
      setCategories(prev => ({
        ...prev,
        [newCategoryName]: {
          icon: '📁',
          description: 'New category description',
          color: 'from-gray-400 to-gray-600'
        }
      }));
    }
  };

  const deleteCategory = (categoryName) => {
    if (categoryName === 'Other') {
      setMessage('Cannot delete the "Other" category as it\'s used as fallback');
      return;
    }
    
    const projectsInCategory = [...config.portfolioProjects, ...config.githubProjects]
      .filter(p => p.category === categoryName).length;
    
    if (projectsInCategory > 0) {
      const confirmed = confirm(`This category has ${projectsInCategory} projects. They will be moved to "Other" category. Continue?`);
      if (!confirmed) return;
      
      // Move projects to Other category
      const updatedPortfolio = config.portfolioProjects.map(p => 
        p.category === categoryName ? { ...p, category: 'Other' } : p
      );
      const updatedGithub = config.githubProjects.map(p => 
        p.category === categoryName ? { ...p, category: 'Other' } : p
      );
      
      setConfig(prev => ({
        portfolioProjects: updatedPortfolio,
        githubProjects: updatedGithub
      }));
    }
    
    const newCategories = { ...categories };
    delete newCategories[categoryName];
    setCategories(newCategories);
  };

  const visibleGithubProjects = config.githubProjects.filter(p => p.visible).length;
  const featuredGithubProjects = config.githubProjects.filter(p => p.featured).length;
  const visiblePortfolioProjects = config.portfolioProjects.filter(p => p.visible).length;
  const pinnedPortfolioProjects = config.portfolioProjects.filter(p => p.pinned).length;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="md" text="Loading projects configuration..." />
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
        <h3 className="text-lg font-semibold text-white">Projects Configuration</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshGitHubProjects}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? '...' : '🔄 Refresh GitHub'}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-emerald-400">{config.githubProjects.length}</div>
          <div className="text-sm text-gray-400">GitHub Repos</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{visibleGithubProjects}</div>
          <div className="text-sm text-gray-400">Visible GitHub</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{config.portfolioProjects.length}</div>
          <div className="text-sm text-gray-400">Portfolio Projects</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-pink-400">{pinnedPortfolioProjects}</div>
          <div className="text-sm text-gray-400">Featured Projects</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('github')}
          className={`px-6 py-3 font-medium transition-colors duration-300 ${
            activeTab === 'github'
              ? 'text-emerald-300 border-b-2 border-emerald-300'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          GitHub Projects ({config.githubProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-6 py-3 font-medium transition-colors duration-300 ${
            activeTab === 'portfolio'
              ? 'text-emerald-300 border-b-2 border-emerald-300'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Portfolio Projects ({config.portfolioProjects.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-medium transition-colors duration-300 ${
            activeTab === 'categories'
              ? 'text-emerald-300 border-b-2 border-emerald-300'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Categories ({Object.keys(categories).length})
        </button>
      </div>

      {/* GitHub Projects Tab */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            These are automatically fetched from your GitHub repositories. Toggle visibility and featured status for each project.
          </div>
          
          <div className="grid gap-4">
            {config.githubProjects.map((project, index) => (
              <div key={project.key} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.visible}
                          onChange={(e) => handleGitHubProjectChange(index, 'visible', e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs text-gray-400">Visible</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(e) => handleGitHubProjectChange(index, 'featured', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-400">Featured</span>
                      </label>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{project.title}</h4>
                        {project.language && (
                          <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded">
                            {project.language}
                          </span>
                        )}
                      </div>
                      
                      {/* Category Selection */}
                      <div className="mb-2">
                        <label className="text-xs text-gray-400 block mb-1">Category:</label>
                        <select
                          value={project.category || 'Other'}
                          onChange={(e) => handleGitHubProjectChange(index, 'category', e.target.value)}
                          className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white w-40"
                        >
                          {Object.entries(categories).map(([categoryName, categoryConfig]) => (
                            <option key={categoryName} value={categoryName}>
                              {categoryConfig.icon} {categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⭐ {project.stars}</span>
                        <span>🍴 {project.forks}</span>
                        <span>📅 {new Date(project.lastUpdated).toLocaleDateString()}</span>
                        {project.homepage && (
                          <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            🔗 Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveProject('github', index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs p-1"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveProject('github', index, 'down')}
                      disabled={index === config.githubProjects.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs p-1"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Projects Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-4">
            These are your featured portfolio projects. You cannot modify the portfolio projects here as they need manual configuration.
          </div>
          
          <div className="grid gap-4">
            {config.portfolioProjects.map((project, index) => (
              <div key={project.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.visible}
                          onChange={(e) => handlePortfolioProjectChange(index, 'visible', e.target.checked)}
                          className="w-4 h-4 text-emerald-600 bg-gray-600 border-gray-500 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs text-gray-400">Visible</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={project.pinned}
                          onChange={(e) => handlePortfolioProjectChange(index, 'pinned', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-400">Pinned</span>
                      </label>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{project.title}</h4>
                        <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded">
                          {project.company} • {project.year}
                        </span>
                      </div>
                      
                      {/* Category Selection */}
                      <div className="mb-2">
                        <label className="text-xs text-gray-400 block mb-1">Category:</label>
                        <select
                          value={project.category || 'Other'}
                          onChange={(e) => handlePortfolioProjectChange(index, 'category', e.target.value)}
                          className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white w-40"
                        >
                          {Object.entries(categories).map(([categoryName, categoryConfig]) => (
                            <option key={categoryName} value={categoryName}>
                              {categoryConfig.icon} {categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="text-gray-400 text-sm mb-2">
                        {project.results?.map((result, idx) => (
                          <div key={idx} className="text-xs">• {result.title}</div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          🔗 Live Site
                        </a>
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            📁 GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveProject('portfolio', index, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs p-1"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveProject('portfolio', index, 'down')}
                      disabled={index === config.portfolioProjects.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 text-xs p-1"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              Manage project categories - edit icons, descriptions, and colors for each tech stack.
            </div>
            <button
              onClick={addNewCategory}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Category
            </button>
          </div>
          
          <div className="grid gap-4">
            {Object.entries(categories).map(([categoryName, categoryConfig]) => (
              <div key={categoryName} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                {editingCategory === categoryName ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji)</label>
                        <input
                          type="text"
                          value={categoryConfig.icon}
                          onChange={(e) => updateCategory(categoryName, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center text-xl"
                          maxLength="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Color (Tailwind Classes)</label>
                        <select
                          value={categoryConfig.color}
                          onChange={(e) => updateCategory(categoryName, 'color', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          <option value="from-emerald-400 to-sky-400">Emerald to Sky</option>
                          <option value="from-blue-400 to-cyan-400">Blue to Cyan</option>
                          <option value="from-purple-400 to-pink-400">Purple to Pink</option>
                          <option value="from-orange-400 to-red-400">Orange to Red</option>
                          <option value="from-green-400 to-emerald-500">Green to Emerald</option>
                          <option value="from-yellow-400 to-orange-500">Yellow to Orange</option>
                          <option value="from-indigo-400 to-purple-500">Indigo to Purple</option>
                          <option value="from-gray-600 to-gray-800">Gray to Dark Gray</option>
                          <option value="from-black to-gray-700">Black to Gray</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <div className={`w-full h-10 rounded bg-gradient-to-r ${categoryConfig.color}`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea
                        value={categoryConfig.description}
                        onChange={(e) => updateCategory(categoryName, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                        rows="2"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          loadConfig(); // Reload from server to cancel changes
                          setEditingCategory(null);
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                      {categoryName !== 'Other' && (
                        <button
                          onClick={() => deleteCategory(categoryName)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm ml-auto"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-3xl">{categoryConfig.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{categoryName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryConfig.color} text-gray-900`}>
                            {[...config.portfolioProjects, ...config.githubProjects].filter(p => (p.category || 'Other') === categoryName).length} projects
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{categoryConfig.description}</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${categoryConfig.color}`}></div>
                          <span className="text-xs text-gray-500">Color: {categoryConfig.color}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingCategory(categoryName)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  </div>
                )}
                
                {/* Show projects in this category */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Projects in this category:</div>
                  <div className="flex flex-wrap gap-2">
                    {[...config.portfolioProjects, ...config.githubProjects]
                      .filter(p => (p.category || 'Other') === categoryName)
                      .map((project, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                          {project.title || project.name}
                        </span>
                      ))
                    }
                  </div>
                  {[...config.portfolioProjects, ...config.githubProjects].filter(p => (p.category || 'Other') === categoryName).length === 0 && (
                    <span className="text-xs text-gray-500 italic">No projects assigned to this category</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="text-green-400 text-xl">✅</div>
              <div>
                <h4 className="text-green-400 font-semibold mb-1">Categories Now Editable!</h4>
                <p className="text-gray-300 text-sm">
                  You can now edit categories directly here:
                  <br />• Click "Edit" on any category to modify its icon, description, and color
                  <br />• Add new categories with the "+ Add Category" button
                  <br />• Delete categories (projects will be moved to "Other")
                  <br />• Categories are used for both GitHub and portfolio projects
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
