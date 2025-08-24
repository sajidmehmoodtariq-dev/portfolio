import darkSaasLandingPage from '@/assets/images/dark-saas-landing-page.png'
import lightSaasLandingPage from '@/assets/images/light-saas-landing-page.png'
import aiStartupLandingPage from '@/assets/images/ai-startup-landing-page.png'
import bookCover from '@/assets/images/book-cover.png'

const portfolioProjects = [
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
    link: 'https://feedback-five-topaz.vercel.app/send-message/sajidmehmood',
    github: 'https://github.com/sajidmehmoodtariq-dev/feedback-next',
    image: bookCover, // Placeholder, update with a relevant image if available
    pinned: false,
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
    id: 'sajidmehmood',
    company: 'Self',
    year: '2024',
    title: 'Portfolio',
  category: 'Threejs',
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
]

export default portfolioProjects
