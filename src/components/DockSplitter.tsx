import React, { useRef } from 'react';

interface DockSplitterProps {
  direction: 'vertical' | 'horizontal';
  onResize: (delta: number) => void;
  style?: React.CSSProperties;
}

export const DockSplitter: React.FC<DockSplitterProps> = ({
  direction,
  onResize,
  style,
}) => {
  const isDraggingRef = useRef(false);
  const startCoordRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startCoordRef.current = direction === 'vertical' ? e.clientX : e.clientY;

    const shield = document.createElement('div');
    shield.id = 'dock-splitter-drag-shield';
    shield.style.cssText = `position:fixed;inset:0;z-index:99999;cursor:${direction === 'vertical' ? 'col-resize' : 'row-resize'};user-select:none;`;
    document.body.appendChild(shield);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const currentCoord = direction === 'vertical' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentCoord - startCoordRef.current;
      startCoordRef.current = currentCoord;
      onResize(delta);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      if (shield.parentNode) shield.parentNode.removeChild(shield);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    document.body.style.cursor = direction === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative',
        width: direction === 'vertical' ? '6px' : '100%',
        height: direction === 'vertical' ? '100%' : '6px',
        cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
        backgroundColor: 'transparent',
        zIndex: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        const line = e.currentTarget.querySelector('.splitter-line') as HTMLElement;
        if (line) line.style.backgroundColor = '#22c55e';
      }}
      onMouseLeave={(e) => {
        const line = e.currentTarget.querySelector('.splitter-line') as HTMLElement;
        if (line) line.style.backgroundColor = '#e2e8f0';
      }}
    >
      <div
        className="splitter-line"
        style={{
          width: direction === 'vertical' ? '2px' : '100%',
          height: direction === 'vertical' ? '100%' : '2px',
          backgroundColor: '#e2e8f0',
          borderRadius: '1px',
          transition: 'background-color 0.15s ease',
        }}
      />
    </div>
  );
};
