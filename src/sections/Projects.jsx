import darkSaasLandingPage from "@/assets/images/dark-saas-landing-page.png";
import lightSaasLandingPage from "@/assets/images/light-saas-landing-page.png";
import aiStartupLandingPage from "@/assets/images/ai-startup-landing-page.png";
import GrainImage from '@/assets/images/grain.jpg'
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUprightIcon from "@/assets/icons/arrow-up-right.svg";
import Image from "next/image";

const portfolioProjects = [
  {
    company: "Acme Corp",
    year: "2022",
    title: "Dark Saas Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/4k7IdSLxh6w",
    Github: "https://youtu.be/4k7IdSLxh6w",
    image: darkSaasLandingPage,
  },
  {
    company: "Innovative Co",
    year: "2021",
    title: "Light Saas Landing Page",
    results: [
      { title: "Boosted sales by 20%" },
      { title: "Expanded customer reach by 35%" },
      { title: "Increased brand awareness by 15%" },
    ],
    link: "https://youtu.be/7hi5zwO75yc",
    Github: "https://youtu.be/7hi5zwO75yc",
    image: lightSaasLandingPage,
  },
  {
    company: "Quantum Dynamics",
    year: "2023",
    title: "AI Startup Landing Page",
    results: [
      { title: "Enhanced user experience by 40%" },
      { title: "Improved site speed by 50%" },
      { title: "Increased mobile traffic by 35%" },
    ],
    link: "https://youtu.be/Z7I5uSRHMHg",
    Github: "https://youtu.be/Z7I5uSRHMHg",
    image: aiStartupLandingPage,
  },
];

const Projects = () => {
  return (
    <section id="projects" className="pb-16 lg:py-24">
      <div className="container">
        <div className="flex justify-center">
          <p className="uppercase font-semibold tracking-widest bg-gradient-to-r from-emerald-400 to-sky-400 text-transparent bg-clip-text">Real World Projects</p>
        </div>
        <p className="font-serif text-3xl text-center md:text-5xl mt-6">Featured Projects</p>
        <p className="text-center text-white/60 mt-4 md:text-large max-w-xl mx-auto lg:text-xl">See how I transformed these projects into success stories. Each project showcases my skills in web development, design, and user experience. Click on the links to view the projects in action.</p>
        <div className="flex flex-col mt-10 gap-20 md:mt-20">
          {
            portfolioProjects.map((project) => (
              <div key={project.title} className="bg-gray-800 z-0 after:z-10 overflow-hidden rounded-3xl relative after:content-[''] after:absolute after:inset-0 outline-2 after:-outline-offset-2 after:rounded-3xl after:outline after:outline-white/20 px-8 pt-8 md:pt-12 md:px-10 after:pointer-events-none">
                <div
                  className='absolute inset-0 -z-10 opacity-5'
                  style={{ backgroundImage: `url(${GrainImage.src})` }}
                ></div>
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <div>
                    <div className="bg-gradient-to-r from-emerald-400 gap-2 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-serif text-2xl mt-2 md:text-4xl md:mt-5">{project.title}</h3>
                    <hr className="border-t-2 border-white/5 mt-4 md:mt-5" />
                    <ul className="mt-4 flex flex-col gap-4 md:mt-5">
                      {project.results.map((result) => (
                        <li key={result.title} className="flex gap-2 text-sm md:text-base text-white/50 ">
                          <CheckIcon className="size-5 md:size-6" />
                          <span>{result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-4 mt-6 mb-4 flex-col sm:flex-row">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <button className="bg-white p-2 md:px-6 text-gray-950 h-12 w-full rounded-xl font-semibold inline-flex items-center justify-center">
                          <ArrowUprightIcon className="size-5 mr-2" />
                          <span>Visit Live Site</span>
                        </button>
                      </a>
                      <a href={project.Github} target="_blank" rel="noopener noreferrer">
                        <button className="text-white p-2 md:px-6 bg-gray-950 h-12 w-full rounded-xl font-semibold inline-flex items-center justify-center">
                          <ArrowUprightIcon className="size-5 mr-2" />
                          <span>Visit on GitHub</span>
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className="-mr-24">
                    <Image src={project.image} className="mt-8 -mb-4 md:-mb-0" alt={project.title} />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="mt-16 text-center">
        <p className="text-white/60">Want to see more of my work? Check out my <a href="/projects" className="text-emerald-400 hover:underline">Projects</a>.</p>
      </div>
    </section>
  );
}

export default Projects