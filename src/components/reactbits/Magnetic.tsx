import React, { useRef, useState, useCallback, useEffect } from 'react';

interface MagneticProps {
  children: React.ReactElement<any>;
  strength?: number; // 0 to 1, default 0.35
  radius?: number; // magnetic influence radius in px
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.35,
  radius = 60,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < radius) {
        const pullX = (e.clientX - centerX) * strength;
        const pullY = (e.clientY - centerY) * strength;
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          setOffset({ x: pullX, y: pullY });
        });
      } else {
        if (offset.x !== 0 || offset.y !== 0) {
          setOffset({ x: 0, y: 0 });
        }
      }
    },
    [radius, strength, offset.x, offset.y]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={ref}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
