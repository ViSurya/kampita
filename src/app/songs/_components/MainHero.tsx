'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { PlaceHolderImages } from '@/lib/config'
import { formatDuration } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'



function MainHero({ songData: song }: { songData: any }) {
    const [imageLoading, setImageLoading] = useState(true)
    const HandleImageLoad = () => setImageLoading(false)

    return (
        <div>
            <Card className='mb-8 p-0 md:p-4'>
                <CardHeader className='px-4 py-4'>
                    <h1 className='text-2xl font-semibold leading-none tracking-tight'>{song.name} MP3 Song Download</h1>
                    <Separator />
                </CardHeader>
                <CardContent className='p-2 md:p-6 md:flex gap-14'>
                    <div>
                        <>
                        {imageLoading && (
                             <Skeleton className={'relative w-full h-full'} />
                        )}
                            <Image
                                alt={song.name}
                                src={song.image?.[2].url || PlaceHolderImages.song}
                                width={390}
                                height={390}
                                className={`rounded-lg mx-auto h-min  md:size-96 ${imageLoading ? 'opacity-0': ''}`}
                                priority={true}
                                // loading='lazy'
                                onLoad={HandleImageLoad}
                            />
                        </>
                    </div>

                    <div className='flex-grow hidden md:inline'>
                        <dl className='grid grid-cols-2 gap-4'>
                            <div>
                                <dt className='font-semibold'>Artist</dt>
                                <dd>{song.artists?.primary?.[0]?.name || song.artists?.featured?.[0]?.name || song.artists?.all?.[0]?.name || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Type</dt>
                                <dd>{song.type}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Album</dt>
                                <dd>
                                    {song.album?.name || 'N/A'}
                                    {/* {song.album?.url ? (
            <Link href={song.album.url} className='text-blue-500 hover:underline'>
              {song.album.name || 'N/A'}
            </Link>
          ) : (song.album?.name || 'N/A')} */}
                                </dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Year</dt>
                                <dd>{song.year || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Release Date</dt>
                                <dd>{song.releaseDate || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Duration</dt>
                                <dd>{formatDuration(song.duration || 469)}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Language</dt>
                                <dd>{song.language}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Label</dt>
                                <dd>{song.label || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Play Count</dt>
                                <dd>{song.playCount?.toLocaleString() || 'N/A'}</dd>
                            </div>
                            <div>
                                <dt className='font-semibold'>Explicit Content</dt>
                                <dd>{song.explicitContent ? 'Yes' : 'No'}</dd>
                            </div>
                        </dl>
                        <div>
                            <Button className='w-full mt-10'>Download Song</Button>
                        </div>
                    </div>
                    <div className='auto-cols-max md:hidden mt-6 border'>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Artist</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.artists?.primary?.[0]?.name || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Type</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.type}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Album</TableCell>
                                    <TableCell className='md:pl-[10%]'>
                                        {song.album?.name || 'N/A'}
                                        {/* i will add links in  album when album page route section is conpleted so dont remove this comment */}
                                        {/* {song.album?.url ? (
              <Link href={song.album.url} className='text-blue-500 hover:underline'>
                {song.album.name || 'N/A'}
              </Link>
            ) : (song.album?.name || 'N/A')} */}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Year</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.year || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Release Date</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.releaseDate || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Duration</TableCell>
                                    <TableCell className='md:pl-[10%]'>{formatDuration(song.duration || 469)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Language</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.language}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Label</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.label || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Play Count</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.playCount?.toLocaleString() || 'N/A'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='md:pl-[10%]'>Explicit Content</TableCell>
                                    <TableCell className='md:pl-[10%]'>{song.explicitContent ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default MainHero
