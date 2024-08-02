type SocialLink = {
    userName: string;
    url: string;
};

type SiteConfiguration = {
    siteName: string;
    tagLine: string;
    siteURL: string;
    siteOwner: string;
    siteDescription: string;
    contactEmail: string;
    copyright: string;
    socialLinks: {
        x: SocialLink;
        facebook: SocialLink;
        instagram: SocialLink;
        youtube: SocialLink;
        linkedin: SocialLink;
    };
};

type PlaceholderImages = {
    artist: string;
    album: string;
    playlist: string;
    radio: string;
    song: string;
    user: string;
};

const siteConfig: SiteConfiguration = {
    siteName: 'PagalWorld',
    tagLine: 'PagalWorld - Your Ultimate Music Download Destination',
    siteURL: 'https://pagal-world.site',
    siteOwner: 'Vishal Kalaria',
    siteDescription: 'PagalWorld offers a vast collection of music downloads and streaming. Enjoy high-quality songs, albums, and playlists at your fingertips. Download your favorite tracks from PagalWorld.',
    contactEmail: 'support@pagal-world.site',
    copyright: '© 2024 PagalWorld. All rights reserved.',
    socialLinks: {
        x: {
            userName: 'PagalWorldMusic',
            url: 'https://x.com/PagalWorldMusic'
        },
        facebook: {
            userName: 'PagalWorldMusic',
            url: 'https://www.facebook.com/PagalWorldMusic'
        },
        instagram: {
            userName: 'PagalWorldMusic',
            url: 'https://www.instagram.com/PagalWorldMusic'
        },
        youtube: {
            userName: 'PagalWorldMusic',
            url: 'https://www.youtube.com/PagalWorldMusic'
        },
        linkedin: {
            userName: 'PagalWorldMusic',
            url: 'https://www.linkedin.com/company/PagalWorldMusic'
        }
    }
};

export const directoryURLs = {
    songs: `/songs` // + song.id e.g. = http://localhost:3000/songs/VmEFV51v
};

const placeholderImages: PlaceholderImages = {
    artist: '/images/placeholder/artist.jpg',
    album: '/images/placeholder/album.jpg',
    playlist: '/images/placeholder/playlist.jpg',
    radio: '/images/placeholder/radio.jpg',
    song: '/images/placeholder/song.jpg',
    user: '/images/placeholder/user.jpg'
};

const configSecrets = {
    API_URL: 'https://kampita-api.vercel.app/api',
    MONGO_URL: 'mongodb+srv://iamvishsurya:rMWBYG6NVmC8gcjF@cluster0.ljirn1g.mongodb.net/'
};

export { siteConfig, placeholderImages, configSecrets };
