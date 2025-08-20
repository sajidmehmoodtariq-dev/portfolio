import About from "@/sections/About"
import Contact from "@/sections/Contact"
import Footer from "@/sections/Footer"
import Header from "@/sections/Header"
import Hero from "@/sections/Hero"
import Projects from "@/sections/Projects"
import Tape from "@/sections/Tape"
import Testimonials from "@/sections/Testimonials"
import Certifications from "@/sections/Certifications"
import Achievements from "@/sections/Achievements"


const page = () => {
  return (
    <>
      <Header />
      <Hero />
      <Projects />
      <Tape />
      <Testimonials />
      <About />
      <Certifications />
      <Achievements />
      <Contact />
      <Footer />
    </>
  )
}

export default page