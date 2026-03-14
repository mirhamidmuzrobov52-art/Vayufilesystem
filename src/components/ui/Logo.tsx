import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src="/src/assets/IMG_20260314_092531_497.jpg" 
        alt="ARXUN Logo" 
        className={cn("object-contain", sizes[size])}
        referrerPolicy="no-referrer"
      />
      <span className={cn("font-bold tracking-widest text-m3-on-surface uppercase", 
        size === 'sm' ? 'text-[20px]' : size === 'md' ? 'text-xl' : 'text-3xl'
      )}>KATM</span>
    </div>
  );
};
