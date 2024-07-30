'use client'
import React, { useCallback } from 'react';
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { directoryURLs, placeholderImages } from '@/lib/config';
import Image from 'next/image';
import { PlayCircle, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useAudio } from '@/app/contexts/AudioContext';
import { useToast } from '../ui/use-toast';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';



interface ImageItem {
  quality: string;
  link: string;
}

interface Artist {
  id: string;
  name: string;
  url: string;
  role: string;
  type: string;
  image: ImageItem[];
}

interface TrendingSong {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  url: string;
  image: ImageItem[];
  language: string;
  year: number;
  play_count: number;
  explicit: boolean;
  list_count: number;
  list_type: string;
  list: string;
  artist_map?: {
    artists?: Artist[];
    featured_artists?: Artist[];
    primary_artists?: Artist[];
  };
  album: string;
  album_id: string;
  album_url: string;
  label: string;
  label_url: string;
  origin: string;
  is_dolby_content: boolean;
  '320kbps': boolean;
  download_url: { quality: string; link: string }[];
  duration: number;
  rights: { code: string; cacheable: boolean; delete_cached_object: boolean; reason: string };
  has_lyrics: boolean;
  lyrics_snippet: string;
  starred: boolean;
  copyright_text: string;
  release_date: string;
  triller_available: boolean;
}

interface TrendingSongsProps {
  songs: TrendingSong[];
}

const TrendingSongs: React.FC<TrendingSongsProps> = ({ songs }) => {
  const { currentTrack, setCurrentTrack, togglePlay, addToQueue } = useAudio();
  const { toast } = useToast()

  const getArtists = useCallback((song: TrendingSong): string => {
    const artists = song.artist_map?.primary_artists || song.artist_map?.featured_artists || song.artist_map?.artists;
    return artists ? artists.map((a: Artist) => a.name).join(", ") : "Unknown Artist";
  }, []);

  const handlePlay = useCallback((song: TrendingSong) => {
    const track = {
      id: song.id,
      name: song.name,
      artist: getArtists(song),
      url: song.download_url?.[2]?.link || "",
      image: song.image?.[0]?.link || placeholderImages.song,
      previewImage: song.image?.[2]?.link || placeholderImages.song,
    };
    if (currentTrack?.id === song.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
    }
    toast({ title: "Now Playing", description: `${song.name} - ${getArtists(song)}` });
  }, [currentTrack, setCurrentTrack, togglePlay, toast, getArtists]);

  const handleAddToQueue = useCallback((song: TrendingSong) => {
    const track = {
      id: song.id,
      name: song.name,
      artist: getArtists(song),
      url: song.download_url?.[0]?.link || "",
      image: song.image?.[0]?.link || placeholderImages.song,
      previewImage: song.image?.[2]?.link || placeholderImages.song,
    };
    addToQueue(track);
    toast({ title: "Added to Queue", description: `${song.name} - ${getArtists(song)}` });
  }, [addToQueue, toast, getArtists]);

  return (
    <div className='lg:grid lg:grid-cols-2 gap-x-4 duration-1000'>
      {songs.map((song) => {
        return (
          song.type === "song" && (
            <Card key={song.id} className="mb-2 p-0">
              <CardContent className="flex items-center p-2">
                <div className="relative mr-3 flex-shrink-0">
                  <Link prefetch={false} href={`${directoryURLs.songs}/${song.id}`} className="block">
                    <Image
                      src={song.image?.[0]?.link ? song.image?.[0]?.link : placeholderImages.song}
                      alt={song.name}
                      width={40}
                      height={40}
                      className="object-cover rounded hover:shadow-lg"
                    />
                  </Link>
                </div>
                <div className="flex-grow overflow-hidden mr-2">
                  <Link prefetch={false} href={`${directoryURLs.songs}/${song.id}`} className="block hover:underline">
                    <h3 className="font-semibold text-sm truncate">{song.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-600 truncate">{getArtists(song)}</p>
                </div>
                <div className="flex space-x-1">
                  <Button size="icon" variant="outline" onClick={() => handlePlay(song)}>
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleAddToQueue(song)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )

      })}
    </div>
  );
}

export default TrendingSongs;
