import React from 'react';

interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  borderRadius?: number;
  children: React.ReactNode;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'div',
  className = '',
  color = '#6366f1',
  speed = '6s',
  thickness = 1,
  borderRadius = 12,
  children,
  style,
  ...props
}) => {
  return (
    <Component
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        padding: `${thickness}px`,
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
      {...props}
    >
      {/* Animated rotating conic gradient */}
      <div
        style={{
          position: 'absolute',
          inset: '-100%',
          pointerEvents: 'none',
          opacity: 0.9,
          animation: `spinSlow ${speed} linear infinite`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 60deg, ${color} 120deg, transparent 180deg, transparent 240deg, ${color} 300deg, transparent 360deg)`,
        }}
      />
      {/* Inner background container to isolate content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          backgroundColor: '#111115',
          borderRadius: `${Math.max(0, borderRadius - thickness)}px`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </Component>
  );
};
