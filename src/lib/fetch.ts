import { configSecrets } from "./config";

const API_URL = configSecrets.API_URL;

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}


 const fetchFromAPI = async <T>(endpoint: string, params: Record<string, any>) => {
  const url = new URL(`${API_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status} of ${url.toString()}`);
  }

  const data = await response.json();
  return data;
};

// Search functions
export const globalSearch = (query: string) =>
  fetchFromAPI('search', { query });

export const searchSongs = (params: { query: string, page?: number, limit?: number }) => {
  const { query, page = 1, limit = 10 } = params;
  return fetchFromAPI('search/songs', { query, page, limit });
};

export const searchAlbums = (params: { query: string, page?: number, limit?: number }) => {
  const { query, page = 1, limit = 10 } = params;
  return fetchFromAPI('search/albums', { query, page, limit });
};

export const searchArtists = (params: { query: string, page?: number, limit?: number }) => {
  const { query, page = 1, limit = 10 } = params;
  return fetchFromAPI('search/artists', { query, page, limit });
};

export const searchPlaylists = (params: { query: string, page?: number, limit?: number }) => {
  const { query, page = 1, limit = 10 } = params;
  return fetchFromAPI('search/playlists', { query, page, limit });
};

// Song functions
export const getSongById = (params: { id: string, lyrics?: boolean }) => {
  const { id, lyrics = true } = params;
  return fetchFromAPI(`songs/${id}`, { lyrics });
};

export const getSongByLink = (params: { link: string, lyrics?: boolean }) => {
  const { link, lyrics = true } = params;
  return fetchFromAPI('songs', { link, lyrics });
};

export const getLyricsById = (params: { id: string }) => {
  const { id } = params;
  return fetchFromAPI(`songs/${id}/lyrics`, {});
};

export const getSongSuggestionsById = (params: { id: string, limit?: number }) => {
  const { id, limit = 10 } = params;
  return fetchFromAPI(`songs/${id}/suggestions`, { limit });
};

// Album functions
export const getAlbumById = (params: { id: string }) => {
  const { id } = params;
  return fetchFromAPI('albums', { id });
};

export const getAlbumByLink = (params: { link: string }) => {
  const { link } = params;
  return fetchFromAPI('albums', { link });
};

// Playlist functions
export const getPlaylistById = (params: { id: string, page?: number, limit?: number }) => {
  const { id, page = 1, limit = 10 } = params;
  return fetchFromAPI('playlists', { id, page, limit });
};

export const getPlaylistByLink = (params: { link: string, page?: number, limit?: number }) => {
  const { link, page = 1, limit = 10 } = params;
  return fetchFromAPI('playlists', { link, page, limit });
};








// Artist functions
/* 
there is no limit in max result but an page have 10 songs of artist

*/
export const getArtistById = ({
  id,
  page = 1,
  songCount = 10,  // Default value for songCount
  albumCount = 10,  // Default value for albumCount
  sortBy = 'popularity',  // Default value for sortBy
  sortOrder = 'asc'  // Default value for sortOrder
}: { 
  id: string; 
  page?: number; 
  songCount?: number; 
  albumCount?: number; 
  sortBy?: 'popularity' | 'latest' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}) =>
  fetchFromAPI('artists', { id, page, songCount, albumCount, sortBy, sortOrder });

export const getArtistSongs = ({
  id,
  page = 1,
  sortBy = 'popularity',  // Default value for sortBy
  sortOrder = 'asc'  // Default value for sortOrder
}: {
  id: string;
  page?: number;
  sortBy?: 'popularity' | 'latest' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}) =>
  fetchFromAPI(`artists/${id}/songs`, { id, page, sortBy, sortOrder });

export const getArtistAlbums = ({
  id,
  page = 1,
  sortBy = 'popularity',  // Default value for sortBy
  sortOrder = 'asc'  // Default value for sortOrder
}: {
  id: string;
  page?: number;
  sortBy?: 'popularity' | 'latest' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}) =>
  fetchFromAPI(`artists/${id}/albums`, { id, page, sortBy, sortOrder });

