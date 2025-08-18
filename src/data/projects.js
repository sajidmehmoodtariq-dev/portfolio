import darkSaasLandingPage from '@/assets/images/dark-saas-landing-page.png'
import lightSaasLandingPage from '@/assets/images/light-saas-landing-page.png'
import aiStartupLandingPage from '@/assets/images/ai-startup-landing-page.png'
import bookCover from '@/assets/images/book-cover.png'
import map from '@/assets/images/map.png'
import memojiComputer from '@/assets/images/memoji-computer.png'
import memojiSmile from '@/assets/images/memoji-smile.png'

const portfolioProjects = [
  {
    id: 'dark-saas',
    company: 'Acme Corp',
    year: '2022',
    title: 'Dark Saas Landing Page',
  category: 'JS',
    results: [
      { title: 'Enhanced user experience by 40%' },
      { title: 'Improved site speed by 50%' },
      { title: 'Increased mobile traffic by 35%' },
    ],
    link: 'https://youtu.be/4k7IdSLxh6w',
    github: 'https://youtu.be/4k7IdSLxh6w',
    image: darkSaasLandingPage,
    pinned: true,
  },
  {
    id: 'light-saas',
    company: 'Innovative Co',
    year: '2021',
    title: 'Light Saas Landing Page',
  category: 'JS',
    results: [
      { title: 'Boosted sales by 20%' },
      { title: 'Expanded customer reach by 35%' },
      { title: 'Increased brand awareness by 15%' },
    ],
    link: 'https://youtu.be/7hi5zwO75yc',
    github: 'https://youtu.be/7hi5zwO75yc',
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
    link: 'https://youtu.be/Z7I5uSRHMHg',
    github: 'https://youtu.be/Z7I5uSRHMHg',
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
