import darkSaasLandingPage from '@/assets/images/dark-saas-landing-page.png'
import lightSaasLandingPage from '@/assets/images/light-saas-landing-page.png'
import aiStartupLandingPage from '@/assets/images/ai-startup-landing-page.png'
import bookCover from '@/assets/images/book-cover.png'
import map from '@/assets/images/map.png'
import memojiComputer from '@/assets/images/memoji-computer.png'
import memojiSmile from '@/assets/images/memoji-smile.png'

const portfolioProjects = [
  {
    id: 'job-portal',
    company: 'Commercial Electricians Australia',
    year: '2025',
    title: 'Job Portal',
  category: 'MERN',
    results: [
      { title: 'Boosted sales by 20%' },
      { title: 'Expanded customer reach by 35%' },
      { title: 'Increased brand awareness by 15%' },
    ],
    link: 'https://portal.mygcce.com.au',
    github: 'https://github.com/sajidmehmoodtariq-dev/Job_Portal_Frontend',
    image: darkSaasLandingPage,
    pinned: true,
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
      { title: 'Increased mobile traffic by 35%' },
    ],
    link: 'https://pgcdha.vercel.app',
    github: 'https://github.com/sajidmehmoodtariq-dev/PGC-DHA',
    image: lightSaasLandingPage,
    pinned: true,
  },
  {
    id: 'ai-startup',
    company: 'Quantum Dynamics',
    year: '2023',
    title: 'AI Startup Landing Page',
  category: 'JS',
    results: [
      { title: 'Enhanced user experience by 40%' },
      { title: 'Improved site speed by 50%' },
      { title: 'Increased mobile traffic by 35%' },
    ],
    link: 'https://sajidmehmoodtariq.vercel.app',
    github: 'https://github.com/sajidmehmoodtariq-dev/3d_Portfolio',
    image: aiStartupLandingPage,
    pinned: true,
  },
  // Additional projects (examples) to populate the projects page
  {
    id: 'book-cover',
    company: 'Self',
    year: '2020',
    title: 'Book Cover & Promo Site',
  category: 'Python',
    results: [{ title: 'Designed marketing assets and landing flow' }],
    link: '#',
    github: '#',
    image: bookCover,
  },
  {
    id: 'interactive-map',
    company: 'Maps Inc',
    year: '2024',
    title: 'Interactive Map Demo',
  category: 'JS',
    results: [{ title: 'Fast, location-aware UI with progressive loading' }],
    link: '#',
    github: '#',
    image: map,
  },
  {
    id: 'memoji-computer',
    company: 'Side Project',
    year: '2023',
    title: 'Developer Persona Site',
  category: 'Python',
    results: [{ title: 'Small static site to showcase tooling and posts' }],
    link: '#',
    github: '#',
    image: memojiComputer,
  },
  {
    id: 'memoji-smile',
    company: 'Side Project',
    year: '2022',
    title: 'Experimental UI Kit',
  category: 'C++',
    results: [{ title: 'Reusable components and token system' }],
    link: '#',
    github: '#',
    image: memojiSmile,
  },
]

export default portfolioProjects
