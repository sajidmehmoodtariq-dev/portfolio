import ArrowUprightIcon from "@/assets/icons/arrow-up-right.svg"

const Contact = () => {
    return (
        <div className="py-16 pt-14 lg:py-24 lg:pt-20" id="about">
            <div className="container">
                <div className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 py-8 px-10 rounded-3xl text-center md:text-left flex flex-col gap-8 md:flex-row items-center justify-around">
                    <div>
                        <h2 className="font-serif text-2xl">Lets create something amazing together</h2>
                        <p className="text-sm mt-2">Ready to bring your next project to life? Let's connect and discuss how i can help u achieve your goals.</p>
                    </div>
                    <button className="text-white rounded-full bg-gray-900 inline-flex items-center px-6 h-12 gap-2">
                        <span className="font-semibold">
                            <a href="/contact">Contact Me</a>
                        </span>
                        <ArrowUprightIcon className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Contact