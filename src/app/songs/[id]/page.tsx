import { cache } from 'react'
import { notFound } from 'next/navigation'
import { SongCardProps } from '@/components/layout/song-card'
import SongList from '@/components/layout/songs-scroll-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getArtistSongs, getSongById, getSongSuggestionsById } from '@/lib/fetch'
import { GetArtistSongsResponse, GetSongByIdResponse, GetSongSuggestionsByIdResponse } from '@/lib/fetchTypes'
import { decodeHtmlEntities, decodeHtmlEntitiesInJson, formatDuration } from '@/lib/utils'
import MainHero from '../_components/MainHero'
import Link from 'next/link'
import DownloadButton from '../_components/DownloadButton'
import { placeholderImages, siteConfig } from '@/lib/config'

export const runtime = 'edge'

const fetchSongCached = cache(async (id: string) => {
  try {
    const req = await getSongById({ id: id })
    const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
    return response.data?.[0]
  } catch (error) {
    // console.log('Error fetching song with lyrics:', error);
    try {
      const req = await getSongById({ id: id, lyrics: false })
      const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
      return response.data?.[0]
    } catch (fallbackError) {
      return null;
    }
  }
})

function createArtistProps(song: NonNullable<GetSongByIdResponse['data']>[0]): SongCardProps[] {
  const uniqueArtists = new Map<string, SongCardProps>();

  song.artists?.all?.forEach(artist => {
    const name = decodeHtmlEntities(artist.name);
    if (!uniqueArtists.has(name)) {
      uniqueArtists.set(name, {
        id: artist.id,
        name: name,
        artists: [],
        images: artist.image,
        layout: 'circular' as const,
        type: 'artist',
        addLinks: false as const
      });
    }
  });

  return Array.from(uniqueArtists.values());
}

const createSongSuggestions = cache(async (songId: string) => {
  const suggestions = await getSongSuggestionsById({ id: songId, limit: 10 });
  const response: GetSongSuggestionsByIdResponse = await decodeHtmlEntitiesInJson(suggestions);
  return response.data?.map(song => ({
    id: song.id,
    name: song.name,
    artists: song.artists?.all,
    images: song.image,
    type: 'song' as const,
    song_file: song.downloadUrl?.[2].url
  })) || [];
})





const createArtistSongs = cache(async (ArtistId: string) => {
  const suggestions = await getArtistSongs({ id: ArtistId });
  const response: GetArtistSongsResponse = await decodeHtmlEntitiesInJson(suggestions);
  if (!response.data || !Array.isArray(response.data.songs)) {
    return [];
  }
  return response.data.songs.map(song => ({
    id: song.id,
    name: song.name,
    artists: song.artists?.all || [],
    images: song.image,
    type: 'song' as const,
    song_file: song.downloadUrl?.[2].url
  }));
})



