import React, { useRef, useState, useCallback } from 'react';

interface ScrubInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ScrubInput: React.FC<ScrubInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 1,
  label,
  unit = 'px',
  icon,
  className = '',
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState(String(value));
  const startXRef = useRef(0);
  const startValRef = useRef(value);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    startXRef.current = e.clientX;
    startValRef.current = value;
    setIsScrubbing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isScrubbing) return;
      const dx = e.clientX - startXRef.current;
      let multiplier = 1;
      if (e.shiftKey) multiplier = 10;
      if (e.altKey) multiplier = 0.1;

      const deltaValue = Math.round((dx / 2) * step * multiplier);
      let nextVal = startValRef.current + deltaValue;
      if (min !== undefined) nextVal = Math.max(min, nextVal);
      if (max !== undefined) nextVal = Math.min(max, nextVal);
      onChange(nextVal);
    },
    [isScrubbing, min, max, step, onChange]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseFloat(tempVal);
      if (!isNaN(parsed)) {
        let clamped = parsed;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        onChange(clamped);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setTempVal(String(value));
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 h-8 px-2 rounded-md bg-[#16161b] border border-white/[0.08] hover:border-white/[0.18] transition-colors ${
        isScrubbing ? 'cursor-ew-resize border-indigo-500/70 bg-[#1e1e26]' : ''
      } ${className}`}
    >
      {/* Draggable Icon / Label */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex items-center gap-1 cursor-ew-resize select-none text-zinc-400 hover:text-zinc-200"
        title="Drag horizontally to scrub. Hold Shift for 10x, Alt for fine 0.1x"
      >
        {icon}
        {label && <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</span>}
      </div>

      {/* Numeric value / Direct Input */}
      {isEditing ? (
        <input
          autoFocus
          type="number"
          value={tempVal}
          onChange={(e) => setTempVal(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={() => {
            const parsed = parseFloat(tempVal);
            if (!isNaN(parsed)) {
              let clamped = parsed;
              if (min !== undefined) clamped = Math.max(min, clamped);
              if (max !== undefined) clamped = Math.min(max, clamped);
              onChange(clamped);
            }
            setIsEditing(false);
          }}
          className="w-12 bg-transparent text-right font-mono text-xs text-white outline-none"
        />
      ) : (
        <span
          onClick={() => {
            setTempVal(String(value));
            setIsEditing(true);
          }}
          className="font-mono text-xs text-zinc-200 hover:text-white cursor-text select-none px-1 rounded hover:bg-white/[0.06]"
        >
          {value}
          <span className="text-[10px] text-zinc-500 ml-0.5">{unit}</span>
        </span>
      )}
    </div>
  );
};
