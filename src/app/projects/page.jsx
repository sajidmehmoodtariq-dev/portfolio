import Header from '@/sections/Header'
import React from 'react'
import portfolioProjects from '@/data/projects'
import Card from '@/components/Card'
import Image from 'next/image'
import ArrowUprightIcon from '@/assets/icons/arrow-up-right.svg'

const ProjectsPage = () => {
  const pinned = portfolioProjects.filter(p => p.pinned).slice(0,3)
  const others = portfolioProjects.filter(p => !p.pinned)

  // group others by category
  const categories = others.reduce((acc, p) => {
    const key = p.category || 'Other'
    acc[key] = acc[key] || []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <>
      <Header />

      <main className="container py-20">
        <h1 className="font-serif text-4xl md:text-6xl">Projects</h1>
        <p className="text-white/60 mt-4 max-w-2xl">A curated collection of projects — pinned highlights first, then organized by category. Click through to view live demos or source.</p>

        {/* Pinned */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Featured</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pinned.map(p => (
              <Card key={p.id} className="p-4">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="text-sm uppercase font-semibold text-emerald-400">{p.company} • {p.year}</div>
                    <h3 className="font-serif text-xl mt-2">{p.title}</h3>
                    <p className="text-white/60 mt-3 text-sm">{p.results?.[0]?.title || ''}</p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a href={p.link} target="_blank" rel="noreferrer" className="w-full">
                      <button className="bg-white text-gray-950 rounded-xl w-full h-10 inline-flex items-center justify-center">
                        <ArrowUprightIcon className="size-4 mr-2" />
                        Live
                      </button>
                    </a>
                    <a href={p.github} target="_blank" rel="noreferrer" className="w-full">
                      <button className="bg-gray-900 border border-white/10 rounded-xl w-full h-10">Source</button>
                    </a>
                  </div>
                  <div className="mt-4 -mr-4">
                    <Image src={p.image} alt={p.title} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

  {/* Categorized lists (by language) */}
        <section className="mt-12">
          {Object.keys(categories).map(cat => (
            <div key={cat} className="mt-10">
              <h3 className="text-xl font-semibold">{cat}</h3>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories[cat].map(p => (
                  <Card key={p.id} className="p-6">
                    <div className="lg:grid lg:grid-cols-3 gap-6 items-center">
                      <div className="lg:col-span-2">
                        <div className="text-sm uppercase font-semibold text-emerald-400">{p.company} • {p.year}</div>
                        <h4 className="font-serif text-2xl mt-2">{p.title}</h4>
                        <ul className="mt-3 text-white/60 text-sm">
                          {p.results?.map(r => (
                            <li key={r.title} className="mt-2">• {r.title}</li>
                          ))}
                        </ul>
                        <div className="mt-4 flex gap-3">
                          <a href={p.link} target="_blank" rel="noreferrer">
                            <button className="bg-white text-gray-950 rounded-xl h-10 inline-flex items-center px-4">
                              <ArrowUprightIcon className="size-4 mr-2" />
                              Live
                            </button>
                          </a>
                          <a href={p.github} target="_blank" rel="noreferrer">
                            <button className="bg-gray-900 border border-white/10 rounded-xl h-10 px-4">Source</button>
                          </a>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <Image src={p.image} alt={p.title} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}

export default ProjectsPage