import { formatDuration } from '@/lib/utils';
import React from 'react'

type songType = {
    id: string;
    name: string;
    type: string;
    year: string | null;
    releaseDate: string | Date | null;
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

function SongFAQs({ song }: {song: songType}) {
    const primaryArtists = song.artists.primary.map(artist => artist.name).join(', ')
    const allArtists = song.artists.all.map(artist => `${artist.name} (${artist.role})`).join(', ')
    const lyricists = song.artists.all.filter(artist => artist.role === 'lyricist').map(artist => artist.name).join(', ')

    const faqs = [
        {
            question: `When was "${song.name}" released?`,
            answer: `"${song.name}" ${song.language ? `is a ${song.language}` : ''} song released on ${song.releaseDate ? new Date(song.releaseDate).toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric' }) : 'an unknown date'}.`
        },
        {
            question: `Who are the primary artists of "${song.name}"?`,
            answer: `The primary artists for "${song.name}" are ${primaryArtists}.`
        },
        {
            question: `How long is "${song.name}"?`,
            answer: `The duration of "${song.name}" is ${formatDuration(song.duration)}.`
        },
        {
            question: `What album is "${song.name}" from?`,
            answer: song.album.name ? `"${song.name}" is from the album "${song.album.name}".` : `The album information for "${song.name}" is not available.`
        },
        {
            question: `Who wrote the lyrics for "${song.name}"?`,
            answer: lyricists ? `The lyrics for "${song.name}" were written by ${lyricists}.` : `The lyricist information for "${song.name}" is not available.`
        },
        {
            question: `What label released "${song.name}"?`,
            answer: song.label ? `"${song.name}" was released under the label ${song.label}.` : `The label information for "${song.name}" is not available.`
        },
        {
            question: `Is "${song.name}" explicit?`,
            answer: `"${song.name}" ${song.explicitContent ? 'contains' : 'does not contain'} explicit content.`
        },
        {
            question: `How popular is "${song.name}"?`,
            answer: song.playCount ? `"${song.name}" has been played ${song.playCount.toLocaleString()} times.` : `The play count for "${song.name}" is not available.`
        },
        {
            question: `Who are all the artists involved in "${song.name}"?`,
            answer: `The artists involved in "${song.name}" are: ${allArtists}.`
        },
        {
            question: `Does "${song.name}" have lyrics available?`,
            answer: song.hasLyrics ? `Yes, lyrics are available for "${song.name}".` : `No, lyrics are not available for "${song.name}".`
        }
    ]
  return (
    <div>Song</div>
  )
}

export default SongFAQs