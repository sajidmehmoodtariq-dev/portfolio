import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUprightIcon from "@/assets/icons/arrow-up-right.svg";
import portfolioProjects from '@/data/projects'

const Projects = () => {
  return (
    <section id="projects" className="pb-16 lg:py-24">
      <div className="container">
        <SectionHeader eyebrow="Real World Projects" title="Featured Projects" description="See how I transformed these projects into success stories. Each project showcases my skills in web development, design, and user experience. Click on the links to view the projects in action." />
        <div className="flex flex-col mt-10 gap-20 md:mt-20">
          {
            // show only pinned (featured) projects on the main page
            portfolioProjects.filter(p => p.pinned).slice(0,3).map((project) => (
              <Card key={project.id || project.title} className="px-8 pt-8 md:pt-12 md:px-10 pb-0">
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
                      {project.results?.map((result) => (
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
                      <a href={project.github || project.Github} target="_blank" rel="noopener noreferrer">
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
              </Card>
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