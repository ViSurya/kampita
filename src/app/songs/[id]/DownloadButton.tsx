"use client"

import { useState, useRef, useEffect } from 'react';

interface DownloadButtonProps {
  downloadUrl: string;
}

function DownloadButton({ downloadUrl }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const controller = useRef<AbortController>(new AbortController());

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch(downloadUrl, { signal: controller.current.signal });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filename = contentDispositionHeader ? /filename="?([^"]+)"?/.exec(contentDispositionHeader)?.[1] : null;

      const contentLength = Number(response.headers.get('Content-Length') || 0);
      let receivedLength = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (!reader) {
        throw new Error('Could not read response body');
      }

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
      link.download = filename || 'download'; // Use original filename or default
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
      setProgress(0);
      controller.current.abort();
    }
  };

  useEffect(() => {
    return () => controller.current.abort();
  }, []);

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

export default DownloadButton;
