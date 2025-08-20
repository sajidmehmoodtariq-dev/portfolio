import memojiImage from '@/assets/images/memoji-computer.png'
import ArrowDown from '@/assets/icons/arrow-down.svg'
import GrainImage from '@/assets/images/grain.jpg'
import StarIcon from '@/assets/icons/star.svg'
import SparkleIcon from '@/assets/icons/sparkle.svg'
import Image from 'next/image'
import HeroOrbit from '@/components/HeroOrbit'

const Hero = () => {
  return (
    <div className='py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip'>
      <div className='absolute inset-0 [mask-image:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,1))]'>
        <div
          className='absolute inset-0 -z-30 opacity-5'
          style={{ backgroundImage: `url(${GrainImage.src})` }}
        ></div>
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>
        <HeroOrbit size={430} rotation={-14} orbitDuration='30s' spinDuration='6s'>
          <SparkleIcon className="size-8 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={440} rotation={78} orbitDuration='32s' spinDuration='6s'>
          <SparkleIcon className="size-5 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={520} rotation={-41} orbitDuration='34s'>
          <div className="size-2 bg-emerald-300/20 rounded-full"></div>
        </HeroOrbit>
        <HeroOrbit size={530} rotation={178} orbitDuration='36s' spinDuration='6s'>
          <SparkleIcon className="size-10 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={550} rotation={20} orbitDuration='38s' spinDuration='8s'>
          <StarIcon className="size-12 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={590} rotation={98} orbitDuration='40s' spinDuration='8s'>
          <StarIcon className="size-8 text-emerald-300" />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5} orbitDuration='42s'>
          <div className="size-2 bg-emerald-300/20 rounded-full"></div>
        </HeroOrbit>
        <HeroOrbit size={710} rotation={144} orbitDuration='44s' spinDuration='6s'>
          <SparkleIcon className="size-14 text-emerald-300/20" />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={85} orbitDuration='46s'>
          <div className="size-3 bg-emerald-300/20 rounded-full"></div>
        </HeroOrbit>
        <HeroOrbit size={800} rotation={-72} orbitDuration='48s' spinDuration='8s'>
          <StarIcon className="size-28 text-emerald-300" />
        </HeroOrbit>
      </div>
      <div className="">
        <div className='flex flex-col items-center justify-center'>
          <Image src={memojiImage} className='size-[100px]' alt="Person peaking from behind the laptop" />
          <div className='bg-gray-950 border-gray-800 px-4 py-1.5 inline-flex items-center gap-4 rounded-lg'>
            <div className='bg-green-500 size-2.5 rounded-full relative'>
              <div className='absolute inset-0 size-2.5 bg-green-500 rounded-full animate-ping'></div>
            </div>
            <div className='text-sm font-medium'>Available for new Projects</div>
          </div>
          <div className='max-w-lg mx-auto'>
            <h1 className='font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide'>Sajid Mehmood Tariq</h1>
            <p className='mt-4 text-center md:text-lg text-white/60'>Building Exceptional User Experience. I specialize in transforming designs into functional, high-performing web applications.</p>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-center items-center mt-8 gap-4'>
          <button className='inline-flex items-center gap-2 border border-white/15 px-6 h-12  rounded-xl'>
            <span className='font-semibold'>Explore My Work</span>
            <ArrowDown className="size-4" />
          </button>
          <button className='inline-flex items-center gap-2 border border-white bg-white text-gray-950 px-6 h-12 rounded-xl'>
            <span>👋</span>
            <span>Let's Connect</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero