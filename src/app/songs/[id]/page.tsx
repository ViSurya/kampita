import { SongCardProps } from '@/components/layout/song-card'
import SongList from '@/components/layout/songs-scroll-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getArtistSongs, getSongById, getSongSuggestionsById } from '@/lib/fetch'
import { GetArtistSongsResponse, GetSongByIdResponse, GetSongSuggestionsByIdResponse } from '@/lib/fetchTypes'
import { decodeHtmlEntities, decodeHtmlEntitiesInJson } from '@/lib/utils'
import MainHero from '../_components/MainHero'

export const runtime = 'edge'

async function fetchSongWithRetry(id: string, withLyrics: boolean = true): Promise<NonNullable<GetSongByIdResponse['data']>[0] | null> {
  console.log(`Fetching song with id: ${id}, withLyrics: ${withLyrics}`);
  try {
    const req = await getSongById({ id, lyrics: withLyrics })
    const response: GetSongByIdResponse = await decodeHtmlEntitiesInJson(req)
    console.log(`Song fetched successfully ${withLyrics ? 'with' : 'without'} lyrics`);
    return response.data?.[0] || null
  } catch (error) {
    console.log(`Error fetching song ${withLyrics ? 'with' : 'without'} lyrics:`, error);
    return null;
  }
}

async function fetchSongCached(id: string): Promise<NonNullable<GetSongByIdResponse['data']>[0] | null> {
  let song = await fetchSongWithRetry(id, true);
  if (!song) {
    song = await fetchSongWithRetry(id, false);
  }
  return song;
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

async function createSongSuggestions(songId: string): Promise<SongCardProps[]> {
  console.log(`Fetching song suggestions for id: ${songId}`);
  try {
    const suggestions = await getSongSuggestionsById({ id: songId, limit: 10 });
    const response: GetSongSuggestionsByIdResponse = await decodeHtmlEntitiesInJson(suggestions);
    console.log('Song suggestions fetched successfully');
    return response.data?.map(song => ({
      id: song.id,
      name: song.name,
      artists: song.artists?.all,
      images: song.image,
      type: 'song' as const,
      song_file: song.downloadUrl?.[2]?.url
    })) || [];
  } catch (error) {
    console.log('Error fetching song suggestions:', error);
    return [];
  }
}

async function createArtistSongs(ArtistId: string): Promise<SongCardProps[]> {
  console.log(`Fetching artist songs for id: ${ArtistId}`);
  try {
    const suggestions = await getArtistSongs({ id: ArtistId });
    const response: GetArtistSongsResponse = await decodeHtmlEntitiesInJson(suggestions);
    if (!response.data || !Array.isArray(response.data.songs)) {
      console.log('Invalid response structure for artist songs');
      return [];
    }
    console.log('Artist songs fetched successfully');
    return response.data.songs.map(song => ({
      id: song.id,
      name: song.name,
      artists: song.artists?.all || [],
      images: song.image,
      type: 'song' as const,
      song_file: song.downloadUrl?.[2]?.url
    }));
  } catch (error) {
    console.log('Error fetching artist songs:', error);
    return [];
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log(`Rendering page for song id: ${params.id}`);
  
  const song = await fetchSongCached(params.id);
  if (!song) {
    console.log('Song not found');
    return <div className="text-center p-8">The requested song could not be found. Please check the song ID and try again.</div>;
  }

  const artistId = song.artists.primary?.[0]?.id || song.artists.featured?.[0]?.id || song.artists.all?.[0]?.id || '0000';
  
  const [suggestions, moreFromArtist, artistProps] = await Promise.all([
    createSongSuggestions(params.id),
    createArtistSongs(artistId),
    Promise.resolve(createArtistProps(song))
  ]);

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
                <TableRow key={index}>
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
        <SongList HeadingName='Artists' songCards={artistProps} />
      </div>

      <div className='p-2'>
        <SongList HeadingName='Recommended Songs' songCards={suggestions} />
      </div>

      <div className='p-2'>
        <SongList HeadingName='More from Artist' songCards={moreFromArtist} />
      </div>

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
}