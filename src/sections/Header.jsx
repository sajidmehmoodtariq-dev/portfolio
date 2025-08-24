import React from 'react'

const Header = () => {
  return (
    <header className='flex justify-center items-center fixed top-3 w-full z-10'>
      <nav className='flex gap-1 p-0.5 border-white/15 rounded-full bg-white/10 backdrop-blur'>
        <a href="/" className='nav-item'>Home</a>
        <a href="/#projects" className='nav-item'>Projects</a>
        <a href="/#testimonials" className='nav-item'>Testimonials</a>
        <a href="/#about" className='nav-item'>About</a>
        <a href="/blogs" className='nav-item'>Blog</a>
        <a href="/contact" className='nav-item bg-white text-gray-900 hover:bg-white/70 hover:text-gray-900'>Contact</a>
      </nav>
    </header>
  )
}

export default Header