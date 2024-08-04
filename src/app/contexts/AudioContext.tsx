"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  image: string;
  previewImage: string
}

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  hasAudioData: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentTrack: Track | null;
  queue: Track[];
  playHistory: Track[];
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  setCurrentTrack: (track: Track | null) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playTrack: (index: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'audioPlayerState';
const MAX_HISTORY_LENGTH = 30;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playHistory, setPlayHistory] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const saveState = useCallback(() => {
    const stateToSave = {
      volume,
      queue,
      playHistory,
      isShuffle,
      repeatMode,
      currentTrack,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [volume, queue, playHistory, isShuffle, repeatMode, currentTrack]);

  const restoreState = useCallback(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setVolume(parsedState.volume || 1);
      setQueue(parsedState.queue || []);
      setPlayHistory(parsedState.playHistory || []);
      setIsShuffle(parsedState.isShuffle || false);
      setRepeatMode(parsedState.repeatMode || 'off');
      setCurrentTrack(parsedState.currentTrack || null);
      setIsPlaying(false); // Ensure it's not playing on restore
      
    }
  }, []);;

  useEffect(() => {
    restoreState();
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [restoreState]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      setIsLoading(false);
    }
  }, [currentTrack]);

  // const togglePlay = useCallback(() => {
  //   if (!audioRef.current) return;
  //   if (isPlaying) {
  //     audioRef.current.pause();
  //     setIsPlaying(false);
  //   } else if (currentTrack) {
  //     if (audioRef.current.ended) {
  //       audioRef.current.currentTime = 0;
  //     }
  //     audioRef.current.play().catch(console.error);
  //     setIsPlaying(true);
  //   }
  //   saveState();
  // }, [isPlaying, currentTrack, saveState]);
  //
  // const seekTo = useCallback((time: number) => {
  //   if (audioRef.current) {
  //     audioRef.current.currentTime = time;
  //   }
  // }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (currentTrack) {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
    saveState();
  }, [isPlaying, currentTrack, saveState]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      setIsLoading(true);
      audioRef.current.currentTime = time;
      if (isPlaying) {
        audioRef.current.play()
          .then(() => setIsLoading(false))
          .catch(error => {
            console.error("Seek failed:", error);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  }, [isPlaying]);


  const addToPlayHistory = useCallback((track: Track) => {
    setPlayHistory(prev => [track, ...prev].slice(0, MAX_HISTORY_LENGTH));
    saveState();
  }, [saveState]);

  const playNext = useCallback(() => {
    if (currentTrack) {
      addToPlayHistory(currentTrack);
    }
    
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }
  
    let nextTrack: Track | null = null;
  
    if (queue.length > 0) {
      nextTrack = isShuffle ? queue[Math.floor(Math.random() * queue.length)] : queue[0];
      setQueue(prev => prev.filter(track => track.id !== nextTrack!.id));
    } else if (repeatMode === 'all') {
      const allTracks = [...playHistory, currentTrack!].filter(Boolean).reverse();
      setQueue(allTracks);
      nextTrack = allTracks[0];
      setPlayHistory([]);
    }
  
    if (nextTrack) {
      setCurrentTrack(nextTrack);
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    saveState();
  }, [queue, repeatMode, isShuffle, currentTrack, playHistory, addToPlayHistory, saveState]);

  const playPrevious = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (playHistory.length > 0) {
      const previousTrack = playHistory[0];
      setCurrentTrack(previousTrack);
      setPlayHistory(prev => prev.slice(1));
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }
    } else if (repeatMode === 'all' && currentTrack) {
      const allTracks = [currentTrack, ...queue];
      setPlayHistory(allTracks.slice(0, -1));
      setCurrentTrack(allTracks[allTracks.length - 1]);
      setQueue([]);
    }
    saveState();
  }, [currentTime, playHistory, currentTrack, queue, repeatMode, saveState]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    saveState();
  }, [saveState]);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
    saveState();
  }, [saveState]);

  const handleSetVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    saveState();
  }, [saveState]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
    saveState();
  }, [saveState]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
    saveState();
  }, [saveState]);

  const playTrack = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      const trackToPlay = queue[index];
      if (currentTrack) {
        addToPlayHistory(currentTrack);
      }
      setCurrentTrack(trackToPlay);
      setQueue(prev => prev.filter(track => track.id !== trackToPlay.id));
      saveState();
    }
  }, [queue, currentTrack, addToPlayHistory, saveState]);

  const setCurrentTrackAndUpdateHistory = useCallback((track: Track | null) => {
    if (currentTrack) {
      addToPlayHistory(currentTrack);
    }
    setCurrentTrack(track);
    saveState();
  }, [currentTrack, addToPlayHistory, saveState]);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(audioRef.current?.duration || 0);
    const handleEnded = () => playNext();

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [playNext]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoading(true);
      audioRef.current.src = currentTrack.url;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [currentTrack]);

  const hasAudioData = Boolean(currentTrack || queue.length > 0 || playHistory.length > 0);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isLoading,
        hasAudioData, 
        currentTime,
        duration,
        volume,
        currentTrack,
        queue,
        playHistory,
        isShuffle,
        repeatMode,
        togglePlay,
        setVolume: handleSetVolume,
        seekTo,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue,
        setCurrentTrack: setCurrentTrackAndUpdateHistory,
        toggleShuffle,
        toggleRepeat,
        playTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
