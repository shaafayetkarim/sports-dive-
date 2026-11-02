'use client';

import { useState, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  className?: string;
}

export function VideoBackground({ src, className = '' }: VideoBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ width: '100%', height: '100%', background: '#111' }} />;
  }

  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

