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
        const apiUrl = 'http://localhost:3000/api/search';
        const url = new URL(apiUrl);
        url.searchParams.append('query', query);
        url.searchParams.append('limit', '10');

        const res = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }, // Revalidate cache every 60 seconds
        });

        if (!res.ok) {
            throw new Error('Failed to fetch songs');
        }

        const data: SearchSongsResponse = await res.json();
        return data.data.results;
    }


    if (searchParams.q) {
        try {
            searchResults = await fetchSearchResults(searchParams.q);
        } catch (err) {
            console.error('Error fetching search results:', err);
            error = 'Failed to fetch search results. Please try again.';
        }
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