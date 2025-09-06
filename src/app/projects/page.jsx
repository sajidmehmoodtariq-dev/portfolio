'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/sections/Header'
import Card from '@/components/Card'
import Image from 'next/image'
import ArrowUprightIcon from '@/assets/icons/arrow-up-right.svg'
import StarIcon from '@/assets/icons/star.svg'

// Import portfolio project images
import portal from '@/assets/images/portal.png';
import lightSaasLandingPage from '@/assets/images/light-saas-landing-page.png';
import aiStartupLandingPage from '@/assets/images/ai-startup-landing-page.png';
import anonymous from '@/assets/images/anonymous.png';

// Image mapping for portfolio projects
const imageMap = {
  'portal.png': portal,
  'light-saas-landing-page.png': lightSaasLandingPage,
  'ai-startup-landing-page.png': aiStartupLandingPage,
  'anonymous.png': anonymous
};

// Project categories and their configurations
const projectCategories = {
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

export default function ProjectsPage() {
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [githubProjects, setGithubProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects/config', { cache: 'no-store' });
      const data = await response.json();

      if (data.success) {
        // Map portfolio project images to imported image objects
        const mappedPortfolioProjects = (data.portfolioProjects?.filter(p => p.visible) || []).map(project => ({
          ...project,
          image: project.image && imageMap[project.image] ? imageMap[project.image] : null
        }));
        
        setPortfolioProjects(mappedPortfolioProjects);
        setGithubProjects(data.githubProjects?.filter(p => p.visible) || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProjects = () => {
    let projects = [];

    if (activeTab === 'all' || activeTab === 'portfolio') {
      projects = [...projects, ...portfolioProjects.map(p => ({ ...p, type: 'portfolio' }))];
    }

    if (activeTab === 'all' || activeTab === 'github') {
      projects = [...projects, ...githubProjects.map(p => ({ ...p, type: 'github' }))];
    }

    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      projects = projects.filter(p => {
        const projectCategory = p.category || 'Other';
        return projectCategory === selectedCategory;
      });
    }

    return projects;
  };

  const getCategoryCount = (category) => {
    if (category === 'all') {
      return totalProjects;
    }
    const allProjects = [...portfolioProjects, ...githubProjects];
    return allProjects.filter(p => {
      const projectCategory = p.category || 'Other';
      return projectCategory === category;
    }).length;
  };

  const filteredProjects = getFilteredProjects();
  const categories = [...new Set([...portfolioProjects, ...githubProjects].map(p => p.category || 'Other'))];
  const allCategories = ['all', ...categories.sort()];
  const totalProjects = portfolioProjects.length + githubProjects.length;
  const pinnedProjects = portfolioProjects.filter(p => p.pinned || p.featured);

  // Prevent hydration mismatch by showing loading state initially
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container py-20">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
              <p className="text-white/60">Loading projects...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-4xl md:text-6xl">All Projects</h1>
          <p className="text-white/60 mt-4 max-w-2xl">
            A comprehensive collection of my projects from GitHub and curated highlights.
            Use filters to explore by category or view everything together.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {allCategories.map((category) => {
              const isActive = selectedCategory === category
              const count = getCategoryCount(category)
              const categoryConfig = category === 'all' 
                ? { icon: '📁', color: 'from-emerald-400 to-sky-400' }
                : (projectCategories[category] || { icon: '📁', color: 'from-gray-400 to-gray-600' })

              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="inline-flex items-center gap-2">
                    {category !== 'all' && <span>{categoryConfig.icon}</span>}
                    <span>{category === 'all' ? 'All' : category}</span>
                    <span className="text-xs opacity-60">({count})</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Featured Projects - Only show when 'all' category is selected */}
        {selectedCategory === 'all' && pinnedProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-semibold mb-6">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pinnedProjects.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-4 h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="text-sm uppercase font-semibold text-emerald-400">
                          {p.company || 'Personal'} • {p.year || new Date(p.updated_at).getFullYear()}
                        </div>
                        <h3 className="font-serif text-xl mt-2">{p.title || p.name}</h3>
                        <p className="text-white/60 mt-3 text-sm">
                          {p.results?.[0]?.title || p.description || ''}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <a href={p.link || p.homepage || p.html_url} target="_blank" rel="noreferrer" className="w-full">
                          <button className="bg-white text-gray-950 rounded-xl w-full h-10 inline-flex items-center justify-center">
                            <ArrowUprightIcon className="size-4 mr-2" />
                            {p.homepage || p.link ? 'Live' : 'View'}
                          </button>
                        </a>
                        <a href={p.github || p.html_url} target="_blank" rel="noreferrer" className="w-full">
                          <button className="bg-gray-900 border border-white/10 rounded-xl w-full h-10">Source</button>
                        </a>
                      </div>
                      {p.image && (
                        <div className="mt-4 -mr-4">
                          <Image 
                            src={p.image} 
                            alt={p.title || p.name}
                            width={300}
                            height={200}
                            className="w-full h-auto object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Projects by Category */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              {selectedCategory === 'all' ? 'All Projects' : `${selectedCategory} Projects`}
            </h2>
            <p className="text-white/60">
              Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects
              .filter(p => selectedCategory === 'all' ? (!p.pinned && !p.featured) : true)
              .map((p, index) => {
                const categoryConfig = projectCategories[p.category || 'Other'] || projectCategories['Other'];
                return <ProjectCard key={p.id || index} project={p} index={index} categoryConfig={categoryConfig} />;
              })}
          </div>
        </motion.section>

        {filteredProjects.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 mt-16"
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-white/60">Try selecting a different category or check back later.</p>
          </motion.div>
        )}
      </main>
    </>
  )
}

// Project Card Component
const ProjectCard = ({ project, index, categoryConfig }) => {
  const isGithubProject = project.isGithubProject

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryConfig.color} text-gray-900`}>
            <span>{categoryConfig.icon}</span>
            <span>{project.category || 'Other'}</span>
          </div>
          {isGithubProject && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <StarIcon className="size-4" />
              <span>{project.stars || 0}</span>
            </div>
          )}
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <Image
              src={project.image}
              alt={project.title || project.name}
              width={300}
              height={180}
              className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <h3 className="font-serif text-xl mb-3">{project.title || project.name}</h3>
        <p className="text-white/70 text-sm mb-4 flex-1">
          {project.results?.[0]?.title || project.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-sm text-white/60">
            {project.language && (
              <span className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${project.language === 'JavaScript' ? 'bg-yellow-400' :
                    project.language === 'TypeScript' ? 'bg-blue-400' :
                      project.language === 'Python' ? 'bg-green-400' :
                        project.language === 'Java' ? 'bg-red-400' :
                          'bg-gray-400'
                  }`}></div>
                {project.language}
              </span>
            )}
            <span>{project.year || new Date(project.updated_at).getFullYear()}</span>
          </div>

          <div className="flex gap-2">
            <motion.a
              href={project.link || project.homepage || project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUprightIcon className="size-4" />
              <span>{project.homepage || project.link ? 'Live' : 'Code'}</span>
            </motion.a>
            {(project.homepage || project.link) && (
              <motion.a
                href={project.github || project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUprightIcon className="size-4" />
                <span>Code</span>
              </motion.a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}