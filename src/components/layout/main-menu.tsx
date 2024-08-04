"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
import { ListMusic, SearchIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from './theme-toggle'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MobileNav } from './mobile-nav'

function MainMenu() {
    const [searchValue, setSearchValue] = React.useState('')

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const router = useRouter()

    return (
        <>
            <nav className='flex justify-between w-full  p-2'>
                <Link href={'/'}>
                    <div className='flex gap-2 my-2 text-lg lg:text-xl'>
                        <ListMusic className='size-6 lg:size-7' />
                        <span className='font-bold' >PagalWorld</span>
                    </div>
                </Link>
                <div className='lg:flex hidden'>
                    <Input
                        placeholder='Search something...'
                        type='search'
                        value={searchValue}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                               if (searchValue !== '') {
                                router.push(`/search?q=${encodeURIComponent(searchValue)}`, { scroll: false });
                               }
                            }
                        }}
                        className='w-40 lg:w-96'
                    />
                    <div className='relative right-8 size-max'>
                        <SearchIcon className='size-6 my-2' />
                    </div>
                </div>
                <div>
                    <ModeToggle />
                </div>
            </nav>
            <Separator className='h-[1.5px]' />
            <MobileNav />
        </>
    )
}

export default MainMenu
