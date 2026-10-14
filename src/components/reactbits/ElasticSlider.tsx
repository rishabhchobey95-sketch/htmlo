import React, { useState, useRef } from 'react';

interface ElasticSliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export const ElasticSlider: React.FC<ElasticSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [overscroll, setOverscroll] = useState(0);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const updateFromPointer = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const rawPct = relativeX / rect.width;

    if (rawPct < 0) {
      setOverscroll(Math.max(-12, rawPct * 40));
      onChange(min);
    } else if (rawPct > 1) {
      setOverscroll(Math.min(12, (rawPct - 1) * 40));
      onChange(max);
    } else {
      setOverscroll(0);
      const calculated = min + rawPct * (max - min);
      const stepped = Math.round(calculated / step) * step;
      onChange(Math.min(max, Math.max(min, stepped)));
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setOverscroll(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
          <span>{label}</span>
          <span className="font-mono text-zinc-300">
            {value}
            {unit}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-6 flex items-center cursor-pointer select-none"
        style={{
          transform: `scaleX(${1 + Math.abs(overscroll) * 0.005})`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Track */}
        <div className="relative w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          {/* Filled Bar */}
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 rounded-full bg-white shadow-lg border border-indigo-400 flex items-center justify-center transition-transform ${
            isDragging ? 'scale-125' : 'scale-100 hover:scale-110'
          }`}
          style={{
            left: `${percentage}%`,
            transform: `translate(-50%, -50%) translateX(${overscroll}px)`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
        </div>
      </div>
    </div>
  );
};
