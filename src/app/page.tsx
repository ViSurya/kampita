// app/page.tsx
import React from 'react'
import { Trending_Hot_Hits, Hindi_Viral_Hits, Urdu_Trending_Hits, Malayalam_Viral_Hits } from '@/lib/homeFetchURls'
import SongList from '@/components/layout/songs-scroll-list'
import { Separator } from '@/components/ui/separator'
import { GetPlaylistResponse } from '@/lib/fetchTypes'
import { decodeHtmlEntities } from '@/lib/utils'
import { configSecrets, directoryURLs, placeholderImages } from '@/lib/config'
import TrendingSongs from '@/components/layout/home-trending-songs'

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

const API_URL = configSecrets.API_URL

const getPlaylistByLink = async (params: { link: string, page?: number, limit?: number }) => {
  const { link, page = 1, limit = 10 } = params;
  return fetchFromAPI('playlists', { link, page, limit });
};

const fetchFromAPI = async function (endpoint: string, params: Record<string, any>) {
  const url = new URL(`${API_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    next: {
      revalidate: 3600,  // Revalidate every hour (3600 seconds)
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status} of ${url.toString()}`);
  }

  const data = await response.json();
  return data;
};

async function fetchSongList(playlistUrl: string, limit: number = 20) {
  const req: GetPlaylistResponse = await getPlaylistByLink({ link: playlistUrl, limit })
  return req.data?.songs?.map((song) => ({
    id: song.id || '',
    name: song.name ? decodeHtmlEntities(song.name) : '',
    artists: song.artists?.all || [],
    images: song.image || [],
    song_file: song.downloadUrl?.[2].url
  })) || [];
}

const getModules = async (modulestype: 'trending') => {
  let fetchModule = modulestype === 'trending' ? "get/trending" : '';
  if (!modulestype) return;

  const res = await fetch(`https://api.kampitamusic.workers.dev/${fetchModule}`)
  const data = await res.json()
  return data.data;
}

export default async function Page() {
  const trendingHotHits = await fetchSongList(Trending_Hot_Hits.url)
  const hindiViralHits = await fetchSongList(Hindi_Viral_Hits.url)
  const urduTrendingHits = await fetchSongList(Urdu_Trending_Hits.url)
  const malayalamViralHits = await fetchSongList(Malayalam_Viral_Hits.url)
  const trendingData = await getModules('trending')

  const playlists = [
    { url: "https://www.jiosaavn.com/featured/english-viral-hits/pm49jiq,CNs_", name: "English Viral Hits" },
    { url: "https://www.jiosaavn.com/featured/best-of-pop-english/oqKee-6aXESO0eMLZZxqsA__", name: "Best of Pop English" },
    // { url: "https://www.jiosaavn.com/featured/most-searched-songs-english/xUOBWZUG6AgGSw2I1RxdhQ__", name: "Most Searched Songs - English" },
  ];

  // Fetch song lists for each playlist
  const playlistSongLists = await Promise.all(
    playlists.map(playlist => fetchSongList(playlist.url))
  );

  return (
    <main className='p-4'>
      <div className="mb-8">
        <h1 className='text-3xl font-bold text-center'>Welcome to PagalWorld :)</h1>
        <p className='leading-6 text-center mt-2'>
          Download or stream millions of songs for free on PagalWorld.
        </p>
      </div>

      <div>
        <h2 className='text-xl lg:text-2xl'>Trending Songs</h2>
        <Separator className="mb-2" />
        <TrendingSongs songs={trendingData} />
      </div>

      {playlistSongLists.map((songs, index) => (
        <React.Fragment key={index}>
          <SongList HeadingName={playlists[index].name} songCards={songs} />
          <Separator className='mb-2' />
        </React.Fragment>
      ))}

      <SongList HeadingName={"Latest Hot Hits"} songCards={trendingHotHits} />
      <Separator className='mb-2' />

      <SongList HeadingName={Hindi_Viral_Hits.name} songCards={hindiViralHits} />
      <Separator className='mb-2' />

      <SongList HeadingName={Urdu_Trending_Hits.name} songCards={urduTrendingHits} />
      <Separator className='mb-2' />

      <SongList HeadingName={Malayalam_Viral_Hits.name} songCards={malayalamViralHits} />
    </main>
  )
}
