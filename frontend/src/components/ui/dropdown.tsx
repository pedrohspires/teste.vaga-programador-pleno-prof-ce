import { DropdownMenu } from '@radix-ui/themes'
import { type ReactNode } from 'react'

const CustomDropdown = ({ children }: { children: ReactNode }) => {
    return (
        <DropdownMenu.Root >
            {children}
        </DropdownMenu.Root>
    )
}

CustomDropdown.Trigger = ({ children }: { children: ReactNode }) => {
    return (
        <DropdownMenu.Trigger>
            {children}
        </DropdownMenu.Trigger>
    )
}

CustomDropdown.Content = ({ children }: { children: ReactNode }) => {
    return (
        <DropdownMenu.Content align='center'>
            {children}
        </DropdownMenu.Content>
    )
}

export default CustomDropdown;