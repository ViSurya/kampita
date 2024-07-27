export interface GlobalSearchResponse {
    success: boolean;
    data: {
      albums?: {
        results?: Array<{
          id: string;
          title: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          artist: string;
          url: string;
          type: string;
          description: string;
          year: string;
          language: string;
          songIds: string;
        }>;
        position: number;
      };
      songs?: {
        results?: Array<{
          id: string;
          title: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          album: string;
          url: string;
          type: string;
          description: string;
          primaryArtists: string;
          singers: string;
          language: string;
        }>;
        position: number;
      };
      artists?: {
        results?: Array<{
          id: string;
          title: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          type: string;
          description: string;
          position: number;
        }>;
        position: number;
      };
      playlists?: {
        results?: Array<{
          id: string;
          title: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
          language: string;
          type: string;
          description: string;
        }>;
        position: number;
      };
      topQuery?: {
        results?: Array<{
          id: string;
          title: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          album: string;
          url: string;
          type: string;
          description: string;
          primaryArtists: string;
          singers: string;
          language: string;
        }>;
        position: number;
      };
    };
  }


  export interface SearchSongsResponse {
    success: boolean;
    data: {
      total: number;
      start: number;
      results?: Array<{
        id: string;
        name: string;
        type: string;
        year: string | null;
        releaseDate: string | null;
        duration: number | null;
        label: string | null;
        explicitContent: boolean;
        playCount: number | null;
        language: string;
        hasLyrics: boolean;
        lyricsId: string | null;
        lyrics?: {
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
          primary?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
          featured?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
          all?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
        };
        image?: Array<{
          quality: string;
          url: string;
        }>;
        downloadUrl?: Array<{
          quality: string;
          url: string;
        }>;
      }>;
    };
  }


  export interface SearchAlbumsResponse {
    success: boolean;
    data: {
      total: number;
      start: number;
      results?: Array<{
        id: string;
        name: string;
        description: string;
        year: number | null;
        type: string;
        playCount: number | null;
        language: string;
        explicitContent: boolean;
        artists: {
          primary?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
          featured?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
          all?: Array<{
            id: string;
            name: string;
            role: string;
            type: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            url: string;
          }>;
        };
        url: string;
        image?: Array<{
          quality: string;
          url: string;
        }>;
      }>;
    };
  }

  export interface SearchArtistsResponse {
    success: boolean;
    data: {
      total: number;
      start: number;
      results?: Array<{
        id: string;
        name: string;
        role: string;
        type: string;
        image?: Array<{
          quality: string;
          url: string;
        }>;
        url: string;
      }>;
    };
  }

  export interface SearchPlaylistsResponse {
    success: boolean;
    data: {
      total: number;
      start: number;
      results?: Array<{
        id: string;
        name: string;
        type: string;
        image?: Array<{
          quality: string;
          url: string;
        }>;
        url: string;
        songCount: number | null;
        language: string;
        explicitContent: boolean;
      }>;
    };
  }

  export interface GetSongByIdResponse {
    success: boolean;
    data?: Array<{
      id: string;
      name: string;
      type: string;
      year: string | null;
      releaseDate: string | null;
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
    }>;
  }

  export interface GetSongByLinkResponse {
    success: boolean;
    data?: Array<{
      id: string;
      name: string;
      type: string;
      year?: string | null;
      releaseDate?: string | null;
      duration?: number | null;
      label?: string | null;
      explicitContent: boolean;
      playCount?: number | null;
      language: string;
      hasLyrics: boolean;
      lyricsId?: string | null;
      lyrics?: {
        lyrics: string;
        copyright: string;
        snippet: string;
      };
      url: string;
      copyright?: string | null;
      album?: {
        id?: string | null;
        name?: string | null;
        url?: string | null;
      };
      artists?: {
        primary?: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
        featured?: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
        all?: Array<{
          id: string;
          name: string;
          role: string;
          type: string;
          image?: Array<{
            quality: string;
            url: string;
          }>;
          url: string;
        }>;
      };
      image?: Array<{
        quality: string;
        url: string;
      }>;
      downloadUrl?: Array<{
        quality: string;
        url: string;
      }>;
    }>;
  }
  
  export interface GetLyricsByIdResponse {
    success: boolean;  // Indicates whether the request was successful
    data?: {
      lyrics: string;  // Lyrics for the song
      copyright: string;  // Copyright information for the lyrics
      snippet: string;  // A snippet of the lyrics
    };
  }

  export interface GetSongSuggestionsByIdResponse {
    success: boolean;  // Indicates whether the request was successful
    data?: Array<{
      id: string;  // Song ID
      name: string;  // Song name
      type: string;  // Song type
      year?: string | null;  // Release year
      releaseDate?: string | null;  // Release date
      duration?: number | null;  // Duration of the song
      label?: string | null;  // Record label
      explicitContent: boolean;  // Whether the song has explicit content
      playCount?: number | null;  // Play count
      language: string;  // Language of the song
      hasLyrics: boolean;  // Whether the song has lyrics
      lyricsId?: string | null;  // Lyrics ID
      lyrics?: {
        lyrics: string;  // Lyrics of the song
        copyright: string;  // Copyright information for the lyrics
        snippet: string;  // Snippet of the lyrics
      };
      url: string;  // URL of the song
      copyright?: string | null;  // Copyright information for the song
      album?: {
        id?: string | null;  // Album ID
        name?: string | null;  // Album name
        url?: string | null;  // URL of the album
      };
      artists?: {
        primary?: Array<{
          id: string;  // Primary artist ID
          name: string;  // Primary artist name
          role: string;  // Role of the primary artist
          type: string;  // Type of the primary artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the primary artist
        }>;
        featured?: Array<{
          id: string;  // Featured artist ID
          name: string;  // Featured artist name
          role: string;  // Role of the featured artist
          type: string;  // Type of the featured artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the featured artist
        }>;
        all?: Array<{
          id: string;  // Artist ID
          name: string;  // Artist name
          role: string;  // Role of the artist
          type: string;  // Type of the artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the artist
        }>;
      };
      image?: Array<{
        quality: string;  // Quality of the song image
        url: string;  // URL of the song image
      }>;
      downloadUrl?: Array<{
        quality: string;  // Quality of the download
        url: string;  // URL of the download
      }>;
    }>;
  }
  
  
  export interface GetAlbumResponse {
    success: boolean;  // Indicates whether the request was successful
    data?: {
      id: string;  // Album ID
      name: string;  // Album name
      description: string;  // Album description
      year?: number | null;  // Release year
      type: string;  // Album type
      playCount?: number | null;  // Play count
      language: string;  // Language of the album
      explicitContent: boolean;  // Whether the album has explicit content
      artists: {
        primary?: Array<{
          id: string;  // Primary artist ID
          name: string;  // Primary artist name
          role: string;  // Role of the primary artist
          type: string;  // Type of the primary artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the primary artist
        }>;
        featured?: Array<{
          id: string;  // Featured artist ID
          name: string;  // Featured artist name
          role: string;  // Role of the featured artist
          type: string;  // Type of the featured artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the featured artist
        }>;
        all?: Array<{
          id: string;  // Artist ID
          name: string;  // Artist name
          role: string;  // Role of the artist
          type: string;  // Type of the artist
          image?: Array<{
            quality: string;  // Quality of the artist's image
            url: string;  // URL of the artist's image
          }>;
          url: string;  // URL of the artist
        }>;
      };
      songCount?: number | null;  // Number of songs in the album
      url: string;  // URL of the album
      image: Array<{
        quality: string;  // Quality of the album image
        url: string;  // URL of the album image
      }>;
      songs?: Array<{
        id: string;  // Song ID
        name: string;  // Song name
        type: string;  // Song type
        year?: string | null;  // Release year of the song
        releaseDate?: string | null;  // Release date of the song
        duration?: number | null;  // Duration of the song
        label?: string | null;  // Record label of the song
        explicitContent: boolean;  // Whether the song has explicit content
        playCount?: number | null;  // Play count of the song
        language: string;  // Language of the song
        hasLyrics: boolean;  // Whether the song has lyrics
        lyricsId?: string | null;  // Lyrics ID
        lyrics?: {
          lyrics: string;  // Lyrics of the song
          copyright: string;  // Copyright information for the lyrics
          snippet: string;  // Snippet of the lyrics
        };
        url: string;  // URL of the song
        copyright?: string | null;  // Copyright information for the song
        album?: {
          id?: string | null;  // ID of the album containing the song
          name?: string | null;  // Name of the album containing the song
          url?: string | null;  // URL of the album containing the song
        };
        artists?: {
          primary?: Array<{
            id: string;  // Primary artist ID
            name: string;  // Primary artist name
            role: string;  // Role of the primary artist
            type: string;  // Type of the primary artist
            image?: Array<{
              quality: string;  // Quality of the artist's image
              url: string;  // URL of the artist's image
            }>;
            url: string;  // URL of the primary artist
          }>;
          featured?: Array<{
            id: string;  // Featured artist ID
            name: string;  // Featured artist name
            role: string;  // Role of the featured artist
            type: string;  // Type of the featured artist
            image?: Array<{
              quality: string;  // Quality of the artist's image
              url: string;  // URL of the artist's image
            }>;
            url: string;  // URL of the featured artist
          }>;
          all?: Array<{
            id: string;  // Artist ID
            name: string;  // Artist name
            role: string;  // Role of the artist
            type: string;  // Type of the artist
            image?: Array<{
              quality: string;  // Quality of the artist's image
              url: string;  // URL of the artist's image
            }>;
            url: string;  // URL of the artist
          }>;
        };
        image?: Array<{
          quality: string;  // Quality of the song image
          url: string;  // URL of the song image
        }>;
        downloadUrl?: Array<{
          quality: string;  // Quality of the download
          url: string;  // URL of the download
        }>;
      }>;
    };
  }
  

  export interface GetPlaylistResponse {
    success: boolean;
    data?: {
      id?: string;
      name?: string;
      description?: string;
      type?: string;
      year?: null | number;
      playCount?: null | number;
      language?: string;
      explicitContent?: boolean;
      url?: string;
      songCount?: number;
      artists?: Array<{
        id?: string;
        name?: string;
        role?: string;
        image?: Array<{
          quality: string;
          url: string;
        }>;
        type?: string;
        url?: string;
      }>;
      image?: Array<{
        quality: string;
        url: string;
      }>;
      songs?: Array<{
        id?: string;
        name?: string;
        type?: string;
        year?: string;
        releaseDate?: string;
        duration?: number;
        label?: string;
        explicitContent?: boolean;
        playCount?: number;
        language?: string;
        hasLyrics?: boolean;
        lyricsId?: null | string;
        url?: string;
        copyright?: string;
        album?: {
          id?: string;
          name?: string;
          url?: string;
        };
        artists?: {
          primary?: Array<{
            id?: string;
            name?: string;
            role?: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            type?: string;
            url?: string;
          }>;
          featured?: [];
          all?: Array<{
            id?: string;
            name?: string;
            role?: string;
            image?: Array<{
              quality: string;
              url: string;
            }>;
            type?: string;
            url?: string;
          }>;
        };
        image?: Array<{
          quality: string;
          url: string;
        }>;
        downloadUrl?: Array<{
          quality: string;
          url: string;
        }>;
      }>;
    };
  }
  

  export type GetArtistSongsResponse = {
    success: boolean
    data: {
      total: number
      songs: Array<{
        id: string
        name: string
        type: string
        year: string
        releaseDate: any
        duration: number
        label: string
        explicitContent: boolean
        playCount: any
        language: string
        hasLyrics: boolean
        lyricsId: any
        url: string
        copyright: string
        album: {
          id: string
          name: string
          url: string
        }
        artists: {
          primary: Array<{
            id: string
            name: string
            role: string
            image: Array<{
              quality: string
              url: string
            }>
            type: string
            url: string
          }>
          featured: Array<any>
          all: Array<{
            id: string
            name: string
            role: string
            image: Array<{
              quality: string
              url: string
            }>
            type: string
            url: string
          }>
        }
        image: Array<{
          quality: string
          url: string
        }>
        downloadUrl: Array<{
          quality: string
          url: string
        }>
      }>
    }
  }
  