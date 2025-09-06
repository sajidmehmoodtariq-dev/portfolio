// DEPRECATED: This file is no longer used
// GitHub stats are now loaded dynamically from /api/github-stats
// Categories are managed through the owner dashboard  
// This file is kept for reference only

const githubStats = {
  // Overview Stats
  totalRepos: 47,
  publicRepos: 47,
  totalStars: 2,
  totalForks: 0,
  followers: 2,
  following: 4,
  
  // Activity Stats (update weekly)
  contributionsThisYear: 850, // Update this weekly
  contributionsLastWeek: 15, // Update this weekly
  longestStreak: 45, // Days
  currentStreak: 12, // Days
  
  // Language Stats (you can update these monthly)
  topLanguages: [
    { name: 'JavaScript', percentage: 45, color: '#f1e05a' },
    { name: 'TypeScript', percentage: 20, color: '#2b7489' },
    { name: 'HTML', percentage: 15, color: '#e34c26' },
    { name: 'CSS', percentage: 10, color: '#563d7c' },
    { name: 'Python', percentage: 5, color: '#3572A5' },
    { name: 'C++', percentage: 3, color: '#f34b7d' },
    { name: 'C', percentage: 2, color: '#555555' }
  ],
  
  // Project Stats by Category
  projectsByCategory: {
    'Frontend Projects': 16,
    'Web Applications': 3,
    'Backend & APIs': 3,
    'Learning Projects': 3,
    'Tools & Utilities': 0,
    'Mobile Apps': 0,
    'Other': 22
  },
  
  // Recent Activity (update weekly)
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
    // Add more recent activities as needed
  ],
  
  // Featured Projects (manually selected)
  featuredProjects: [
    'Job_Portal_Frontend',
    'PGC-DHA', 
    'Inkly',
    'MovieFlix',
    '3d_Portfolio'
  ],
  
  // Productivity Stats (update weekly)
  productivity: {
    commitsThisWeek: 15,
    issuesOpened: 0,
    pullRequests: 2,
    repositoriesContributedTo: 3,
    codeReviews: 1
  },
  
  // Personal Records
  records: {
    mostStarredRepo: { name: 'Job_Portal_Frontend', stars: 1 },
    mostForkedRepo: { name: 'N/A', forks: 0 },
    oldestRepo: { name: 'First-Web', date: '2022-03-15' },
    newestRepo: { name: 'portfolio', date: '2025-08-20' }
  }
};

export default githubStats;
