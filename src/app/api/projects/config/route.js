import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectsConfig from "@/models/ProjectsConfig";

// GitHub API configuration
const GITHUB_USERNAME = 'sajidmehmoodtariq-dev';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Default project categories
const defaultProjectCategories = {
  'Next.js': {
    icon: '⚡',
    description: 'Next.js applications with React and modern features',
    color: 'from-black to-gray-700'
  },
  'React': {
    icon: '⚛️', 
    description: 'React applications and components',
    color: 'from-blue-400 to-cyan-400'
  },
  'MERN Stack': {
    icon: '🏗️',
    description: 'MongoDB, Express, React, Node.js full-stack applications',
    color: 'from-green-400 to-emerald-500'
  },
  'React + Express': {
    icon: '🔗',
    description: 'React frontend with Express.js backend',
    color: 'from-purple-400 to-pink-400'
  },
  'HTML/CSS/JS': {
    icon: '🌐',
    description: 'Vanilla HTML, CSS, and JavaScript projects',
    color: 'from-orange-400 to-red-400'
  },
  'Backend API': {
    icon: '⚙️',
    description: 'Server-side APIs and backend services',
    color: 'from-gray-600 to-gray-800'
  },
  'Portfolio/Landing': {
    icon: '🎨',
    description: 'Portfolio websites and landing pages',
    color: 'from-indigo-400 to-purple-500'
  },
  'Game/Interactive': {
    icon: '🎮',
    description: 'Games and interactive applications',
    color: 'from-yellow-400 to-orange-500'
  },
  'Other': {
    icon: '💡',
    description: 'Miscellaneous projects and experiments',
    color: 'from-gray-400 to-gray-600'
  }
};

// Default portfolio projects (categories can be set via owner dashboard)
const defaultPortfolioProjects = [
  {
    id: 'feedback-anonymous',
    company: 'Personal',
    year: '2025',
    title: 'Anonymous Feedback Web App',
    category: 'Other', // Can be changed via owner dashboard
    results: [
      { title: 'Allows users to send anonymous mentions and get honest feedback' },
      { title: 'Built with Next.js and deployed on Vercel' },
      { title: 'Helps creators and professionals receive true responses easily' }
    ],
    link: 'https://feedback-five-topaz.vercel.app',
    github: 'https://github.com/sajidmehmoodtariq-dev/feedback-next',
    image: 'anonymous.png',
    pinned: true,
    visible: true,
    order: 1
  },
  {
    id: 'job-portal',
    company: 'Commercial Electricians Australia',
    year: '2025',
    title: 'Job Portal',
    category: 'Other', // Can be changed via owner dashboard
    results: [
      { title: 'Boosted sales by 20%' },
      { title: 'Expanded customer reach by 35%' },
      { title: 'Increased brand awareness by 15%' }
    ],
    link: 'https://portal.mygcce.com.au',
    github: 'https://github.com/sajidmehmoodtariq-dev/Job_Portal_Frontend',
    image: 'portal.png',
    pinned: true,
    visible: true,
    order: 2
  },
  {
    id: 'pgcdha',
    company: 'Punjab Group of College',
    year: '2025',
    title: 'PGCDHA',
    category: 'Other', // Can be changed via owner dashboard
    results: [
      { title: 'Enhanced user experience by 40%' },
      { title: 'Improved site speed by 50%' },
      { title: 'Increased mobile traffic by 35%' }
    ],
    link: 'https://pgcdha.vercel.app',
    github: 'https://github.com/sajidmehmoodtariq-dev/PGC-DHA',
    image: 'light-saas-landing-page.png',
    pinned: true,
    visible: true,
    order: 3
  },
  {
    id: 'sajidmehmood',
    company: 'Self',
    year: '2024',
    title: 'Portfolio',
    category: 'Other', // Can be changed via owner dashboard
    results: [
      { title: 'Enhanced user experience by 40%' },
      { title: 'Improved site speed by 50%' },
      { title: 'Increased mobile traffic by 35%' }
    ],
    link: 'https://sajidmehmoodtariq.vercel.app',
    github: 'https://github.com/sajidmehmoodtariq-dev/3d_Portfolio',
    image: 'ai-startup-landing-page.png',
    pinned: true,
    visible: true,
    order: 4
  }
];

