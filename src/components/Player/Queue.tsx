import { useAudio } from "@/app/contexts/AudioContext";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export const Queue = React.memo(() => {
    const { queue, currentTrack, playTrack, removeFromQueue } = useAudio();
  
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <h3 className="font-semibold mb-2 px-4">Queue</h3>
        <div className="overflow-y-auto flex-grow px-4 pb-4 space-y-2">
          {queue.length === 0 ? (
            <p className="text-muted-foreground">No songs in queue</p>
          ) : (
            queue.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-2 ${
                  currentTrack?.id === track.id ? "bg-secondary" : ""
                } hover:bg-secondary/50 cursor-pointer group rounded-md`}
                onClick={() => playTrack(index)}
              >
                <div className="flex items-center space-x-2 overflow-hidden flex-grow">
                  <img src={track.image} alt={track.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />
                  <div className="overflow-hidden flex-grow min-w-0">
                    <p className="font-medium text-sm truncate">{track.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(track.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  });