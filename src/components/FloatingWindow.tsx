import React, { useState, useRef } from 'react';
import {
  X,
  Minus,
  ArrowsOut,
  ArrowsIn,
  ArrowBendDownLeft,
  ArrowBendDownRight,
  DotsSixVertical,
} from '@phosphor-icons/react';
import { FloatingWindowState, DockPosition, CodeDockPosition } from '../types/dock';

interface FloatingWindowProps {
  title: string;
  icon?: React.ReactNode;
  initialState: FloatingWindowState;
  onStateChange: (state: FloatingWindowState) => void;
  onDock: (target: DockPosition | CodeDockPosition) => void;
  supportedDocks?: Array<{ target: DockPosition | CodeDockPosition; label: string; icon: React.ReactNode }>;
  onClose?: () => void;
  children: React.ReactNode;
}

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  title,
  icon,
  initialState,
  onStateChange,
  onDock,
  supportedDocks,
  onClose,
  children,
}) => {
  const [pos, setPos] = useState({ x: initialState.x, y: initialState.y });
  const [size, setSize] = useState({ width: initialState.width, height: initialState.height });
  const [isMinimized, setIsMinimized] = useState(initialState.isMinimized || false);
  const [isMaximized, setIsMaximized] = useState(false);

  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ isResizing: false, startX: 0, startY: 0, initialW: 0, initialH: 0 });

  // Update parent when pos or size changes
  const updateParent = (newPos = pos, newSize = size, minimized = isMinimized) => {
    onStateChange({
      x: newPos.x,
      y: newPos.y,
      width: newSize.width,
      height: newSize.height,
      isMinimized: minimized,
    });
  };

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };

    const shield = document.createElement('div');
    shield.id = 'floating-window-drag-shield';
    shield.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:grabbing;user-select:none;';
    document.body.appendChild(shield);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      const nextX = Math.max(10, Math.min(window.innerWidth - 120, dragRef.current.initialX + dx));
      const nextY = Math.max(50, Math.min(window.innerHeight - 80, dragRef.current.initialY + dy));
      setPos({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      if (shield.parentNode) shield.parentNode.removeChild(shield);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateParent();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    resizeRef.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      initialW: size.width,
      initialH: size.height,
    };

    const shield = document.createElement('div');
    shield.id = 'floating-window-resize-shield';
    shield.style.cssText = 'position:fixed;inset:0;z-index:99999;cursor:se-resize;user-select:none;';
    document.body.appendChild(shield);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current.isResizing) return;
      const dw = moveEvent.clientX - resizeRef.current.startX;
      const dh = moveEvent.clientY - resizeRef.current.startY;
      const nextW = Math.max(260, Math.min(window.innerWidth - 40, resizeRef.current.initialW + dw));
      const nextH = Math.max(180, Math.min(window.innerHeight - 100, resizeRef.current.initialH + dh));
      setSize({ width: nextW, height: nextH });
    };

    const handleMouseUp = () => {
      resizeRef.current.isResizing = false;
      if (shield.parentNode) shield.parentNode.removeChild(shield);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      updateParent();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const defaultDocks = supportedDocks || [
    { target: 'left' as DockPosition, label: 'Dock Left', icon: <ArrowBendDownLeft size={14} /> },
    { target: 'right' as DockPosition, label: 'Dock Right', icon: <ArrowBendDownRight size={14} /> },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: isMaximized ? '20px' : `${pos.x}px`,
        top: isMaximized ? '70px' : `${pos.y}px`,
        width: isMaximized ? 'calc(100vw - 40px)' : `${size.width}px`,
        height: isMinimized ? '44px' : isMaximized ? 'calc(100vh - 90px)' : `${size.height}px`,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.22), 0 4px 14px rgba(15, 23, 42, 0.08)',
        border: '1px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        overflow: 'hidden',
        transition: isMaximized ? 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }}
    >
      {/* Draggable Title Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        style={{
          height: '44px',
          backgroundColor: '#f8fafc',
          borderBottom: isMinimized ? 'none' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DotsSixVertical size={16} color="#94a3b8" />
          {icon}
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{title}</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Quick Dock Buttons */}
          {defaultDocks.map((dock) => (
            <button
              key={dock.label}
              onClick={() => onDock(dock.target)}
              title={dock.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 6px',
                fontSize: '11px',
                fontWeight: 500,
                color: '#475569',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {dock.icon}
              <span style={{ display: size.width > 340 ? 'inline' : 'none' }}>{dock.label.replace('Dock ', '')}</span>
            </button>
          ))}

          {/* Minimize */}
          <button
            onClick={() => {
              const next = !isMinimized;
              setIsMinimized(next);
              updateParent(pos, size, next);
            }}
            title={isMinimized ? 'Expand window' : 'Minimize window'}
            style={{
              padding: '5px',
              borderRadius: '6px',
              border: 'none',
              background: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Minus size={14} />
          </button>

          {/* Maximize */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restore window' : 'Maximize window'}
            style={{
              padding: '5px',
              borderRadius: '6px',
              border: 'none',
              background: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {isMaximized ? <ArrowsIn size={14} /> : <ArrowsOut size={14} />}
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close window"
              style={{
                padding: '5px',
                borderRadius: '6px',
                border: 'none',
                background: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      {!isMinimized && (
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative' }}>
          {children}

          {/* Resize Corner Handle */}
          {!isMaximized && (
            <div
              onMouseDown={handleMouseDownResize}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '16px',
                height: '16px',
                cursor: 'nwse-resize',
                zIndex: 30,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: '2px',
              }}
              title="Drag to resize"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M9 1L1 9M9 5L5 9M9 8L8 9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
