import React, { useState } from 'react';
import {
  Layout,
  ArrowsLeftRight,
  Code,
  SquareSplitHorizontal,
  Browsers,
  ArrowCounterClockwise,
  CaretDown,
} from '@phosphor-icons/react';
import { DockLayoutState } from '../types/dock';

interface DockLayoutManagerProps {
  layout: DockLayoutState;
  onUpdateLayout: (updater: (prev: DockLayoutState) => DockLayoutState) => void;
  onResetLayout: () => void;
  onSwapSideDocks: () => void;
}

export const DockLayoutManager: React.FC<DockLayoutManagerProps> = ({
  layout,
  onUpdateLayout,
  onResetLayout,
  onSwapSideDocks,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Layout Presets
  const applyPreset = (preset: 'default' | 'swapped' | 'code-split' | 'floating' | 'focus') => {
    onUpdateLayout((prev) => {
      switch (preset) {
        case 'default':
          return {
            ...prev,
            palettePosition: 'left',
            inspectorPosition: 'right',
            codePosition: prev.codePosition === 'hidden' ? 'hidden' : 'bottom',
          };
        case 'swapped':
          return {
            ...prev,
            palettePosition: 'right',
            inspectorPosition: 'left',
          };
        case 'code-split':
          return {
            ...prev,
            palettePosition: 'left',
            inspectorPosition: 'hidden',
            codePosition: 'right',
            codeWidth: 540,
          };
        case 'floating':
          return {
            ...prev,
            palettePosition: 'floating',
            inspectorPosition: 'floating',
            codePosition: prev.codePosition === 'hidden' ? 'hidden' : 'floating',
          };
        case 'focus':
          return {
            ...prev,
            palettePosition: 'hidden',
            inspectorPosition: 'hidden',
          };
        default:
          return prev;
      }
    });
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="stripo-pill-btn"
        title="Manage Editor Windows, Docking & Layouts"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 11px',
          borderRadius: '8px',
          backgroundColor: isOpen ? '#f1f5f9' : '#ffffff',
          border: '1px solid #cbd5e1',
          color: '#334155',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Layout size={15} weight="bold" color="#22c55e" />
        <span>Docking &amp; Windows</span>
        <CaretDown size={13} color="#64748b" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '40px',
            right: 0,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.16), 0 2px 10px rgba(15, 23, 42, 0.06)',
            border: '1px solid #cbd5e1',
            zIndex: 150,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Window Docking System</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Shift, dock, and float editor panels</div>
            </div>
            <button
              onClick={onSwapSideDocks}
              title="Instant swap left and right panels"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowsLeftRight size={13} color="#22c55e" />
              <span>Swap</span>
            </button>
          </div>

          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Presets */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                Layout Presets
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'default', label: 'Default 3-Pane', icon: <SquareSplitHorizontal size={14} /> },
                  { id: 'swapped', label: 'Reversed Docks', icon: <ArrowsLeftRight size={14} /> },
                  { id: 'code-split', label: 'Code & Canvas', icon: <Code size={14} /> },
                  { id: 'floating', label: 'Floating Windows', icon: <Browsers size={14} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => applyPreset(item.id as any)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#1e293b',
                      fontSize: '12px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

            {/* Individual Panel Controls */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                Panels Docking Position
              </label>
              
              {/* Palette / Left Dock */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Blocks Palette</span>
                <div style={{ display: 'flex', gap: '2px', backgroundColor: '#edeef1', padding: '2px', borderRadius: '6px' }}>
                  {(['left', 'right', 'floating', 'hidden'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onUpdateLayout((prev) => ({ ...prev, palettePosition: pos }))}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: layout.palettePosition === pos ? 700 : 500,
                        backgroundColor: layout.palettePosition === pos ? '#ffffff' : 'transparent',
                        color: layout.palettePosition === pos ? '#1e293b' : '#64748b',
                        boxShadow: layout.palettePosition === pos ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {pos === 'hidden' ? 'Hide' : pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspector Panel */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Inspector Panel</span>
                <div style={{ display: 'flex', gap: '2px', backgroundColor: '#edeef1', padding: '2px', borderRadius: '6px' }}>
                  {(['left', 'right', 'floating', 'hidden'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onUpdateLayout((prev) => ({ ...prev, inspectorPosition: pos }))}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: layout.inspectorPosition === pos ? 700 : 500,
                        backgroundColor: layout.inspectorPosition === pos ? '#ffffff' : 'transparent',
                        color: layout.inspectorPosition === pos ? '#1e293b' : '#64748b',
                        boxShadow: layout.inspectorPosition === pos ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {pos === 'hidden' ? 'Hide' : pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Editor */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Code Editor</span>
                <div style={{ display: 'flex', gap: '2px', backgroundColor: '#edeef1', padding: '2px', borderRadius: '6px' }}>
                  {(['bottom', 'right', 'floating', 'hidden'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onUpdateLayout((prev) => ({ ...prev, codePosition: pos }))}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: layout.codePosition === pos ? 700 : 500,
                        backgroundColor: layout.codePosition === pos ? '#ffffff' : 'transparent',
                        color: layout.codePosition === pos ? '#1e293b' : '#64748b',
                        boxShadow: layout.codePosition === pos ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {pos === 'hidden' ? 'Hide' : pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer: Reset Button */}
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => {
                onResetLayout();
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#64748b',
                background: 'none',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <ArrowCounterClockwise size={13} />
              <span>Reset Default Layout</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#22c55e',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
