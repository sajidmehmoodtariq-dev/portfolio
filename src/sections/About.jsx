import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import StarIcon from "@/assets/icons/star.svg"
import bookImage from "@/assets/images/book-cover.png"
import Image from 'next/image'
import JavaScriptIcon from "@/assets/icons/square-js.svg"
import ReactIcon from "@/assets/icons/react.svg"
import GithubIcon from "@/assets/icons/github.svg"
import ChromeIcon from "@/assets/icons/chrome.svg"
import NextIcon from "@/assets/icons/next.svg"
import CodeIcon from "@/assets/icons/code.svg"
import TailwindIcon from "@/assets/icons/tailwind.svg"
import MongoIcon from "@/assets/icons/mongodb.svg"
import PostmanIcon from "@/assets/icons/postman.svg"
import MapImage from "@/assets/images/map.png"
import SmileImage from "@/assets/images/memoji-smile.png"
import CardHeader from '@/components/CardHeader'
import ToolBoxItems from '@/components/ToolBoxItems'


const toolboxItems = [
    {
        title: "JavaScript",
        icon: JavaScriptIcon
    },
    {
        title: "Nextjs",
        icon: NextIcon
    },
    {
        title: "React",
        icon: ReactIcon
    },
    {
        title: "Tailwind css",
        icon: TailwindIcon
    },
    {
        title: "MongoDB",
        icon: MongoIcon
    },
    {
        title: "Postman",
        icon: PostmanIcon
    },
    {
        title: "Vscode",
        icon: CodeIcon
    },
    {
        title: "Github",
        icon: GithubIcon
    },
    {
        title: "Chrome",
        icon: ChromeIcon
    }
]

const hobbies = [
    {
        title: "Coding",
        emoji: "🧑‍💻",
        top: "5%",
        left: "5%"
    },
    {
        title: "Gaming",
        emoji: "🎮",
        top: "5%",
        left: "50%"
    },
    {
        title: "Photography",
        emoji: "📸",
        top: "35%",
        left: "10%"
    },
    {
        title: "Hiking",
        emoji: "🧗",
        top: "65%",
        left: "65%"
    },
    {
        title: "Music",
        emoji: "🎼",
        top: "35%",
        left: "70%"
    },
    {
        title: "Reading",
        emoji: "📚",
        top: "65%",
        left: "5%"
    },
    {
        title: "Badminton",
        emoji: "🏸",
        top: "35%",
        left: "40%"
    },
]

const About = () => {
    return (
        <div id='about' className='py-20'>
            <div className='container'>
                <SectionHeader eyebrow="About" title="A Glimpse into my World" description="Learn more about who I am, what I do, and what inspires me." />
                <div className='mt-20 flex flex-col gap-8'>
                    <div className='md:grid md:grid-cols-5 lg:grid-cols-3 md:gap-8'>
                        <Card className="h-[320px] md:col-span-2 lg:col-span-1">
                            <CardHeader title="My Reads" description="Explore the books shaping my prespectives" />
                            <div className='w-40 mx-auto mt-8'>
                                <Image src={bookImage} alt='Book Cover' />
                            </div>
                        </Card>
                        <Card className="h-[320px] p-0 md:col-span-3 lg:col-span-2">
                            <div>
                                <CardHeader title="My ToolBox" description="Explore the technologies and tools used to craft exceptional digital experiences."
                                />
                            </div>
                            <ToolBoxItems toolboxItems={toolboxItems} className="mt-6" />
                            <ToolBoxItems toolboxItems={toolboxItems} className="mt-6 " itemsWrapperClassName="-translate-x-1/2" />
                        </Card>
                    </div>
                    <div className='md:grid md:grid-cols-5 md:gap-8 lg:grid-cols-3'>
                        <Card className="h-[320px] p-0 flex flex-col md:col-span-3 lg:col-span-2">
                            <CardHeader title="Beyond the code" description="Explore my intrests beyond the digital realm" className="px-6 py-6" />
                            <div className='relative flex-1'>
                                {
                                    hobbies.map(hobby => (
                                        <div key={hobby.title} className='inline-flex gap-2 px-6 bg-gradient-to-r items-center from-emerald-300 to-sky-400 rounded-full py-1.5 absolute'
                                            style={{
                                                left: hobby.left,
                                                top: hobby.top
                                            }}>
                                            <span className='font-me text-gray-950'>{hobby.title}</span>
                                            <span>{hobby.emoji}</span>
                                        </div>
                                    ))
                                }
                            </div>

                        </Card>
                        <Card className="h-[320px] p-0 relative md:col-span-2 lg:col-span-1">
                            <Image src={MapImage} alt='map' className='h-full w-full object- object-left-top' />
                            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400  after:content-[""] after:absolute after:inset-0 after:outline-2 after:aoutline-offset-2 after:rounded-full after:outline-gray-950/30'>
                                <Image src={SmileImage} alt='smile' className='size-20' />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About