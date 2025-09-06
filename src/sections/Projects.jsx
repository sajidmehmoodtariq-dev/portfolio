'use client';

import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUprightIcon from "@/assets/icons/arrow-up-right.svg";
import { useState, useEffect } from 'react';

// Import project images
import portal from '@/assets/images/portal.png';
import lightSaasLandingPage from '@/assets/images/light-saas-landing-page.png';
import aiStartupLandingPage from '@/assets/images/ai-startup-landing-page.png';
import anonymous from '@/assets/images/anonymous.png';

// Image mapping
const imageMap = {
  'portal.png': portal,
  'light-saas-landing-page.png': lightSaasLandingPage,
  'ai-startup-landing-page.png': aiStartupLandingPage,
  'anonymous.png': anonymous
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects/config', { cache: 'no-store' });
        const data = await response.json();
        
        if (data.success && data.portfolioProjects) {
          const visibleProjects = data.portfolioProjects
            .filter(project => project.visible && project.pinned)
            .sort((a, b) => a.order - b.order)
            .slice(0, 4);
          setProjects(visibleProjects);
        } else {
          // Fallback to default projects if API fails
          console.warn('Failed to load projects from API, using fallback');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section id="projects" className="pb-16 lg:py-24">
      <div className="container">
        <SectionHeader 
          eyebrow="Real World Projects" 
          title="Featured Projects" 
          description="See how I transformed these projects into success stories. Each project showcases my skills in web development, design, and user experience. Click on the links to view the projects in action." 
        />
        
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        ) : (
          <div className="flex flex-col mt-10 gap-20 md:mt-20">
            {projects.map((project, projectIndex) => (
              <Card key={project.id} className="px-8 pt-8 md:pt-12 md:px-10 pb-0 sticky"
              style={{
                top: `calc(64px + ${projectIndex * 40}px)`
              }}
              >
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <div>
                    <div className="bg-gradient-to-r from-emerald-400 gap-2 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                      <span>{project.company}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-serif text-2xl mt-2 md:text-4xl md:mt-5 text-gray-900 transition-colors duration-500">{project.title}</h3>
                    <hr className="border-t-2 border-gray-300 mt-4 md:mt-5 transition-colors duration-500" />
                    <ul className="mt-4 flex flex-col gap-4 md:mt-5">
                      {project.results?.map((result, index) => (
                        <li key={index} className="flex gap-2 text-sm md:text-base text-gray-600 transition-colors duration-500">
                          <CheckIcon className="size-5 md:size-6" />
                          <span>{result.title}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-4 mt-6 mb-4 flex-col sm:flex-row">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <button className="bg-white p-2 md:px-6 text-gray-900 h-12 w-full rounded-xl font-semibold inline-flex items-center justify-center border border-gray-300 transition-colors duration-300">
                          <ArrowUprightIcon className="size-5 mr-2" />
                          <span>Visit Live Site</span>
                        </button>
                      </a>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <button className="text-gray-900 p-2 md:px-6 bg-gray-100 h-12 w-full rounded-xl font-semibold inline-flex items-center justify-center border border-gray-300 transition-colors duration-300">
                            <ArrowUprightIcon className="size-5 mr-2" />
                            <span>Visit on GitHub</span>
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="-mr-24">
                    {imageMap[project.image] && (
                      <Image src={imageMap[project.image]} className="mt-8 -mb-6 rounded-3xl" alt={project.title} />
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {projects.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No featured projects configured</div>
                <div className="text-sm text-gray-600 mt-2">Visit the admin dashboard to configure your projects</div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-16 text-center">
        <p className="text-gray-700">Want to see more of my work? Check out my <a href="/projects" className="underline hover:text-emerald-500 transition-colors duration-300">Projects</a>.</p>
      </div>
    </section>
  );
}


export default Projects