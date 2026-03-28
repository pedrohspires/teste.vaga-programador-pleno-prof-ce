import { BiDotsVertical } from 'react-icons/bi'
import CustomDropdown from '../components/ui/dropdown'
import type { ChildrenType } from '../services/global'

function TableDropdown({ children }: ChildrenType) {
    return (
        <div className='inline-block'>
            <CustomDropdown>
                <CustomDropdown.Trigger>
                    <div className='p-2 bg-blue-100 w-fit aspect-square rounded-full'>
                        <BiDotsVertical />
                    </div>
                </CustomDropdown.Trigger>
                <CustomDropdown.Content>
                    <div className='space-y-1'>
                        {children}
                    </div>
                </CustomDropdown.Content>
            </CustomDropdown>
        </div>
    )
}

TableDropdown.Option = ({ children, handleClick }: ChildrenType & { handleClick: () => void | Promise<void> }) => (
    <div onClick={handleClick} className='flex gap-2 items-center justify-center py-1 rounded-md border-b-1 border-b-blue-50 cursor-pointer min-w-36 hover:bg-blue-50 text-sm'>
        {children}
    </div>
)

export default TableDropdown