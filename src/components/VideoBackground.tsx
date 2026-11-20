'use client';

import { useState, useEffect } from 'react';

interface VideoBackgroundProps {
  src: string;
  mobileSrc?: string;
  className?: string;
}

export function VideoBackground({ src, mobileSrc, className = '' }: VideoBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [isReelFormat, setIsReelFormat] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!mobileSrc) return;

    // Detect mobile viewport or portrait reel aspect ratio
    const mediaQuery = window.matchMedia('(max-width: 768px), (orientation: portrait)');
    setIsReelFormat(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsReelFormat(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mobileSrc]);

  if (!mounted) {
    return <div className={className} style={{ width: '100%', height: '100%', background: '#111' }} />;
  }

  const activeSrc = mobileSrc && isReelFormat ? mobileSrc : src;

  return (
    <video
      key={activeSrc}
      className={className}
      src={activeSrc}
      data-format={mobileSrc && isReelFormat ? 'reel' : 'landscape'}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}

