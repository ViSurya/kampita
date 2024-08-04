'use client';

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'

export function DownloadButton({ downloadUrl }: { downloadUrl: string }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || '0');
      let receivedLength = 0;
      const chunks = [];

      while(true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        chunks.push(value);
        receivedLength += value.length;
        setProgress(Math.round((receivedLength / contentLength) * 100));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'song.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download complete",
        description: "Your file has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  }, [downloadUrl]);

  return (
    <div className="w-full">
      {downloading ? (
        <div className="w-full">
          <Progress value={progress} className="w-[100px] mb-2" />
          <p className="text-center text-sm">{progress}%</p>
        </div>
      ) : (
        <Button onClick={handleDownload}>Download</Button>
      )}
    </div>
  );
}
