import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectsConfig from "@/models/ProjectsConfig";

// GitHub API configuration
const GITHUB_USERNAME = 'sajidmehmoodtariq-dev';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Default portfolio projects (keeping the existing ones)
const defaultPortfolioProjects = [
  {
    id: 'feedback-anonymous',
    company: 'Personal',
    year: '2025',
    title: 'Anonymous Feedback Web App',
    category: 'Next.js',
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
    category: 'MERN',
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
    category: 'MERN',
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
    category: 'Threejs',
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
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics || [];

  // Check topics first
  if (topics.includes('frontend') || topics.includes('react') || topics.includes('nextjs')) {
    return 'Frontend Projects';
  }
  if (topics.includes('backend') || topics.includes('api') || topics.includes('server')) {
    return 'Backend & APIs';
  }
  if (topics.includes('webapp') || topics.includes('fullstack')) {
    return 'Web Applications';
  }
  if (topics.includes('learning') || topics.includes('tutorial') || topics.includes('course')) {
    return 'Learning Projects';
  }
  if (topics.includes('tool') || topics.includes('utility')) {
    return 'Tools & Utilities';
  }

  // Check by name and description
  if (name.includes('api') || name.includes('backend') || description.includes('api')) {
    return 'Backend & APIs';
  }
  if (name.includes('frontend') || name.includes('react') || name.includes('next') || description.includes('frontend')) {
    return 'Frontend Projects';
  }
  if (name.includes('app') || name.includes('webapp') || description.includes('application')) {
    return 'Web Applications';
  }
  if (name.includes('learning') || name.includes('tutorial') || name.includes('course') || description.includes('learning')) {
    return 'Learning Projects';
  }
  if (name.includes('tool') || name.includes('util') || description.includes('tool')) {
    return 'Tools & Utilities';
  }

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
          isActive: true
        });
      } else if (refresh) {
        // Update existing configuration with fresh GitHub data
        config.githubProjects = githubProjects;
        config.lastUpdated = new Date();
        await config.save();
      }
    }
    
    return NextResponse.json({
      success: true,
      portfolioProjects: config.portfolioProjects,
      githubProjects: config.githubProjects,
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
    
    const { portfolioProjects, githubProjects } = await req.json();
    
    if (!Array.isArray(portfolioProjects) && !Array.isArray(githubProjects)) {
      return NextResponse.json(
        { error: "Either portfolioProjects or githubProjects must be provided as arrays" },
        { status: 400 }
      );
    }
    
    const updateData = {
      isActive: true,
      lastUpdated: new Date()
    };
    
    if (portfolioProjects) updateData.portfolioProjects = portfolioProjects;
    if (githubProjects) updateData.githubProjects = githubProjects;
    
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
