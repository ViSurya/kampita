   'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DownloadButtonProps {
  downloadUrl: string;
}

const DownloadButton = ({ downloadUrl }: DownloadButtonProps) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const controller = useRef<AbortController | null>(null);

  const getFileNameFromUrl = (url: string): string => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  };

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);
    controller.current = new AbortController();

    try {
      const response = await fetch(downloadUrl, { signal: controller.current.signal });
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

      const filename = getFileNameFromUrl(downloadUrl);
      const contentLength = Number(response.headers.get('Content-Length') || 0);
      let receivedLength = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (!reader) throw new Error('Could not read response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        setProgress(Math.round((receivedLength / contentLength) * 100));
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Download failed:', error);
      }
    } finally {
      setDownloading(false);
      setProgress(0);
      controller.current = null;
    }
  };

  useEffect(() => {
    return () => controller.current?.abort();
  }, []);

  return (
    <div className="w-full">
      {downloading ? (
        <div className="w-full">
          <Progress value={progress} className="w-full mb-2" />
          <p className="text-center text-sm">{progress}%</p>
        </div>
      ) : (
        <Button onClick={handleDownload}>Download</Button>
      )}
    </div>
  );
};

export default DownloadButton;
