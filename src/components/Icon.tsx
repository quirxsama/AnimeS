'use client';

import { useEffect, useState } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
  icon: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function Icon({ icon, className = '', width = '1em', height = '1em' }: IconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span 
        className={className} 
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'inline-block' 
        }} 
      />
    );
  }

  return (
    <IconifyIcon 
      icon={icon}
      className={className}
      width={width}
      height={height}
    />
  );
}
