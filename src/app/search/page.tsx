// src/app/search/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchComponent from './searchPage';
import { siteConfig } from '@/lib/config';

interface SearchPageProps {
    searchParams: { q?: string };
}

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

export const runtime = 'edge';

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const query = searchParams.q || '';
    const title = query ? `Search results for "${query}" MP3 Song Download` : `Search Millions of Songs | ${siteConfig.siteName}`;
    const description = query
        ? `Explore music results for "${query}" on ${siteConfig.siteName}. Find your favorite songs, artists, and more.`
        : `Search for your favorite music on ${siteConfig.siteName}. Discover new songs, artists, and playlists.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteConfig.siteURL}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
            siteName: siteConfig.siteName,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${siteConfig.siteURL}/search`,
        },
        robots: {
            index: true,
            follow: true,
        },
        other: {
            'application-name': siteConfig.siteName,
        },
    };
}

const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteConfig.siteURL,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.siteURL}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
    }
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    let searchResults: Song[] = [];
    let error: string | null = null;

    async function fetchSearchResults(query: string): Promise<Song[]> {
        const apiUrl = 'https://api.kampitamusic.workers.dev/search/songs';
        const url = new URL(apiUrl);
        url.searchParams.append('q', query);
        url.searchParams.append('limit', '10');

        try {
            const res = await fetch(url.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 60 }, // Revalidate cache every 60 seconds
            });

            if (!res.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data: SearchSongsResponse = await res.json();
            return data.data.results;
        } catch (err) {
            console.error('Error fetching search results:', err);
            error = 'Failed to fetch search results. Please try again.';
            return [];
        }
    }

    if (searchParams.q) {
        searchResults = await fetchSearchResults(searchParams.q);
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
            />
            <div className='space-y-2 mx-auto lg:mx-6'>
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchComponent
                        title={searchParams.q ? `Search results for "${searchParams.q}" MP3 Song Download` : `Search Millions of Songs on ${siteConfig.siteName}`}
                        initialQuery={searchParams.q || ''}
                        initialResults={searchResults}
                        initialError={error}
                    />
                </Suspense>
            </div>
        </>
    );
}