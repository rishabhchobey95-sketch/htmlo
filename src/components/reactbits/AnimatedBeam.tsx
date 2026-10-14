import React, { useId } from 'react';

export interface BeamCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface AnimatedBeamProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curvature?: number;
  color?: string;
  particleColor?: string;
  duration?: number;
  strokeWidth?: number;
  className?: string;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  startX,
  startY,
  endX,
  endY,
  curvature = 0.35,
  color = 'rgba(99, 102, 241, 0.35)',
  particleColor = '#818cf8',
  duration = 2,
  strokeWidth = 2,
  className = '',
}) => {
  const id = useId();
  const gradId = `beam-grad-${id}`;
  const pulseId = `beam-pulse-${id}`;

  // Calculate cubic bezier control points
  const dx = endX - startX;
  const dy = endY - startY;
  const cx1 = startX + dx * 0.5;
  const cy1 = startY + dy * curvature;
  const cx2 = startX + dx * 0.5;
  const cy2 = endY - dy * curvature;

  const pathData = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;

  return (
    <svg
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'visible',
        filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))',
      }}
    >
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={startX} y1={startY} x2={endX} y2={endY}>
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>

        <linearGradient id={pulseId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={particleColor} stopOpacity="0" />
          <stop offset="50%" stopColor={particleColor} stopOpacity="1" />
          <stop offset="100%" stopColor={particleColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background static path */}
      <path
        d={pathData}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Flowing animated pulse laser path */}
      <path
        d={pathData}
        fill="none"
        stroke={`url(#${pulseId})`}
        strokeWidth={strokeWidth + 1}
        strokeLinecap="round"
        strokeDasharray="60 300"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="360"
          to="-360"
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Target impact beacon circles */}
      <circle cx={endX} cy={endY} r="4" fill={particleColor}>
        <animate attributeName="r" values="3;6;3" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};
