import React, { useRef, useState, useEffect } from 'react';

export interface FluidTabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface FluidTabsProps<T extends string> {
  tabs: FluidTabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
  activeColor?: string;
}

export function FluidTabs<T extends string>({
  tabs,
  activeId,
  onChange,
  className = '',
  activeColor = '#4f46e5',
}: FluidTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(`[data-tab-id="${activeId}"]`);
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [activeId, tabs]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center p-1 rounded-lg bg-[#0e0e12] border border-white/[0.08] ${className}`}
    >
      {/* Sliding Active Indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-md transition-all duration-250 ease-out z-0 shadow-sm"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          backgroundColor: activeColor,
        }}
      />

      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-md transition-colors duration-150 cursor-pointer select-none ${
              isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.icon && <span className="text-sm shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