export default async function Page({ params }: { params: { id: string } }) {
    const song = await fetchSongCached(params.id)
    if (!song) {
      notFound()
    }

    const [suggestions, moreFromArtist] = await Promise.all([
      createSongSuggestions(params.id),
      createArtistSongs(song?.artists.primary?.[0].id || song?.artists.featured?.[0].id || song?.artists.all?.[0].id || '0000')
    ]);


    function formatDurationSchema(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `PT${minutes}M${remainingSeconds}S`;
    }
    
    function generateSchema(song: NonNullable<GetSongByIdResponse['data']>[0]) {
      const siteUrl = siteConfig.siteURL;
      const songUrl = `${siteUrl}/songs/${song.id}`;
      const audioObjects = song.downloadUrl.map(download => ({
        '@type': 'AudioObject',
        '@id': `${song.id}_${download.quality}`,
        url: download.url,
        encodingFormat: 'audio/mpeg',
        bitrate: download.quality,
        duration: formatDurationSchema(song.duration),
      }));
    
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        '@id': songUrl,
        name: song.name,
        duration: formatDurationSchema(song.duration),
        isrcCode: song.id,
        datePublished: song.releaseDate || undefined,
        genre: song.language + " " + song.type,
        image: song.image[song.image.length - 1]?.url || placeholderImages.song,
        url: songUrl,
        inAlbum : {
          '@type': 'MusicAlbum',
          '@id': song.album.id,
          name: song.album.name || 'Unknown Album',
        },
        byArtist: song.artists.all.map(artist => ({
          '@type': 'MusicGroup',
          '@id': artist.id,
          name: artist.name,
          // url: `${siteUrl}/artist/${artist.id}`,
          image: artist.image[artist.image.length - 1]?.url || placeholderImages.artist,
        })),
        audio: audioObjects,
      };
    
      return schema;
    }


    const schema = generateSchema(song)


    const artistProps = createArtistProps(song);

    return (
   <>
      <main className='max-w-screen-xl mx-auto p-2 md:p-4'>
        <MainHero songData={song} />

        <Card id="download-section" className='mb-8'>
          <CardHeader className='py-4 px-2'>
            <h2 className='text-2xl font-semibold leading-none tracking-tight text-center'>Download Links</h2>
            <Separator />
          </CardHeader>
          <CardContent className='p-0 md:p-2'>
            <Table className='pt-2'>
              <TableHeader>
                <TableRow>
                  <TableHead className='font-bold text-base text-center'>Quality</TableHead>
                  <TableHead className='font-bold text-base text-center'>Type</TableHead>
                  <TableHead className='font-bold text-base text-center'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {song.downloadUrl?.map((download, index) => (
                  <TableRow key={index} >
                    <TableCell className='text-center p-2'>{download.quality}</TableCell>
                    <TableCell className='text-center p-2'>MP3</TableCell>
                    <TableCell className='text-center p-2'>
                      <DownloadButton downloadUrl={download.url} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className='p-2'>
          <SongList
            HeadingName='Artists'
            songCards={artistProps}
          />
        </div>

        {suggestions.length > 0 && (
          <div className='p-2'>
            <SongList
              HeadingName='Recommended Songs'
              songCards={suggestions}
            />
          </div>
        )}

        {moreFromArtist.length > 0 && (
          <div className='p-2'>
            <SongList
              HeadingName='More from Artist'
              songCards={moreFromArtist}
            />
          </div>
        )}


        {song.lyrics && (
          <Card>
            <CardHeader>
              <h2 className='text-2xl font-semibold leading-none tracking-tight'>Lyrics</h2>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className='prose dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: song.lyrics.lyrics }} />
            </CardContent>
          </Card>
        )}
      </main>
      <script 
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      </>
    )

}



export async function generateMetadata({ params }: { params: { id: string } }) {
  const song = await fetchSongCached(params.id);
  if (!song) {
    return {};
  }

  const getArtistNames = (artists: Array<{ name: string }>, limit: number = 5) => {
    return artists.slice(0, limit).map(artist => artist.name).join(', ');
  };

  let artistNames = getArtistNames(song.artists.primary) ||
    getArtistNames(song.artists.featured) ||
    getArtistNames(song.artists.all);

  const title = `${song.name} MP3 Song Download`;
  const description = `Download "${song.name}" MP3 Song by ${artistNames} from the album "${song.album.name}". Released on ${song.releaseDate}, this track is available in ${song.language} language under the ${song.label} label. Duration: ${formatDuration(song.duration || 0)} minutes.`;

  return {
    title: title,
    description: description,
    metadataBase: new URL(siteConfig.siteURL),
    openGraph: {
      title: title,
      description: description,
      type: 'music.song',
      url: `/songs/${song.id}`,
      images: [
        {
          url: song.image[2].url,
          width: 500,
          height: 500,
          alt: `${song.name} song cover art`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: song.downloadUrl?.[4].url || '',
    },
    alternates: {
      canonical: `/songs/${song.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'music:musician': artistNames,
      'music:album': song.album.name || '',
      'music:release_date': song.releaseDate || '',
      'og:audio': song.downloadUrl?.[4].url || '',
    },
  };
}
