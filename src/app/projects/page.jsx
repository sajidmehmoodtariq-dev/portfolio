'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/sections/Header'
import portfolioProjects from '@/data/projects'
import Card from '@/components/Card'
import Image from 'next/image'
import ArrowUprightIcon from '@/assets/icons/arrow-up-right.svg'
import StarIcon from '@/assets/icons/star.svg'

// Project categories and their configurations
const projectCategories = {
  'Web Applications': {
    icon: '🌐',
    description: 'Full-stack web applications and websites',
    color: 'from-emerald-400 to-sky-400'
  },
  'Frontend Projects': {
    icon: '🎨', 
    description: 'React, Next.js, and frontend-focused projects',
    color: 'from-purple-400 to-pink-400'
  },
  'Backend & APIs': {
    icon: '⚙️',
    description: 'Server-side applications and APIs',
    color: 'from-orange-400 to-red-400'
  },
  'Learning Projects': {
    icon: '📚',
    description: 'Educational and learning-focused repositories',
    color: 'from-blue-400 to-cyan-400'
  },
  'Tools & Utilities': {
    icon: '🔧',
    description: 'Useful tools and utility applications', 
    color: 'from-green-400 to-teal-400'
  },
  'Other': {
    icon: '💡',
    description: 'Miscellaneous projects and experiments',
    color: 'from-indigo-400 to-purple-400'
  }
}

// GitHub projects data structure with show boolean
const githubProjects = [
  {
    id: 'inkly',
    name: 'Inkly',
    description: 'A full-featured blogging platform built with MERN stack',
    language: 'JavaScript',
    category: 'Web Applications',
    stars: 1,
    forks: 0,
    updated_at: '2024-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/Inkly',
    homepage: null,
    show: true // You can control visibility here
  },
  {
    id: 'job-portal-frontend',
    name: 'Job_Portal_Frontend',
    description: 'Frontend for a comprehensive job portal application',
    language: 'JavaScript',
    category: 'Frontend Projects', 
    stars: 1,
    forks: 0,
    updated_at: '2024-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/Job_Portal_Frontend',
    homepage: 'https://portal.mygcce.com.au',
    show: true
  },
  {
    id: 'movieflix',
    name: 'MovieFlix',
    description: 'A movie discovery site built with React.js and Tailwind CSS using external APIs',
    language: 'JavaScript',
    category: 'Frontend Projects',
    stars: 0,
    forks: 0,
    updated_at: '2024-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/MovieFlix',
    homepage: null,
    show: true
  },
  {
    id: 'pgc-dha',
    name: 'PGC-DHA',
    description: 'Educational institution website built with modern web technologies',
    language: 'JavaScript',
    category: 'Web Applications',
    stars: 0,
    forks: 0,
    updated_at: '2024-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/PGC-DHA',
    homepage: 'https://pgcdha.vercel.app',
    show: true
  },
  {
    id: '3d-portfolio',
    name: '3d_Portfolio',
    description: '3D interactive portfolio website showcasing modern web technologies',
    language: 'JavaScript',
    category: 'Frontend Projects',
    stars: 0,
    forks: 0,
    updated_at: '2023-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/3d_Portfolio',
    homepage: 'https://sajidmehmoodtariq.vercel.app',
    show: true
  },
  // Add more projects as needed - you can set show: false to hide them
  {
    id: 'example-hidden',
    name: 'Hidden_Project',
    description: 'This project is hidden from the main view',
    language: 'Python',
    category: 'Other',
    stars: 0,
    forks: 0,
    updated_at: '2022-01-01',
    html_url: 'https://github.com/sajidmehmoodtariq-dev/hidden-project',
    homepage: null,
    show: false // Hidden from display
  }
]

const categorizeProject = (repo) => {
  const name = repo.name.toLowerCase()
  const description = (repo.description || '').toLowerCase()
  const language = repo.language || ''
  
  // Web Applications
  if (name.includes('blog') || name.includes('inkly') || name.includes('portal') || 
      name.includes('ecommerce') || name.includes('shop') || name.includes('app') ||
      description.includes('full stack') || description.includes('mern')) {
    return 'Web Applications'
  }
  
  // Frontend Projects  
  if (name.includes('frontend') || name.includes('react') || name.includes('next') ||
      name.includes('movie') || name.includes('portfolio') || name.includes('ui') ||
      language === 'TypeScript' || (language === 'JavaScript' && description.includes('react'))) {
    return 'Frontend Projects'
  }
  
  // Backend & APIs
  if (name.includes('backend') || name.includes('api') || name.includes('server') ||
      language === 'Python' || language === 'Java' || language === 'Go' ||
      description.includes('api') || description.includes('backend')) {
    return 'Backend & APIs'
  }
  
  // Learning Projects
  if (name.includes('cs50') || name.includes('learn') || name.includes('tutorial') ||
      name.includes('practice') || name.includes('course') || name.includes('exercise') ||
      description.includes('learning') || description.includes('practice')) {
    return 'Learning Projects'
  }
  
  // Tools & Utilities
  if (name.includes('tool') || name.includes('util') || name.includes('helper') ||
      name.includes('script') || name.includes('automation') ||
      description.includes('tool') || description.includes('utility')) {
    return 'Tools & Utilities'
  }
  
  return 'Other'
}

