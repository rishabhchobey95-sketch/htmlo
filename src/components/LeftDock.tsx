import React, { useState } from 'react';
import {
  SquaresFour,
  TextT,
  Image as ImageIcon,
  RadioButton,
  ArrowsVertical,
  Minus,
  ShareNetwork,
  VideoCamera,
  CodeBlock,
  HourglassHigh,
  ListDashes,
  Columns,
  Browsers,
  ArrowsLeftRight,
  ArrowSquareOut,
  X,
  Shapes,
} from '@phosphor-icons/react';
import { ActiveTab, BlockType } from '../types/editor';
import { DockPosition } from '../types/dock';

interface LeftDockProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onAddBlock: (type: BlockType) => void;
  onAddLayout: (cols: number[]) => void;
  onApplyModule: (moduleType: string) => void;
  dockPosition?: DockPosition;
  onShiftDock?: (target: DockPosition) => void;
  onFloat?: () => void;
  onClose?: () => void;
}

export const LeftDock: React.FC<LeftDockProps> = ({
  activeTab,
  setActiveTab,
  onAddBlock,
  onAddLayout,
  onApplyModule,
  dockPosition = 'left',
  onShiftDock,
  onFloat,
  onClose,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const blockItems: Array<{ type: BlockType; label: string; icon: React.ReactNode }> = [
    { type: 'image', label: 'Image', icon: <ImageIcon size={22} color="#475569" /> },
    { type: 'text', label: 'Text', icon: <TextT size={22} color="#475569" /> },
    { type: 'button', label: 'Button', icon: <RadioButton size={22} color="#475569" /> },
    { type: 'shape', label: 'Shapes', icon: <Shapes size={22} color="#475569" /> },
    { type: 'divider', label: 'Lines / Rule', icon: <Minus size={22} color="#475569" /> },
    { type: 'spacer', label: 'Spacer', icon: <ArrowsVertical size={22} color="#475569" /> },
    { type: 'social', label: 'Social', icon: <ShareNetwork size={22} color="#475569" /> },
    { type: 'video', label: 'Video', icon: <VideoCamera size={22} color="#475569" /> },
    { type: 'html', label: 'HTML', icon: <CodeBlock size={22} color="#475569" /> },
    { type: 'menu', label: 'Menu', icon: <ListDashes size={22} color="#475569" /> },
    { type: 'timer', label: 'Timer', icon: <HourglassHigh size={22} color="#475569" /> },
  ];

  const layoutPresets = [
    { name: '1 Column', cols: [100] },
    { name: '2 Columns', cols: [50, 50] },
    { name: '2 Columns (1/3 + 2/3)', cols: [33, 67] },
    { name: '2 Columns (2/3 + 1/3)', cols: [67, 33] },
    { name: '3 Columns', cols: [33.33, 33.33, 33.33] },
    { name: '4 Columns', cols: [25, 25, 25, 25] },
  ];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height))', zIndex: 40 }}>
      {/* Stripo Left Icon Rail */}
      <aside
        style={{
          width: 'var(--sidebar-rail-width)',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--stripo-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: '8px',
        }}
      >
        <button
          onClick={() => {
            setActiveTab('layouts');
            setDrawerOpen(true);
          }}
          title="Structures & Layouts"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'layouts' && drawerOpen ? '#22c55e' : '#64748b',
            backgroundColor: activeTab === 'layouts' && drawerOpen ? '#f0fdf4' : 'transparent',
            border: activeTab === 'layouts' && drawerOpen ? '1px solid #bbf7d0' : '1px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Columns size={20} weight={activeTab === 'layouts' ? 'bold' : 'regular'} />
        </button>

        <button
          onClick={() => {
            setActiveTab('blocks');
            setDrawerOpen(true);
          }}
          title="Blocks"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'blocks' && drawerOpen ? '#22c55e' : '#64748b',
            backgroundColor: activeTab === 'blocks' && drawerOpen ? '#f0fdf4' : 'transparent',
            border: activeTab === 'blocks' && drawerOpen ? '1px solid #bbf7d0' : '1px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <SquaresFour size={20} weight={activeTab === 'blocks' ? 'bold' : 'regular'} />
        </button>

        <button
          onClick={() => {
            setActiveTab('modules');
            setDrawerOpen(true);
          }}
          title="Modules"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'modules' && drawerOpen ? '#22c55e' : '#64748b',
            backgroundColor: activeTab === 'modules' && drawerOpen ? '#f0fdf4' : 'transparent',
            border: activeTab === 'modules' && drawerOpen ? '1px solid #bbf7d0' : '1px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Browsers size={20} weight={activeTab === 'modules' ? 'bold' : 'regular'} />
        </button>
      </aside>

      {/* Slide-out Drawer Panel */}
      {drawerOpen && (
        <section
          style={{
            width: 'var(--sidebar-drawer-width)',
            backgroundColor: '#ffffff',
            borderRight: '1px solid var(--stripo-border)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--stripo-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'capitalize' }}>
              {activeTab === 'blocks' ? 'Blocks' : activeTab === 'layouts' ? 'Structures' : 'Modules'}
            </span>

            {/* Dock & Shift Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {onShiftDock && (
                <button
                  onClick={() => onShiftDock(dockPosition === 'left' ? 'right' : 'left')}
                  title={`Shift dock to ${dockPosition === 'left' ? 'right' : 'left'} side`}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '5px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '11px',
                  }}
                >
                  <ArrowsLeftRight size={13} color="#22c55e" />
                  <span>{dockPosition === 'left' ? 'Right' : 'Left'}</span>
                </button>
              )}

              {onFloat && (
                <button
                  onClick={onFloat}
                  title="Float / Detach window"
                  style={{
                    padding: '4px',
                    borderRadius: '5px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ArrowSquareOut size={13} />
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  title="Hide dock"
                  style={{
                    padding: '4px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Drawer Items */}
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeTab === 'blocks' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {blockItems.map((item) => (
                  <div
                    key={item.type}
                    onClick={() => onAddBlock(item.type)}
                    draggable
                    onDragStart={(e) => {
                      const payload = JSON.stringify({ kind: 'block', blockType: item.type });
                      e.dataTransfer.setData('text/plain', payload);
                      e.dataTransfer.setData('application/json', payload);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'grab',
                      transition: 'all 0.15s ease',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>{item.icon}</div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#334155' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'layouts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {layoutPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => onAddLayout(preset.cols)}
                    draggable
                    onDragStart={(e) => {
                      const payload = JSON.stringify({ kind: 'structure', cols: preset.cols });
                      e.dataTransfer.setData('text/plain', payload);
                      e.dataTransfer.setData('application/json', payload);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'grab',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                      {preset.name}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', height: '28px', width: '100%' }}>
                      {preset.cols.map((width, colI) => (
                        <div
                          key={colI}
                          style={{
                            width: `${width}%`,
                            backgroundColor: '#f1f5f9',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#64748b',
                            fontWeight: 500,
                          }}
                        >
                          {Math.round(width)}%
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'modules' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'hero-promo', name: 'Header & Hero Banner' },
                  { id: 'product-card', name: 'Product Card' },
                  { id: 'social-footer', name: 'Footer & Socials' },
                ].map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => onApplyModule(mod.id)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#334155',
                    }}
                  >
                    {mod.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
