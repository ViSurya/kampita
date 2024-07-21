type SocialLink = {
    userName: string;
    url: string;
};

type SiteConfigType = {
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

type PlaceHolderImagesType = {
    artist: string;
    album: string;
    playlist: string;
    radio: string;
    song: string;
    user: string;
};


const SiteConfig: SiteConfigType = {
    siteName: 'Kampita',
    tagLine: 'Kampita - Feel the Beat, Free the Music',
    siteURL: 'https://www.kampita.com/',
    siteOwner: 'Vishal Kaleria',
    siteDescription: 'Kampita offers high-quality music downloads and streaming for free. Enjoy an extensive library of tracks without any cost. Feel the beat and free the music with Kampita.',
    contactEmail: 'support@kampita.com',
    copyright: '© 2024 Kampita. All rights reserved.',
    
    socialLinks: {
        x: {
            userName: 'KampitaMusic',
            url: 'https://x.com/KampitaMusic'
        },
        facebook: {
            userName: 'KampitaMusic',
            url: 'https://www.facebook.com/KampitaMusic'
        },
        instagram: {
            userName: 'KampitaMusic',
            url: 'https://www.instagram.com/KampitaMusic'
        },
        youtube: {
            userName: 'KampitaMusic',
            url: 'https://www.youtube.com/KampitaMusic'
        },
        linkedin: {
            userName: 'KampitaMusic',
            url: 'https://www.linkedin.com/company/KampitaMusic'
        }
    }
};

const PlaceHolderImages: PlaceHolderImagesType = {
    artist: '/images/placeholder/artist.jpg',
    album: '/images/placeholder/album.jpg',
    playlist: '/images/placeholder/playlist.jpg',
    radio: '/images/placeholder/radio.jpg',
    song: '/images/placeholder/song.jpg',
    user: '/images/placeholder/user.jpg'
};


const secrets = {
    API_URL: 'https://kampita-api.vercel.app/api',
}

export { SiteConfig, PlaceHolderImages, secrets };
