import { cache } from 'react'
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

const fetchSongCached = cache(async (id: string) => {
  try {
    const req = await getSongById({ id: id })
    const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
    return response.data?.[0]
  } catch (error) {
    const req = await getSongById({ id: id, lyrics: false })
    const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
    return response.data?.[0]
  }
})

const FALLBACK_ARTIST_IMAGE = PlaceHolderImages.artist;
const FALLBACK_SONG_IMAGE = PlaceHolderImages.song;

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
  const suggestions = await getSongSuggestionsById({ id: songId, limit: 10 });
  const response: GetSongSuggestionsByIdResponse = await decodeHtmlEntitiesInJson(suggestions);
  return response.data?.map(song => ({
    id: song.id,
    name: song.name,
    artists: song.artists?.all,
    images: song.image,
    type: 'song' as const,
    song_file: song.downloadUrl?.[2].url
  }
  ));
}
async function createArtistSongs(ArtistId: string) {
  const suggestions = await getArtistSongs({ id: ArtistId });
  const response: GetArtistSongsResponse = await decodeHtmlEntitiesInJson(suggestions);
  if (!response.data || !Array.isArray(response.data.songs)) {
    return []; // Return an empty array if the structure is invalid
  }
  return response.data.songs.map(song => ({
    id: song.id,
    name: song.name,
    artists: song.artists?.all || [], // Provide a default empty array if artists are undefined
    images: song.image,
    type: 'song' as const,
    song_file: song.downloadUrl?.[2].url
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const song = await fetchSongCached(params.id)
  const suggestions = await createSongSuggestions(params.id);
  const moreFromArtist = await createArtistSongs(song?.artists.primary?.[0].id || song?.artists.featured?.[0].id || song?.artists.all?.[0].id || '0000')

  if (!song) {
    return <div className="text-center p-8">Song not found</div>
  }

  const artistProps = createArtistProps(song);

  return (
    <main className='max-w-screen-xl mx-auto p-2 md:p-4'>

      <MainHero songData={song}/>

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

      {/* <Card className='mb-8'>
     <CardHeader className='p-4'>
     <h2 className='text-xl md:text-2xl font-semibold leading-none tracking-tight'>More Songs From Album {song.album.name}</h2>
     <Separator />
     </CardHeader>
     <CardContent className='py-4'>

     </CardContent>
      </Card> */}

      <Card className='p-2 md:p-4 mb-8'>
        <SongList
          HeadingName='Artists'
          songCards={artistProps}
        />
      </Card>

      <Card className='p-2 md:p-4 mb-8'>
        <SongList
          HeadingName='Recommended Songs'
          songCards={suggestions ?? []}
        />
      </Card>

      <Card className='p-2 md:p-4 mb-8'>
        <SongList
          HeadingName='More from Artist'
          songCards={moreFromArtist ?? []}
        />
      </Card>

      {song.lyrics && (
        <Card>
          <CardHeader>
            <h2 className='text-2xl font-semibold leading-none tracking-tight'>Lyrics</h2>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className='prose dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: song.lyrics.lyrics }} />
            {/* <p className='mt-4 text-sm text-gray-500'>{song.lyrics.copyright}</p> */}
          </CardContent>
        </Card>
      )}
    </main>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const song = await fetchSongCached(params.id)
  if (!song) {
    return {}
  }
  return {
    title: song?.name || params.id,
    description: `download ${song?.name} online for free`,
    openGraph: {
      images: [song?.image?.[2].url]
    }
  }
}