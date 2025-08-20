import GrainImage from '@/assets/images/grain.jpg'
import {twMerge} from "tailwind-merge"

const Card = ({className,children,...other}) => {
    return (
        <>
            <div className={twMerge("bg-gray-800 z-0 after:z-10 overflow-hidden rounded-3xl relative after:content-[''] after:absolute after:inset-0 outline-2 after:-outline-offset-2 after:rounded-3xl after:outline after:outline-white/20 after:pointer-events-none",className)}
            {...other}>
                <div
                    className='absolute inset-0 -z-10 opacity-5'
                    style={{ backgroundImage: `url(${GrainImage.src})` }}
                ></div>
                {children}
            </div>
        </>
    )
}

export default Card