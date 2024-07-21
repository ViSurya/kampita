import { cache } from 'react'
import { notFound } from 'next/navigation'
import { SongCardProps } from '@/components/layout/song-card'
import SongList from '@/components/layout/songs-scroll-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlaceHolderImages } from '@/lib/config'
import { getArtistSongs, getSongById, getSongSuggestionsById } from '@/lib/fetch'
import { GetArtistSongsResponse, GetSongByIdResponse, GetSongSuggestionsByIdResponse } from '@/lib/fetchTypes'
import { decodeHtmlEntities, decodeHtmlEntitiesInJson, formatDuration } from '@/lib/utils'
import MainHero from '../_components/MainHero'

export const runtime = 'edge'

const fetchSongCached = async (id: string) => {
  // console.log(`Fetching song with id: ${id}`);
  try {
    const req = await getSongById({ id: id })
    const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
    // console.log('Song fetched successfully');
    return response.data?.[0]
  } catch (error) {
    console.log('Error fetching song with lyrics:', error);
    try {
      const req = await getSongById({ id: id, lyrics: false })
      const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
      // console.log('Song fetched successfully without lyrics');
      return response.data?.[0]
    } catch (fallbackError) {
      // console.log('Error fetching song without lyrics:', fallbackError);
      return null;
    }
  }
}

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

async function createSongSuggestions(songId: string) {
  // console.log(`Fetching song suggestions for id: ${songId}`);
  try {
    const suggestions = await getSongSuggestionsById({ id: songId, limit: 10 });
    const response: GetSongSuggestionsByIdResponse = await decodeHtmlEntitiesInJson(suggestions);
    // console.log('Song suggestions fetched successfully');
    return response.data?.map(song => ({
      id: song.id,
      name: song.name,
      artists: song.artists?.all,
      images: song.image,
      type: 'song' as const,
      song_file: song.downloadUrl?.[2].url
    })) || [];
  } catch (error) {
    // console.log('Error fetching song suggestions:', error);
    return [];
  }
}

async function createArtistSongs(ArtistId: string) {
  // console.log(`Fetching artist songs for id: ${ArtistId}`);
  try {
    const suggestions = await getArtistSongs({ id: ArtistId });
    const response: GetArtistSongsResponse = await decodeHtmlEntitiesInJson(suggestions);
    if (!response.data || !Array.isArray(response.data.songs)) {
      // console.log('Invalid response structure for artist songs');
      return [];
    }
    // console.log('Artist songs fetched successfully');
    return response.data.songs.map(song => ({
      id: song.id,
      name: song.name,
      artists: song.artists?.all || [],
      images: song.image,
      type: 'song' as const,
      song_file: song.downloadUrl?.[2].url
    }));
  } catch (error) {
    // console.log('Error fetching artist songs:', error);
    return [];
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  // console.log(`Rendering page for song id: ${params.id}`);
  try {
    const song = await fetchSongCached(params.id)
    if (!song) {
      // console.log('Song not found, returning 404');
      notFound()
    }

    const [suggestions, moreFromArtist] = await Promise.all([
      createSongSuggestions(params.id),
      createArtistSongs(song?.artists.primary?.[0].id || song?.artists.featured?.[0].id || song?.artists.all?.[0].id || '0000')
    ]);

    const artistProps = createArtistProps(song);

    return (
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
                      <Button>Download</Button>
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
    )
  } catch (error) {
    console.log('Error rendering song page:', error);
    return <div className="text-center p-8">An error occurred while loading the song. Please try again later.</div>
  }
}

