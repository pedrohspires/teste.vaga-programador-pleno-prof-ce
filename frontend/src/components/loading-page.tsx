import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function LoadingPage() {
    return (
        <div className='w-screen h-screen grid place-items-center'>
            <div className='justify-items-center text-gray-300 opacity-80'>
                <AiOutlineLoading3Quarters className='animate-spin size-16' />
                <span className='font-semibold text-lg'>Carregando</span>
            </div>
        </div>
    )
}
