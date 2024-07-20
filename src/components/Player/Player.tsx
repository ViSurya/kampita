"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAudio } from "@/app/contexts/AudioContext";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  ListMusic,
  Loader,
  X,
  ChevronUp,
} from "lucide-react";

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const PlayerControls = React.memo(() => {
  const {
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLoading,
    queue,
    currentTrack,
  } = useAudio();

  const canPlayPrevious = useMemo(() => queue.length > 0 || currentTrack, [queue, currentTrack]);
  const canPlayNext = useMemo(() => queue.length > 0 || repeatMode !== 'off', [queue, repeatMode]);

  return (
    <div className="flex items-center justify-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isShuffle ? "secondary" : "ghost"}
              size="icon"
              onClick={toggleShuffle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isShuffle ? "Disable Shuffle" : "Enable Shuffle"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={playPrevious}
              disabled={!canPlayPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={togglePlay} 
              className="h-10 w-10"
              disabled={!currentTrack}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isPlaying ? "Pause" : "Play"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={playNext}
              disabled={!canPlayNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={repeatMode !== "off" ? "secondary" : "ghost"}
              size="icon"
              onClick={toggleRepeat}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {repeatMode === "off"
              ? "Enable Repeat"
              : repeatMode === "all"
              ? "Repeat One"
              : "Disable Repeat"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

PlayerControls.displayName = "PlayerControls";

const TrackInfo = React.memo(() => {
  const { currentTrack } = useAudio();

  if (!currentTrack) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-10 w-10 rounded-md bg-gray-300 animate-pulse"></div>
        <div className="w-full">
          <div className="h-4 bg-gray-300 rounded-md w-3/4 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-300 rounded-md w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={currentTrack.image}
        alt={currentTrack.name}
        className="h-10 w-10 rounded-md"
        width={50}
        height={50}
      />
      <div className="overflow-hidden">
        <p className="font-semibold text-sm truncate">{currentTrack.name}</p>
        <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
      </div>
    </div>
  );
});

TrackInfo.displayName = "TrackInfo";

const VolumeControl = React.memo(() => {
  const { volume, setVolume } = useAudio();

  return (
    <div className="flex items-center space-x-2">
      <Volume2 className="h-4 w-4" />
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onValueChange={(value) => setVolume(value[0] / 100)}
        className="w-24"
      />
    </div>
  );
});

VolumeControl.displayName = "VolumeControl";

const Queue = React.memo(() => {
  const { queue, currentTrack, playTrack, removeFromQueue } = useAudio();

  const allTracks = useMemo(() => {
    return currentTrack ? [currentTrack, ...queue] : queue;
  }, [currentTrack, queue]);

  return (
    <div className="h-max w-full">
      <div>
        <h3 className="font-semibold mb-2">Queue</h3>
        {allTracks.length === 0 ? (
          <p className="text-gray-500">No songs in queue</p>
        ) : (
          allTracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center justify-between py-1 ${
                index === 0 ? "bg-secondary" : ""
              } hover:bg-secondary/50 cursor-pointer group`}
              onClick={() => index !== 0 && playTrack(index - 1)}
            >
              <div className="flex items-center space-x-2 flex-grow min-w-0">
                <Image width={50} height={50} src={track.image} alt={track.name} className="h-8 w-8 rounded flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm truncate">{track.name}</p>
                  <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                </div>
              </div>
              {index === 0 ? (
                <span className="text-xs text-gray-500 mr-2">Now Playing</span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(track.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});

Queue.displayName = "Queue";

const ProgressSlider = React.memo(() => {
  const { currentTime, duration, seekTo } = useAudio();

  const handleSeek = useCallback(
    (value: number[]) => {
      seekTo(value[0]);
    },
    [seekTo]
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="h-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="absolute top-0 left-0 right-0"
          />
        </TooltipTrigger>
        <TooltipContent>
          {formatTime(currentTime)} / {formatTime(duration)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

ProgressSlider.displayName = "ProgressSlider";

const DurationDisplay = React.memo(() => {
  const { currentTime, duration } = useAudio();

  return (
    <div className="text-xs">
      {formatTime(currentTime)} / {formatTime(duration)}
    </div>
  );
});

DurationDisplay.displayName = "DurationDisplay";

export function Player() {
  const { currentTrack, isPlaying, togglePlay, isLoading } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  const MobilePlayer = useMemo(() => (
    <div className="lg:hidden">
      <div className="fixed inset-x-0 bottom-[56px] bg-background z-50">
        <ProgressSlider />
        <div className="flex items-center justify-between p-2">
          <div className="flex-1 min-w-0 mr-2">
            <TrackInfo />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={togglePlay} disabled={!currentTrack}>
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              <ChevronUp className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="fixed inset-0 bg-background z-40 overflow-y-auto">
          <div className="flex flex-col p-4 ">
            <Button variant="ghost" size="icon" className="self-end mb-4" onClick={() => setIsExpanded(false)}>
              <X className="h-6 w-6" />
            </Button>
            {currentTrack && (
              <Image
                src={currentTrack.previewImage}
                alt={currentTrack.name}
                width={50}
                height={50}
                className="w-full max-w-sm mx-auto aspect-square object-cover rounded-lg shadow-lg mb-4"
              />
            )}
            <div className="my-4 text-center">
              <h2 className="text-2xl font-bold mb-1 truncate">{currentTrack?.name}</h2>
              <p className="text-sm text-gray-500 truncate">{currentTrack?.artist}</p>
            </div>
            <PlayerControls />
            <div className="mx-auto text-sm my-2">
              <DurationDisplay />
            </div>
            <Queue />
          </div>
        </div>
      )}
    </div>
  ), [currentTrack, isPlaying, togglePlay, isLoading, isExpanded]);

  const DesktopPlayer = useMemo(() => (
    <div className="hidden lg:block fixed inset-x-0 bottom-0 bg-background z-50">
      <ProgressSlider />
      <div className="flex items-center justify-between p-2 mt-1 mx-auto">
        <div className="flex-1 min-w-0 mr-4">
          <TrackInfo />
        </div>
        <div className="flex items-center gap-2">
         <div className="border rounded-lg p-2">
         <DurationDisplay />
         </div>
          <PlayerControls />
        </div>
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <VolumeControl />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <ListMusic className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <Queue />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  ), []);

  return (
    <>
      {MobilePlayer}
      {DesktopPlayer}
    </>
  );
}