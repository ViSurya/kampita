'use client'

// src/app/songs/_components/DownloadButton.tsx
import { Button } from '@/components/ui/button'
import React from 'react'

function DownloadButton({ downloadUrl }: { downloadUrl: string }) {
  return (
    <a download={downloadUrl}>
      <Button>
        Download
      </Button>
    </a>
  )
}

export default DownloadButton