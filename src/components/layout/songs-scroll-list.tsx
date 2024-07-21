'use client'
import React, { useRef } from 'react'
import { SongCard, SongCardProps } from '@/components/layout/song-card'
import { Separator } from '@/components/ui/separator'
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

interface SongListProps {
  HeadingName: string
  songCards: SongCardProps[]
}

const SongList: React.FC<SongListProps> = ({ HeadingName, songCards }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollContainer) {
      const scrollAmount = scrollContainer.clientWidth * 1
      const newScrollPosition = direction === 'left'
        ? scrollContainer.scrollLeft - scrollAmount
        : scrollContainer.scrollLeft + scrollAmount
      scrollContainer.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      })
    }
  }


  return (
    <div>
      <div className="flex justify-between">
        <h2 className='text-xl lg:text-2xl'>{HeadingName}</h2>
        <div className='flex gap-4'>
          <MoveLeftIcon
            className='cursor-pointer'
            onClick={() => handleScroll('left')}
          />
          <MoveRightIcon
            className='cursor-pointer lg:mr-10'
            onClick={() => handleScroll('right')}
          />
        </div>
      </div>
      <Separator className="mb-2" />
      <ScrollArea ref={scrollAreaRef}>
        <div
          className='flex space-x-2 lg:space-x-4 pb-4'
          style={{ minWidth: 'max-content' }}
        >
          {songCards.map((songCard) => (
            <div key={songCard.id} className="flex-shrink-0">
              <SongCard {...songCard} />
            </div>
          ))}
        </div>
        <ScrollBar orientation='horizontal'/>
      </ScrollArea>
    </div>
  )
}

export default SongList