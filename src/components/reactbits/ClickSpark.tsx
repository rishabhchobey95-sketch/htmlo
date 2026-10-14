import React, { useState, useCallback } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface ClickSparkProps {
  children?: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
  className?: string;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#818cf8',
  sparkSize = 10,
  sparkCount = 8,
  duration = 500,
  className = '',
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newSpark: Spark = {
        id: Date.now() + Math.random(),
        x,
        y,
      };

      setSparks((prev) => [...prev, newSpark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, duration);
    },
    [duration]
  );

  return (
    <div onClick={handleClick} className={`relative inline-block ${className}`}>
      {children}
      {sparks.map((spark) => (
        <svg
          key={spark.id}
          className="pointer-events-none absolute z-50 overflow-visible"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${sparkSize * 2}px`,
            height: `${sparkSize * 2}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Array.from({ length: sparkCount }).map((_, i) => {
            const angle = (i * 360) / sparkCount;
            const rad = (angle * Math.PI) / 180;
            const x2 = Math.cos(rad) * sparkSize * 1.8;
            const y2 = Math.sin(rad) * sparkSize * 1.8;

            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={x2}
                y2={y2}
                stroke={sparkColor}
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-spark-ray"
                style={{
                  transformOrigin: '0 0',
                }}
              />
            );
          })}
        </svg>
      ))}
    </div>
  );
};
