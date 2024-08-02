'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, Plus, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAudio } from '../contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { directoryURLs, placeholderImages } from '@/lib/config';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Song {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  url: string;
  image: Array<{ quality: string; link: string; }>;
  language: string;
  year: string;
  play_count: number;
  explicit: boolean;
  list_count: number;
  list_type: string;
  list: string;
  more_info?: {
    primary_artists: string;
    singers: string;
  };
  artist_map: {
    primary_artists: Array<{ id: string; name: string; url: string; role: string; }>;
    featured_artists: Array<{ id: string; name: string; url: string; role: string; }>;
    artists: Array<{ id: string; name: string; url: string; role: string; }>;
  };
  album: string;
  album_id: string;
  album_url: string;
  label: string;
  origin: string;
  is_dolby_content: boolean;
  '320kbps': boolean;
  download_url: Array<{ quality: string; link: string; }>;
  duration: number;
  rights: {
    code: string;
    cacheable: string;
    delete_cached_object: string;
    reason: string;
  };
  has_lyrics: boolean;
  lyrics_snippet: string;
  starred: boolean;
  copyright_text: string;
  vcode: string;
  vlink: string;
}

interface SearchSongsResponse {
  status: string;
  message: string;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

interface SearchComponentProps {
  title: string;
  initialQuery: string;
  initialResults: Song[];
  initialError: string | null;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  initialQuery,
  initialResults,
  initialError,
  title
}) => {
  const [searchResults, setSearchResults] = useState<Song[]>(initialResults);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);
  const [trendingSearches] = useState<string[]>(['Latest Hits', 'Top 2024 Songs', 'Popular Artists']);

  const { toast } = useToast();
  const { currentTrack, setCurrentTrack, togglePlay, addToQueue } = useAudio();
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const searchQueryRef = useRef<string>(initialQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.kampitamusic.workers.dev/search/songs?q=${encodeURIComponent(query)}&limit=10`);

      if (!res.ok) {
        throw new Error('Failed to fetch songs');
      }

      const data: SearchSongsResponse = await res.json();
      setSearchResults(data.data.results || []);
    } catch (err) {
      console.error('Error searching songs:', err);
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
      router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
    }, 1000);
  }, [performSearch, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    searchQueryRef.current = newQuery;
    if (searchQueryRef.current === '' || searchParams.get('q') === '') {
      router.push('/search')
    } else { debouncedSearch(newQuery); }
  };

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query !== searchQueryRef.current) {
      searchQueryRef.current = query;
      if (inputRef.current) {
        inputRef.current.value = query;
      }
      performSearch(query);
    }
  }, [searchParams, performSearch]);

  const getArtists = useCallback((song: Song): string => {
    return song.subtitle || "Unknown Artist";
  }, []);

  const handlePlay = useCallback((song: Song) => {
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

  const handleAddToQueue = useCallback((song: Song) => {
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

  const renderSongItem = useCallback((song: Song) => (
    <Card key={song.id} className="mb-2 p-0 hover:shadow-md">
      <CardContent className="flex items-center p-2">
        <div className="relative mr-3 flex-shrink-0">
          <Link prefetch={false} href={`${directoryURLs.songs}/${song.id}`} className="block">
            <Image
              src={song.image?.[0]?.link || placeholderImages.song}
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
  ), [handlePlay, handleAddToQueue, getArtists]);

  const SongNotFound = ({initialQuery}  : {initialQuery: string }) =>  (
      <>
        <div className='mx-auto flex items-center dark:font-semibold'>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 font-bold" />
            <AlertTitle className='dark:font-bold dark:text-red-500'>Error: Song Not Found</AlertTitle>
            <AlertDescription className='dark:text-red-400'>
              We couldn&lsquo;t find any results for &ldquo;{initialQuery}&ldquo;. Please try a different search query.
            </AlertDescription>
          </Alert>
        </div>
      </>)
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl lg:text-2xl font-bold mb-4">{title}</h1>

      <Input
        ref={inputRef}
        type="search"
        placeholder="Search for songs"
        defaultValue={searchQueryRef.current}
        onChange={handleInputChange}
        className="mb-4"
      />

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-red-500">{error}</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className='lg:grid lg:grid-cols-2 gap-x-4'>
          {searchResults.length !== 0 ? searchResults.map(renderSongItem) : <SongNotFound initialQuery={searchQueryRef.current} />}
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Trending Searches</h2>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((trend, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = trend;
                  }
                  searchQueryRef.current = trend;
                  debouncedSearch(trend);
                }}
              >
                {trend}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;