'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { placeholderImages } from '@/lib/config'
import { formatDuration } from '@/lib/utils'
import { ListMusic, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useAudio } from "@/app/contexts/AudioContext";
import { useToast } from "@/components/ui/use-toast"
import { Toast } from "@/components/ui/toast"

type songType = {
  id: string;
  name: string;
  type: string;
  year: string | null;
  releaseDate: string | null;
  duration: number;
  label: string | null;
  explicitContent: boolean;
  playCount: number | null;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  lyrics: {
    lyrics: string;
    copyright: string;
    snippet: string;
  };
  url: string;
  copyright: string | null;
  album: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
  artists: {
    primary: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      image: Array<{
        quality: string;
        url: string;
      }>;
      url: string;
    }>;
    featured: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      image: Array<{
        quality: string;
        url: string;
      }>;
      url: string;
    }>;
    all: Array<{
      id: string;
      name: string;
      role: string;
      type: string;
      image: Array<{
        quality: string;
        url: string;
      }>;
      url: string;
    }>;
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
}

function MainHero({ songData: song }: { songData: songType }) {
  const { toast } = useToast()
  const [imageLoading, setImageLoading] = useState(true)
  const HandleImageLoad = () => setImageLoading(false)
  const { setCurrentTrack, togglePlay, isPlaying, currentTrack, addToQueue } = useAudio();

  const uniqueArtists = () => {
    const seen = new Set();
    return (song.artists.primary || song.artists.featured || song.artists.all)
      .filter((artist) => {
        const artistName = artist.name || "Unknown Artist";
        const duplicate = seen.has(artistName);
        seen.add(artistName);
        return !duplicate;
      })
      .map(artist => artist.name || "Unknown Artist"); // Add this line to map to names
  };



  const handlePlay = () => {
    const track = {
      id: song.id,
      name: song.name,
      artist: uniqueArtists().join(', '),
      url: song.downloadUrl[2].url,
      image: song.image[0].url || placeholderImages.song,
      previewImage: song.image[2].url || placeholderImages.song,
    };
    if (currentTrack?.id === song.id) {
      togglePlay();
      toast({
        title: isPlaying ? "Paused" : "Playing",
        description: `${song.name}`,
      })
    } else {
      setCurrentTrack(track);
      toast({
        duration: 1500,
        title: "Now Playing",
        description: `${song.name}`,
      })
    }
  }

  const handleQueue = () => {
    const track = {
      id: song.id,
      name: song.name,
      artist: uniqueArtists().join(', '),
      url: song.downloadUrl[2].url,
      image: song.image[0].url || placeholderImages.song,
      previewImage: song.image[2].url || placeholderImages.song,
    };
    addToQueue(track);
    toast({
      duration: 1500,
      title: "Added to Queue",
      description: `${song.name}`,
    })
  }

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
              <img
                alt={song.name}
                src={song.image?.[2].url || placeholderImages.song}
                width={390}
                height={390}
                className={`rounded-lg mx-auto h-min  md:size-96 ${imageLoading ? 'opacity-0' : ''}`}
                // priority={true}
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
            <div className='flex gap-4'>
              <Button onClick={handlePlay} className='w-full mt-10'><PlayCircle className='mr-2' /> Play Song</Button>
              <Button onClick={handleQueue} className='w-full mt-10'><ListMusic className='mr-2' />Add to Queue</Button>
            </div>
          </div>
          <div className='md:hidden'>
            <div className='flex gap-4 justify-center'>
              <Button onClick={handlePlay} className='w-full max-w-[200px] mt-4'><PlayCircle className='mr-2' /> Play Song</Button>
              <Button onClick={handleQueue} className='w-full max-w-[200px] mt-4'><ListMusic className='mr-2' />Add to Queue</Button>
            </div>
            <div className='auto-cols-max mt-6 border'>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MainHero
