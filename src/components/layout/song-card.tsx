"use client";
import { memo, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { placeholderImages } from "@/lib/config";
import { useAudio } from "@/app/contexts/AudioContext";
import { ListMusic, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast"
import { Toast } from "@/components/ui/toast"

const {
  album: albumPlaceholder,
  artist: artistPlaceholder,
  playlist: playlistPlaceholder,
  radio: radioPlaceholder,
  song: songPlaceholder,
  user: userPlaceholder,
} = placeholderImages;

type Artist = {
  id?: string;
  name?: string;
};

type Images = {
  quality?: string;
  url?: string;
};

export type SongCardProps = {
  id?: string;
  name?: string;
  artists?: Artist[];
  images?: Images[];
  layout?: "default" | "circular";
  type?: "song" | "artist" | "album" | "playlist" | "radio" | "user";
  addLinks?: boolean;
  song_file?: string;
};

const PlaceHoldersImagesObj = {
  album: albumPlaceholder,
  artist: artistPlaceholder,
  playlist: playlistPlaceholder,
  radio: radioPlaceholder,
  song: songPlaceholder,
  user: userPlaceholder,
};



const generateUrl = (type: string, id: string) => {
  switch (type) {
    case "song":
      return `/songs/${id}`;
    case "artist":
      return `/artists/${id}`;
    case "album":
      return `/albums/${id}`;
    case "playlist":
      return `/playlists/${id}`;
    case "radio":
      return `/radio/${id}`;
    case "user":
      return `/users/${id}`;
    default:
      return "#";
  }
};

const ContentWrapper = memo(function ContentWrapper({
  children,
  className,
  addLinks,
  url
}: {
  children: React.ReactNode;
  className?: string;
  addLinks: boolean;
  url: string
}) {
  if (addLinks) {
    return (
      <Link href={url} prefetch={false} className={className}>
        {children}
      </Link>
    );
  } else {
    return <div className={className}>{children}</div>;
  }
});

ContentWrapper.displayName = "ContentWrapper";

const SongCard = memo(function SongCard({
  id = "unknown",
  name = "Unknown Item",
  artists = [],
  images = [],
  layout = "default",
  type = "song",
  addLinks = true,
  song_file = "",
}: SongCardProps) {
  const { toast } = useToast()
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { setCurrentTrack, togglePlay, isPlaying, currentTrack, addToQueue } = useAudio();

  const url = useMemo(() => generateUrl(type, id), [type, id]);

  const uniqueArtists = useMemo(() => {
    const seen = new Set();
    return artists.filter((artist) => {
      const artistName = artist.name || "Unknown Artist";
      const duplicate = seen.has(artistName);
      seen.add(artistName);
      return !duplicate;
    });
  }, [artists]);

  const isCircular = layout === "circular";

  const placeholderImage = PlaceHoldersImagesObj[type] || songPlaceholder;

  const imageUrl = useMemo(() => {
    return images && images.length > 0 ? images[images.length - 1].url || placeholderImage : placeholderImage;
  }, [images, placeholderImage]);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (type === "song" && song_file) {
      const track = {
        id,
        name,
        artist: uniqueArtists.map(a => a.name).join(", "),
        url: song_file,
        image: images && images.length > 0 ? images[0].url || placeholderImage : placeholderImage,
        previewImage: images && images.length > 0 ? images[2].url || placeholderImage : placeholderImage,
      };
      if (currentTrack?.id === id) {
        togglePlay();
        toast({
          title: isPlaying ? "Paused" : "Now Playing",
          description: `${name}`,
        })
      } else {
        setCurrentTrack(track);
        toast({
          duration: 1500,
          title: "Now Playing",
          description: `${name}`,
        })
      }
    }
  }, [id, name, song_file, type, uniqueArtists, currentTrack, images, placeholderImage, togglePlay, setCurrentTrack, isPlaying, toast]);
  
  const handleAddToQueue = useCallback(() => {
    if (type === "song" && song_file) {
      const track = {
        id,
        name,
        artist: uniqueArtists.map(a => a.name).join(", "),
        url: song_file,
        image: images && images.length > 0 ? images[0].url || placeholderImage : placeholderImage,
        previewImage: images && images.length > 0 ? images[2].url || placeholderImage : placeholderImage,
      };
      addToQueue(track);
      toast({
        duration: 1500,
        title: "Added to Queue",
        description: `${name}`,
      })
    }
  }, [id, name, song_file, type, uniqueArtists, images, placeholderImage, addToQueue, toast]);

  return (
    <Card className={`group hover:bg-slate-100 ${isCircular ? "w-36 lg:w-40" : "w-40 lg:w-52"} hover:dark:bg-slate-800 hover:shadow-md`}>
      <div className="p-2">
        <div className={`relative w-full overflow-hidden ${isCircular ? "rounded-full" : "rounded-md"}`}>
          <ContentWrapper className="absolute inset-0 z-10" addLinks={addLinks} url={url}>
            <span className="sr-only">View {name}</span>
          </ContentWrapper>
          <AspectRatio ratio={1 / 1}>
            {imageLoading && (
              <Skeleton className={`absolute w-full h-full ${isCircular ? "rounded-full" : ""}`} />
            )}
            <Image
              src={imageError ? placeholderImage : imageUrl}
              alt={name}
              width={250}
              height={250}
              loading="lazy"
              onError={handleError}
              onLoad={handleImageLoad}
              className={`absolute w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${isCircular ? "rounded-full" : ""} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            />
          </AspectRatio>
          {type === "song" && (
            <div className={`absolute inset-0 flex items-center justify-center lg:bg-black/30 lg:opacity-0 transition-opacity lg:group-hover:opacity-100 ${isCircular ? "rounded-full" : ""}`}>
              <button
                aria-label={isPlaying && currentTrack?.id === id ? "Pause" : "Play"}
                onClick={handlePlay}
                className={`group/play z-20 m-auto aspect-square w-12 ${isCircular ? "rounded-full" : "rounded-full"} bg-muted/50 lg:bg-muted/75 duration-200 hover:w-14 active:w-12`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play m-auto h-full w-6 p-0.5 duration-200 group-hover/play:w-7"
                >
                  {isPlaying && currentTrack?.id === id ? (
                    <g>
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </g>
                  ) : (
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  )}
                </svg>
              </button>
              <button
                aria-label="Add to Queue"
                onClick={handleAddToQueue}
                className={`group/play lg:block z-20 m-auto aspect-square w-12 ${isCircular ? "rounded-full" : "rounded-full"} bg-muted/50 lg:bg-muted/75 duration-200 hover:w-14 active:w-12 ml-2`}
              >
                <ListMusic className="m-auto h-full w-6 p-0.5 duration-200 group-hover/play:w-7" />
              </button>
            </div>
          )}
        </div>
        <div>
          <ContentWrapper className="block" addLinks={addLinks} url={url}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className={`font-medium text-center ${isCircular ? "text-sm lg:text-base" : "text-base lg:text-lg"} truncate mt-2`}>{name}</h3>
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ContentWrapper>
          {type === "song" && !isCircular && (
            <p className="text-xs text-muted-foreground text-center truncate">
              {uniqueArtists.map((artist, index) => (
                <span key={index}>
                  {artist.name || "Unknown Artist"}
                  {index < uniqueArtists.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

SongCard.displayName = "SongCard";

export { SongCard };