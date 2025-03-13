'use client';

import { useEffect, useState } from 'react';

interface IconifyIconProps {
  icon: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  onClick?: () => void;
}

export default function IconifyIcon({ icon, className = '', width, height, onClick }: IconifyIconProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Material Icons'u yükle
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      setIsLoaded(true);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, []);

  // İkon adını Material Icons formatına dönüştür
  const getIconName = (iconName: string) => {
    // "material-symbols:movie" -> "movie"
    return iconName.split(':').pop() || iconName;
  };

  // Sunucu tarafında veya yükleme durumunda placeholder göster
  if (!isLoaded || typeof window === 'undefined') {
    return (
      <div 
        className={`inline-block bg-gray-700/20 rounded animate-pulse ${className}`}
        style={{ 
          width: width || '24px',
          height: height || '24px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }

  return (
    <span
      className={`material-icons ${className}`}
      style={{ 
        fontSize: width || '24px',
        width: width || '24px',
        height: height || '24px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClick}
    >
      {getIconName(icon)}
    </span>
  );
}
