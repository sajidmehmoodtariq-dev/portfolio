'use client'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import CardHeader from '@/components/CardHeader'
import ArrowUprightIcon from "@/assets/icons/arrow-up-right.svg"
import CheckIcon from "@/assets/icons/check-circle.svg"
import { motion } from 'framer-motion'

const certifications = [
    {
        title: "CS50x: Introduction to Computer Science",
        issuer: "Harvard University",
        date: "2025",
        certificateUrl: "https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78",
        description: "Harvard University's introduction to the intellectual enterprises of computer science and the art of programming.",
        skills: [
            "Problem Solving",
            "Data Structures",
            "Algorithms",
            "C Programming",
            "Python Programming",
            "SQL & Databases",
            "Web Development"
        ],
        verified: true
    },
    {
        title: "Web Development",
        issuer: "Punjab University",
        date: "2024",
        certificateUrl: "https://sajidmehmoodtariq.me/EROZGAAR.jpg",
        description: "Punjab University's introduction to the Web Development using programming as well as wordpress.",
        skills: [
            "Wordpress",
            "SQL",
            "PHP",
            "HTML",
            "CSS",
            "JS",
            "TailwindCSS & Bootstrap"
        ],
        verified: true
    },
    {
        title: "Fellowship",
        issuer: "Fluxxion",
        date: "2025",
        certificateUrl: "https://sajidmehmoodtariq.me/fluxxion.png",
        description: "Fluxxion's 2-Months program to give hand's on experience in MERN.",
        skills: [
            "MONGO",
            "Express",
            "React",
            "NodeJS",
            "TailwindCSS",
            "NextJs",
        ],
        verified: true
    }
]

const Certifications = () => {
    return (
        <div id='certifications' className='py-16 lg:py-24'>
            <div className='container'>
                <SectionHeader 
                    eyebrow="Certifications" 
                    title="Professional Certifications" 
                    description="Recognized achievements and certifications that validate my technical expertise and commitment to continuous learning." 
                />
                <div className='mt-12 lg:mt-20'>
                    <div className='flex flex-col gap-8'>
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={cert.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="p-6 md:p-8">
                                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                                        <div className="lg:col-span-2">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="bg-gradient-to-r from-emerald-400 to-sky-400 inline-flex font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text">
                                                        {cert.issuer} • {cert.date}
                                                        {cert.verified && (
                                                            <span className="ml-2 inline-flex items-center">
                                                                <CheckIcon className="size-4 text-emerald-400" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="font-serif text-2xl mt-2 md:text-3xl">{cert.title}</h3>
                                                </div>
                                            </div>
                                            <p className="text-white/70 mb-6">{cert.description}</p>
                                            
                                            <div className="mb-6">
                                                <h4 className="text-white font-semibold mb-3">Skills & Topics Covered:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {cert.skills.map((skill) => (
                                                        <motion.span
                                                            key={skill}
                                                            className="px-3 py-1 bg-gradient-to-r from-emerald-300/10 to-sky-400/10 border border-emerald-300/20 rounded-full text-sm text-white/80"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {skill}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="lg:col-span-1 flex flex-col justify-center">
                                            <motion.div
                                                className="bg-gradient-to-r from-emerald-300 to-sky-400 p-8 rounded-2xl text-center"
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-gray-950 mb-4">
                                                    <div className="text-4xl font-bold mb-2">🎓</div>
                                                    <div className="font-bold text-lg">Certified</div>
                                                    <div className="text-sm opacity-80">{cert.date}</div>
                                                </div>
                                            </motion.div>
                                            
                                            <motion.a 
                                                href={cert.certificateUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="mt-4"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <button className="bg-white text-gray-950 px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center w-full hover:bg-white/90 transition-colors">
                                                    <ArrowUprightIcon className="size-5 mr-2" />
                                                    <span>View Certificate</span>
                                                </button>
                                            </motion.a>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Certifications