async function fetchGitHubRepos() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Filter out forks and transform data
    const filteredRepos = repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        key: repo.name,
        title: repo.name.split(/[-_]/).map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        category: categorizeRepo(repo),
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        homepage: repo.homepage || '',
        topics: repo.topics || [],
        visible: repo.stargazers_count > 0 || repo.name.includes('portfolio') || repo.name.includes('project'),
        featured: repo.stargazers_count > 2,
        order: repo.stargazers_count * 10 + repo.forks_count,
        lastUpdated: new Date(repo.updated_at),
        createdAt: new Date(repo.created_at)
      }));

    return filteredRepos.sort((a, b) => b.order - a.order);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw error;
  }
}

function categorizeRepo(repo) {
  // Simple categorization - most repos will be "Other" 
  // so owner can categorize them properly via dashboard
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  
  // Only categorize very obvious cases, everything else goes to "Other"
  if (name.includes('portfolio') || description.includes('portfolio')) {
    return 'Portfolio/Landing';
  }
  
  // Default to "Other" - owner can recategorize via dashboard
  return 'Other';
}

export async function GET(req) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const refresh = url.searchParams.get('refresh') === 'true';
    
    let config = await ProjectsConfig.findOne({ isActive: true });
    
    if (!config || refresh) {
      // Fetch fresh GitHub data if config doesn't exist or refresh is requested
      let githubProjects = [];
      try {
        githubProjects = await fetchGitHubRepos();
      } catch (error) {
        console.error('Failed to fetch GitHub repos, using empty array:', error);
      }

      if (!config) {
        // Create new configuration with default data
        config = await ProjectsConfig.create({
          portfolioProjects: defaultPortfolioProjects,
          githubProjects,
          categories: defaultProjectCategories,
          isActive: true
        });
      } else if (refresh) {
        // Update existing configuration with fresh GitHub data
        config.githubProjects = githubProjects;
        config.lastUpdated = new Date();
        await config.save();
      }
    }

    // Ensure categories exist (for backward compatibility)
    if (!config.categories || Object.keys(config.categories).length === 0) {
      config.categories = defaultProjectCategories;
      await config.save();
    }
    
    return NextResponse.json({
      success: true,
      portfolioProjects: config.portfolioProjects,
      githubProjects: config.githubProjects,
      categories: config.categories,
      lastUpdated: config.lastUpdated
    });
    
  } catch (error) {
    console.error("Error fetching projects config:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch projects configuration",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const { portfolioProjects, githubProjects, categories } = await req.json();
    
    if (!Array.isArray(portfolioProjects) && !Array.isArray(githubProjects) && !categories) {
      return NextResponse.json(
        { error: "Either portfolioProjects, githubProjects, or categories must be provided" },
        { status: 400 }
      );
    }
    
    const updateData = {
      isActive: true,
      lastUpdated: new Date()
    };
    
    if (portfolioProjects) updateData.portfolioProjects = portfolioProjects;
    if (githubProjects) updateData.githubProjects = githubProjects;
    if (categories) updateData.categories = categories;
    
    const updatedConfig = await ProjectsConfig.findOneAndUpdate(
      { isActive: true },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    return NextResponse.json({
      success: true,
      message: "Projects configuration updated successfully",
      portfolioProjects: updatedConfig.portfolioProjects,
      githubProjects: updatedConfig.githubProjects,
      categories: updatedConfig.categories,
      lastUpdated: updatedConfig.lastUpdated
    });
    
  } catch (error) {
    console.error("Error updating projects config:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update projects configuration",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