const ProjectsPage = () => {
  const [allProjects, setAllProjects] = useState([...portfolioProjects, ...githubProjects])
  const [githubStats, setGithubStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        // Fetch all repositories from GitHub
        const reposResponse = await fetch('https://api.github.com/users/sajidmehmoodtariq-dev/repos?per_page=100&sort=updated')
        const reposData = await reposResponse.json()
        
        // Process GitHub repos and add show boolean
        const processedGithubProjects = reposData.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || 'No description available',
          language: repo.language,
          category: categorizeProject(repo),
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
          homepage: repo.homepage,
          topics: repo.topics || [],
          // Show logic - you can customize this
          show: !repo.fork && // Hide forked repos
                repo.name !== 'sajidmehmoodtariq-dev' && // Hide profile repo
                !repo.name.toLowerCase().includes('config') && // Hide config repos
                repo.stargazers_count >= 0, // Show all repos (adjust threshold as needed)
          isGithubProject: true
        }))
        
        // Combine curated projects with GitHub projects
        const combinedProjects = [
          ...portfolioProjects.map(p => ({...p, show: true, isGithubProject: false})),
          ...processedGithubProjects
        ]
        
        // Remove duplicates based on name/title matching
        const uniqueProjects = combinedProjects.filter((project, index, self) => {
          const projectName = project.name || project.title || ''
          return index === self.findIndex(p => {
            const pName = p.name || p.title || ''
            return projectName.toLowerCase().includes(pName.toLowerCase()) || 
                   pName.toLowerCase().includes(projectName.toLowerCase())
          })
        })
        
        // Sort by updated date (most recent first)
        uniqueProjects.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.year || '2020')
          const dateB = new Date(b.updated_at || b.year || '2020')
          return dateB - dateA
        })
        
        setAllProjects(uniqueProjects)
        setGithubStats({
          totalRepos: reposData.length,
          totalStars: reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0),
          languages: [...new Set(reposData.map(repo => repo.language).filter(Boolean))]
        })
        
      } catch (error) {
        console.log('Using static project data')
        setAllProjects([...portfolioProjects.map(p => ({...p, show: true, isGithubProject: false}))])
      } finally {
        setLoading(false)
      }
    }
    
    fetchGitHubProjects()
  }, [])

  // Filter projects based on show boolean and selected category
  const visibleProjects = allProjects.filter(project => {
    if (!project.show) return false
    if (selectedCategory === 'All') return true
    return (project.category || 'Other') === selectedCategory
  })

  const pinnedProjects = visibleProjects.filter(p => p.pinned)
  const otherProjects = visibleProjects.filter(p => !p.pinned)
  
  // Group other projects by category
  const categories = otherProjects.reduce((acc, p) => {
    const key = p.category || 'Other'
    acc[key] = acc[key] || []
    acc[key].push(p)
    return acc
  }, {})

  const allCategories = ['All', ...Object.keys(projectCategories)]
  
  const getCategoryCount = (category) => {
    if (category === 'All') return visibleProjects.length
    return visibleProjects.filter(p => (p.category || 'Other') === category).length
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

        {/* GitHub Stats */}
        {!loading && githubStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          >
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                {githubStats.totalRepos}
              </div>
              <div className="text-sm text-white/60">Total Repositories</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {githubStats.totalStars}
              </div>
              <div className="text-sm text-white/60">Total Stars</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl mb-2">🔧</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {githubStats.languages.length}
              </div>
              <div className="text-sm text-white/60">Languages Used</div>
            </Card>
          </motion.div>
        )}

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
              const categoryConfig = projectCategories[category] || { icon: '📁', color: 'from-gray-400 to-gray-600' }
              
              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="inline-flex items-center gap-2">
                    {category !== 'All' && <span>{categoryConfig.icon}</span>}
                    <span>{category}</span>
                    <span className="text-xs opacity-60">({count})</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Featured Projects */}
        {pinnedProjects.length > 0 && (
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
                          <Image src={p.image} alt={p.title || p.name} />
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
          {selectedCategory === 'All' ? (
            // Show all categories
            Object.keys(categories).map(cat => {
              const categoryConfig = projectCategories[cat] || projectCategories['Other']
              return (
                <div key={cat} className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{categoryConfig.icon}</span>
                    <h3 className="text-2xl font-semibold">{cat}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryConfig.color} text-gray-900`}>
                      {categories[cat].length} projects
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories[cat].map((p, index) => (
                      <ProjectCard key={p.id} project={p} index={index} categoryConfig={categoryConfig} />
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            // Show filtered category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.filter(p => !p.pinned).map((p, index) => {
                const categoryConfig = projectCategories[p.category] || projectCategories['Other']
                return <ProjectCard key={p.id} project={p} index={index} categoryConfig={categoryConfig} />
              })}
            </div>
          )}
        </motion.section>
        
        {visibleProjects.length === 0 && !loading && (
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
                <div className={`w-3 h-3 rounded-full ${
                  project.language === 'JavaScript' ? 'bg-yellow-400' :
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

export default ProjectsPage