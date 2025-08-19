import TechIcon from '@/components/TechIcon'
import { twMerge } from 'tailwind-merge'

const ToolBoxItems = ({ toolboxItems,className,itemsWrapperClassName }) => {
    return (
        <div className={twMerge('flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',className)}>
            <div className={twMerge('flex flex-none py-0.5 gap- pr-6',itemsWrapperClassName)}>
                {toolboxItems.map(item => (
                    <div key={item.title} className='inline-flex items-center gap-4 py-2 px-3 outline-2 outline-white/10 rounded-lg'>
                        <TechIcon component={item.icon} />
                        <span className='font-semibold'>{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ToolBoxItems