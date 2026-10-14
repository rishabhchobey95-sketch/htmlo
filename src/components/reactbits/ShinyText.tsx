import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number; // seconds
  className?: string;
  color?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  className = '',
  color = '#b5b5b5',
}) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        color: disabled ? color : undefined,
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, ${color} 0%, ${color} 35%, #ffffff 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: '200% 100%',
        animation: disabled ? 'none' : `shinyTextSweep ${speed}s linear infinite`,
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
    </span>
  );
};
