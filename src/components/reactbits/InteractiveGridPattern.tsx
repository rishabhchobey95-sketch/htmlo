import React, { useRef, useState, useCallback, useEffect } from 'react';

interface InteractiveGridPatternProps {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  glowRadius?: number;
  primaryColor?: string;
}

export const InteractiveGridPattern: React.FC<InteractiveGridPatternProps> = ({
  width = 32,
  height = 32,
  className = '',
  glowRadius = 180,
  primaryColor = 'rgba(99, 102, 241, 0.18)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full stroke-white/[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="interactive-canvas-grid"
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <path d={`M ${width} 0 L 0 0 0 ${height}`} fill="none" strokeWidth="1" />
            <circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#interactive-canvas-grid)" />
      </svg>

      {/* Radial Interactive Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          background: `radial-gradient(${glowRadius}px circle at ${mousePos.x}px ${mousePos.y}px, ${primaryColor}, transparent 80%)`,
        }}
      />
    </div>
  );
};
