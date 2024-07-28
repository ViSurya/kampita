'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { searchSongs } from '@/lib/fetch';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, Plus, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAudio } from '../contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { decodeHtmlEntitiesInJson } from '@/lib/utils';
import { directoryURLs, placeholderImages } from '@/lib/config';
import Link from 'next/link';

interface Song {
  id: string;
  name: string;
  type: string;
  year?: string;
  artists: {
    primary?: Array<{ id: string; name: string; }>;
    featured?: Array<{ id: string; name: string; }>;
    all?: Array<{ id: string; name: string; }>;
  };
  image?: Array<{ quality: string; url: string; }>;
  downloadUrl?: Array<{ quality: string; url: string; }>;
}

interface SearchSongsResponse {
  data: {
    results: Song[];
  };
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}



const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingSearches] = useState<string[]>(['Latest Hits', 'Top 2024 Songs', 'Popular Artists']);
  const { toast } = useToast();
  const { currentTrack, setCurrentTrack, togglePlay, addToQueue } = useAudio();
  const searchParams = useSearchParams();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res: SearchSongsResponse = await searchSongs({ query, limit: 10 })
        .then(data => decodeHtmlEntitiesInJson(data));
      setSearchResults(res.data.results || []);
    } catch (error) {
      console.error('Error searching songs:', error);
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      handleSearch(query);
    }
  }, [searchParams, handleSearch]);

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 1000); // 1000ms delay after user stops typing
  }, [handleSearch]);

  const getArtists = useCallback((song: Song): string => {
    const artists = song.artists.primary || song.artists.featured || song.artists.all;
    return artists ? artists.map(a => a.name).join(", ") : "Unknown Artist";
  }, []);

  const handlePlay = useCallback((song: Song) => {
    const track = {
      id: song.id,
      name: song.name,
      artist: getArtists(song),
      url: song.downloadUrl?.[2]?.url || "",
      image: song.image?.[0]?.url || placeholderImages.song,
      previewImage: song.image?.[2]?.url || placeholderImages.song,
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
      url: song.downloadUrl?.[0]?.url || "",
      image: song.image?.[0]?.url || placeholderImages.song,
      previewImage: song.image?.[2]?.url || placeholderImages.song,
    };
    addToQueue(track);
    toast({ title: "Added to Queue", description: `${song.name} - ${getArtists(song)}` });
  }, [addToQueue, toast, getArtists]);

  const renderSongItem = useCallback((song: Song) => (
    <Card key={song.id} className="mb-2 p-0 hover:shadow-md">
      <CardContent className="flex items-center p-2">
        <div className="relative mr-3 flex-shrink-0">
          <Link href={`${directoryURLs.songs}/${song.id}`} className="block">
            <Image
              src={song.image?.[0]?.url || placeholderImages.song}
              alt={song.name}
              width={40}
              height={40}
              className="object-cover rounded hover:shadow-lg"
            />
          </Link>
        </div>
        <div className="flex-grow overflow-hidden mr-2">
          <Link href={`${directoryURLs.songs}/${song.id}`} className="block hover:underline">
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Songs</h1>
      <div className='lg:mx-6'>
        <Input
          type="search"
          placeholder="Search for songs"
          value={searchQuery}
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
            debouncedSearch(query);
          }}
          className="mb-4"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2 mx-auto lg:mx-6">
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
        <div className='lg:grid lg:grid-cols-2 gap-x-4 lg:px-6'>
          {searchResults.map(renderSongItem)}
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
                  setSearchQuery(trend);
                  handleSearch(trend);
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
};

SearchPage.displayName = 'SearchPage';

export default SearchPage;