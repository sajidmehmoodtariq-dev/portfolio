import React from 'react'

const SectionHeader = ({
    title,
    eyebrow,
    description
}) => {
    return (
        <>
            <div className="flex justify-center">
                <p className="uppercase font-semibold tracking-widest bg-gradient-to-r from-emerald-400 to-sky-400 text-transparent bg-clip-text">
                    {eyebrow}
                </p>
            </div>
            <h2 className="font-serif text-3xl text-center md:text-5xl mt-6">{title}</h2>
            <p className="text-center text-white/60 mt-4 md:text-large max-w-xl mx-auto lg:text-xl">{description}</p>
        </>
    )
}

export default SectionHeader