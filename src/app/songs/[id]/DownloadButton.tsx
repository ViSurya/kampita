'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function DownloadButton({ downloadUrl }: { downloadUrl: string }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const reader = response.body?.getReader();
      const contentLength = +(response.headers.get('Content-Length') || '0');
      let receivedLength = 0;

      while(true) {
        const { done, value } = await reader?.read() || {};
        if (done || !value) break;

        receivedLength += value.length;
        setProgress(Math.round((receivedLength / contentLength) * 100));

        // Here you would typically append `value` to a buffer or stream to a file
        // For simplicity, we're just updating the progress
      }

      // Implement actual file download logic here
      console.log('Download complete');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

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
