"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import GitHubStatsManager from '@/components/GitHubStatsManager';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFullBlog, setLoadingFullBlog] = useState(false);
  const [githubSyncStatus, setGithubSyncStatus] = useState(null);
  const [refreshingStats, setRefreshingStats] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const data = await response.json();
          setUser(data.data.owner);
        } else {
          router.push('/owner');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/owner');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Check GitHub sync status
  const checkGitHubSync = async () => {
    try {
      const response = await fetch('/api/github-stats/sync');
      if (response.ok) {
        const data = await response.json();
        setGithubSyncStatus(data);
      }
    } catch (error) {
      console.error('Error checking GitHub sync status:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkGitHubSync();
    }
  }, [user]);

  // Manual refresh GitHub stats
  const refreshGitHubStats = async () => {
    setRefreshingStats(true);
    try {
      const response = await fetch('/api/github-stats', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert('GitHub stats refreshed successfully!');
        checkGitHubSync(); // Update sync status
      } else {
        alert(`Error refreshing stats: ${data.error}`);
      }
    } catch (error) {
      console.error('Error refreshing GitHub stats:', error);
      alert('Failed to refresh GitHub stats. Please try again.');
    } finally {
      setRefreshingStats(false);
    }
  };

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const response = await fetch('/api/blogs?limit=50');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data.blogs);
      }
    } catch (error) {
      console.error('Fetch blogs error:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'manage') {
      fetchBlogs();
    }
  }, [user, activeTab]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/owner');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateBlog = async (blogData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog created successfully!');
        // Optionally refresh blogs list if on manage tab
        if (activeTab === 'manage') {
          fetchBlogs();
        }
        // Reset form or switch to manage tab
        setActiveTab('manage');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Create blog error:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlog = async (blogData) => {
    if (!editingBlog) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${editingBlog.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog updated successfully!');
        setEditingBlog(null);
        fetchBlogs(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Update blog error:', error);
      alert('Failed to update blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Blog deleted successfully!');
        fetchBlogs(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete blog error:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleEditClick = async (blog) => {
    setLoadingFullBlog(true);
    try {
      // Fetch the full blog content including the content field
      const response = await fetch(`/api/blogs/${blog.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setEditingBlog(data.data.blog);
      } else {
        alert(`Error fetching blog: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching full blog:', error);
      alert('Failed to load blog for editing. Please try again.');
    } finally {
      setLoadingFullBlog(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Dashboard</h1>
              <span className="px-3 py-1 bg-emerald-300/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full">
                Welcome, {user?.username}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* GitHub Stats Status */}
              {githubSyncStatus && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    githubSyncStatus.synced && !githubSyncStatus.isStale 
                      ? 'bg-green-500' 
                      : githubSyncStatus.nextSyncRecommended 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Stats: {githubSyncStatus.synced 
                      ? `${Math.round(githubSyncStatus.hoursSinceUpdate)}h ago` 
                      : 'Not synced'
                    }
                  </span>
                  <button
                    onClick={refreshGitHubStats}
                    disabled={refreshingStats}
                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh GitHub Stats"
                  >
                    {refreshingStats ? '...' : '⟳'}
                  </button>
                </div>
              )}
              
              <a
                href="/blogs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                View Blog
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => {setActiveTab('create'); setEditingBlog(null);}}
              className={`px-6 py-3 font-medium transition-colors duration-300 ${
                activeTab === 'create'
                  ? 'text-emerald-300 border-b-2 border-emerald-300'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Create New Blog
            </button>
            <button
              onClick={() => {setActiveTab('manage'); setEditingBlog(null);}}
              className={`px-6 py-3 font-medium transition-colors duration-300 ${
                activeTab === 'manage'
                  ? 'text-emerald-300 border-b-2 border-emerald-300'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manage Blogs
            </button>
            <button
              onClick={() => {setActiveTab('github-stats'); setEditingBlog(null);}}
              className={`px-6 py-3 font-medium transition-colors duration-300 ${
                activeTab === 'github-stats'
                  ? 'text-emerald-300 border-b-2 border-emerald-300'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              GitHub Stats
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab + (editingBlog ? '-edit' : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'create' && !editingBlog && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Blog Post</h2>
              <BlogForm
                onSubmit={handleCreateBlog}
                isLoading={isSubmitting}
                submitText="Create Blog"
              />
            </div>
          )}

          {editingBlog && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Blog Post</h2>
                <button
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
              <BlogForm
                initialData={editingBlog}
                onSubmit={handleEditBlog}
                isLoading={isSubmitting}
                submitText="Update Blog"
              />
            </div>
          )}

          {activeTab === 'manage' && !editingBlog && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Blog Posts</h2>
                <button
                  onClick={fetchBlogs}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                >
                  Refresh
                </button>
              </div>

              {blogsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="md" text="Loading blogs..." />
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-400 mb-2">No blogs found</h3>
                      <p className="text-gray-500">Start by creating your first blog post!</p>
                    </div>
                  ) : (
                    blogs.map((blog) => (
                      <div key={blog._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                              {blog.featured && (
                                <span className="px-2 py-1 bg-emerald-300/10 text-emerald-300 text-xs font-medium rounded-full">
                                  Featured
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                blog.published 
                                  ? 'bg-green-300/10 text-green-300' 
                                  : 'bg-yellow-300/10 text-yellow-300'
                              }`}>
                                {blog.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            
                            <p className="text-gray-400 mb-3">{blog.excerpt}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Created: {formatDate(blog.createdAt)}</span>
                              {blog.tags && blog.tags.length > 0 && (
                                <span>Tags: {blog.tags.join(', ')}</span>
                              )}
                              <span>{blog.readTime} min read</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <a
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                              title="View Post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => handleEditClick(blog)}
                              disabled={loadingFullBlog}
                              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit Post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.slug, blog.title)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                              title="Delete Post"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'github-stats' && !editingBlog && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">GitHub Stats Management</h2>
                <div className="text-sm text-gray-400">
                  Configure which GitHub statistics appear on your portfolio
                </div>
              </div>
              <GitHubStatsManager />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
