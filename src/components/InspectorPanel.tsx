import React, { useState } from 'react';
import {
  CaretDown,
  CaretRight,
  Question,
  Trash,
  Copy,
  Minus,
  Plus,
  ArrowsLeftRight,
  ArrowSquareOut,
  X as XIcon,
} from '@phosphor-icons/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Smile,
  Table as TableIcon,
  List,
  ListOrdered,
  ChevronDown,
  X as CloseIcon,
  Zap,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { EmailDocument, BlockNode, StripeNode } from '../types/editor';
import { DockPosition } from '../types/dock';
import { ALL_EMAIL_FONTS, ALL_FONT_WEIGHTS } from '../data/fonts';

interface InspectorPanelProps {
  document: EmailDocument;
  selectedBlockId: string | null;
  selectedBlockIds?: string[];
  selectedStripeId: string | null;
  selectedStructureId: string | null;
  onUpdateSettings: (settings: Partial<EmailDocument['settings']>) => void;
  onUpdateBlock: (blockId: string, updates: Partial<BlockNode> | { props: any }) => void;
  onBatchUpdateBlocks?: (updates: Partial<BlockNode> | { props: any }) => void;
  onDeleteBlock: (blockId?: string) => void;
  onDuplicateBlock: (blockId?: string) => void;
  onUpdateStripe: (stripeId: string, updates: Partial<StripeNode>) => void;
  onUnselectBlock?: () => void;
  dockPosition?: DockPosition;
  onShiftDock?: (target: DockPosition) => void;
  onFloat?: () => void;
  onClose?: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  document,
  selectedBlockId,
  selectedBlockIds = [],
  selectedStripeId: _selectedStripeId,
  onUpdateSettings,
  onUpdateBlock,
  onBatchUpdateBlocks,
  onDeleteBlock,
  onDuplicateBlock,
  onUpdateStripe: _onUpdateStripe,
  onUnselectBlock,
  dockPosition = 'right',
  onShiftDock,
  onFloat,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'data'>('appearance');
  const [blockSubTab, setBlockSubTab] = useState<'settings' | 'styles'>('settings');
  const [isMergeTagsOpen, setIsMergeTagsOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSpecialCharsOpen, setIsSpecialCharsOpen] = useState(false);
  const [isLinkPromptOpen, setIsLinkPromptOpen] = useState(false);
  const [linkInputUrl, setLinkInputUrl] = useState('https://');
  const [linkInputText, setLinkInputText] = useState('Click here');
  const [showRawHtml, setShowRawHtml] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    global: true,
    stripe: true,
    headings: false,
    buttons: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Find selected blocks
  const effectiveSelectedIds = selectedBlockIds.length > 0 ? selectedBlockIds : selectedBlockId ? [selectedBlockId] : [];
  const activeBlocks: BlockNode[] = [];
  for (const stripe of document.stripes) {
    for (const struct of stripe.structures) {
      for (const col of struct.columns) {
        for (const b of col.blocks) {
          if (effectiveSelectedIds.includes(b.id)) {
            activeBlocks.push(b);
          }
        }
      }
    }
  }

  let activeBlock: BlockNode | null = activeBlocks.length > 0 ? activeBlocks[activeBlocks.length - 1] : null;

  return (
    <aside
      style={{
        width: 'var(--inspector-width)',
        height: 'calc(100vh - var(--topbar-height))',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid var(--stripo-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        zIndex: 40,
      }}
    >
      {/* Top Header: If block is selected, show [✕ esc] + [Settings | Styles] tabs; Else show [Appearance | Data] */}
      {activeBlock ? (
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
          {/* Stripo Header matching IMG 2: [✕ esc] on left, actions on right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px 8px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onUnselectBlock?.()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '6px',
                }}
                title="Close settings (Esc)"
              >
                <CloseIcon size={16} />
                <span>esc</span>
              </button>
              {activeBlocks.length > 1 && (
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  {activeBlocks.length} Items Selected
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {onShiftDock && (
                <button
                  onClick={() => onShiftDock(dockPosition === 'right' ? 'left' : 'right')}
                  title={`Shift Inspector to ${dockPosition === 'right' ? 'left' : 'right'} side`}
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
                  <span>{dockPosition === 'right' ? 'Left' : 'Right'}</span>
                </button>
              )}
              {onFloat && (
                <button
                  onClick={onFloat}
                  title="Float / Detach Inspector Window"
                  style={{
                    padding: '5px',
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
              <button
                onClick={() => onDuplicateBlock()}
                title={activeBlocks.length > 1 ? `Duplicate ${activeBlocks.length} selected blocks` : 'Duplicate block'}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  color: '#64748b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => onDeleteBlock()}
                title={activeBlocks.length > 1 ? `Delete ${activeBlocks.length} selected blocks` : 'Delete block'}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          {/* Sub-tabs: [ Settings ] | [ Styles ] */}
          <div style={{ padding: '0 16px 12px 16px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#edeef1',
                padding: '3px',
                borderRadius: '10px',
              }}
            >
              <button
                onClick={() => setBlockSubTab('settings')}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: blockSubTab === 'settings' ? 600 : 500,
                  color: blockSubTab === 'settings' ? '#1e293b' : '#64748b',
                  backgroundColor: blockSubTab === 'settings' ? '#ffffff' : 'transparent',
                  boxShadow: blockSubTab === 'settings' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Settings
              </button>
              <button
                onClick={() => setBlockSubTab('styles')}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: blockSubTab === 'styles' ? 600 : 500,
                  color: blockSubTab === 'styles' ? '#1e293b' : '#64748b',
                  backgroundColor: blockSubTab === 'styles' ? '#ffffff' : 'transparent',
                  boxShadow: blockSubTab === 'styles' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Styles
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Stripo Top Switcher Tabs (Appearance / Data) when no block is selected */
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--stripo-border)',
            backgroundColor: '#f8fafc',
            padding: '6px 12px',
          }}
        >
          <button
            onClick={() => setActiveTab('appearance')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'appearance' ? '#1e293b' : '#64748b',
              backgroundColor: activeTab === 'appearance' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'appearance' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              border: activeTab === 'appearance' ? '1px solid #e2e8f0' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('data')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'data' ? '#1e293b' : '#64748b',
              backgroundColor: activeTab === 'data' ? '#ffffff' : 'transparent',
              boxShadow: activeTab === 'data' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              border: activeTab === 'data' ? '1px solid #e2e8f0' : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            Data &amp; Rules
          </button>

          {/* Quick Dock Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '6px' }}>
            {onShiftDock && (
              <button
                onClick={() => onShiftDock(dockPosition === 'right' ? 'left' : 'right')}
                title={`Shift to ${dockPosition === 'right' ? 'left' : 'right'} side`}
                style={{
                  padding: '4px',
                  borderRadius: '5px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ArrowsLeftRight size={13} color="#22c55e" />
              </button>
            )}

            {onFloat && (
              <button
                onClick={onFloat}
                title="Float / Detach Inspector"
                style={{
                  padding: '4px',
                  borderRadius: '5px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
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
                title="Hide Inspector"
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
                <XIcon size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Body */}
      <div style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        {/* IF BLOCK SELECTED */}
        {activeBlock ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeBlock.type === 'text' ? (
              blockSubTab === 'settings' ? (
                /* EXACT STRIPO TEXT BLOCK SETTINGS MATCHING IMG 2 */
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* SECTION 1: Paragraph Style */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '10px', display: 'block' }}>
                      Paragraph Style
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => {
                        const content = (activeBlock!.props.content || '').trim().toLowerCase();
                        const currentTag = activeBlock!.props.headingTag || (content.startsWith('<h1') ? 'h1' : content.startsWith('<h2') ? 'h2' : content.startsWith('<h3') ? 'h3' : content.startsWith('<h4') ? 'h4' : content.startsWith('<h5') ? 'h5' : content.startsWith('<h6') ? 'h6' : 'p');
                        const isSelected = currentTag === tag;
                        const label = tag.toUpperCase();
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              let raw = activeBlock!.props.content || '';
                              raw = raw.replace(/^<(p|h[1-6])[^>]*>([\s\S]*?)<\/\1>$/i, '$2').trim();
                              if (!raw) raw = 'Heading text';
                              const newContent = tag === 'p' ? `<p>${raw}</p>` : `<${tag}>${raw}</${tag}>`;
                              onUpdateBlock(activeBlock!.id, {
                                props: {
                                  ...activeBlock!.props,
                                  content: newContent,
                                  headingTag: tag,
                                },
                              });
                            }}
                            style={{
                              flex: 1,
                              height: '34px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ffffff',
                              border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                              color: isSelected ? '#15803d' : '#475569',
                              fontWeight: isSelected ? 700 : 600,
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION: Font Family & Font Weight (Light to Bold) - In Section IMG 1 */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    {/* Font Family Header & Dropdown */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                          Font Family
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                          {ALL_EMAIL_FONTS.find((f) => f.value === (activeBlock!.props.fontFamily || document.settings.fontFamily))?.name || 'Default Font'}
                        </span>
                      </div>
                      <select
                        value={activeBlock!.props.fontFamily || document.settings.fontFamily || 'Arial, "Helvetica Neue", Helvetica, sans-serif'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                            onBatchUpdateBlocks({ props: { fontFamily: val } });
                          } else {
                            onUpdateBlock(activeBlock!.id, {
                              props: { ...activeBlock!.props, fontFamily: val },
                            });
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          outline: 'none',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {Array.from(new Set(ALL_EMAIL_FONTS.map((f) => f.category))).map((category) => (
                          <optgroup key={category} label={category}>
                            {ALL_EMAIL_FONTS.filter((f) => f.category === category).map((font) => (
                              <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {/* Font Weight: Light to Bold (100 to 900) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                          Font Weight <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b' }}>(Light to Bold)</span>
                        </label>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#15803d',
                            backgroundColor: '#dcfce7',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                          }}
                        >
                          {ALL_FONT_WEIGHTS.find(
                            (w) =>
                              String(w.value) ===
                              String(activeBlock!.props.fontWeight || (activeBlock!.props.headingTag?.startsWith('h') ? 700 : 400))
                          )?.label || `${activeBlock!.props.fontWeight || 400}`}
                        </span>
                      </div>

                      {/* Dropdown with all 9 weights */}
                      <select
                        value={String(
                          activeBlock!.props.fontWeight || (activeBlock!.props.headingTag?.startsWith('h') ? 700 : 400)
                        )}
                        onChange={(e) => {
                          const weightVal = Number(e.target.value);
                          if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                            onBatchUpdateBlocks({ props: { fontWeight: weightVal } });
                          } else {
                            onUpdateBlock(activeBlock!.id, {
                              props: { ...activeBlock!.props, fontWeight: weightVal },
                            });
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          backgroundColor: '#ffffff',
                          color: '#1e293b',
                          outline: 'none',
                          marginBottom: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        {ALL_FONT_WEIGHTS.map((w) => (
                          <option key={w.value} value={w.value}>
                            {w.label} ({w.title})
                          </option>
                        ))}
                      </select>

                      {/* Quick Chips: Light to Bold */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '10px' }}>
                        {[
                          { label: '100', val: 100, title: 'Thin' },
                          { label: '300', val: 300, title: 'Light' },
                          { label: '400', val: 400, title: 'Regular' },
                          { label: '600', val: 600, title: 'Semi-Bold' },
                          { label: '700', val: 700, title: 'Bold' },
                          { label: '900', val: 900, title: 'Black / Heavy' },
                        ].map((chip) => {
                          const currentWeight = Number(
                            activeBlock!.props.fontWeight || (activeBlock!.props.headingTag?.startsWith('h') ? 700 : 400)
                          );
                          const isSelected = currentWeight === chip.val;
                          return (
                            <button
                              key={chip.val}
                              onClick={() => {
                                if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                                  onBatchUpdateBlocks({ props: { fontWeight: chip.val } });
                                } else {
                                  onUpdateBlock(activeBlock!.id, {
                                    props: { ...activeBlock!.props, fontWeight: chip.val },
                                  });
                                }
                              }}
                              title={`${chip.val} - ${chip.title}`}
                              style={{
                                padding: '6px 0',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: chip.val as any,
                                border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                                backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                                color: isSelected ? '#15803d' : '#475569',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Slider: Light to Bold */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 300 }}>100 Light</span>
                        <input
                          type="range"
                          min={100}
                          max={900}
                          step={100}
                          value={Number(
                            activeBlock!.props.fontWeight || (activeBlock!.props.headingTag?.startsWith('h') ? 700 : 400)
                          )}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                              onBatchUpdateBlocks({ props: { fontWeight: val } });
                            } else {
                              onUpdateBlock(activeBlock!.id, {
                                props: { ...activeBlock!.props, fontWeight: val },
                              });
                            }
                          }}
                          style={{
                            flex: 1,
                            accentColor: '#22c55e',
                            cursor: 'pointer',
                          }}
                        />
                        <span style={{ fontSize: '11px', color: '#1e293b', fontWeight: 800 }}>900 Bold</span>
                      </div>

                      {/* Live Typography Preview Pill */}
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '8px 12px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Live Preview:</span>
                        <span
                          style={{
                            fontFamily: activeBlock!.props.fontFamily || document.settings.fontFamily || 'Arial, sans-serif',
                            fontWeight: Number(
                              activeBlock!.props.fontWeight || (activeBlock!.props.headingTag?.startsWith('h') ? 700 : 400)
                            ) as any,
                            fontSize: '13px',
                            color: '#0f172a',
                          }}
                        >
                          The quick brown fox jumps
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Text Alignment */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '10px', display: 'block' }}>
                      Text Alignment
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'left', icon: <AlignLeft size={18} /> },
                        { id: 'center', icon: <AlignCenter size={18} /> },
                        { id: 'right', icon: <AlignRight size={18} /> },
                        { id: 'justify', icon: <AlignJustify size={18} /> },
                      ].map((item) => {
                        const isSelected = (activeBlock!.align || 'left') === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => onUpdateBlock(activeBlock!.id, { align: item.id as any })}
                            style={{
                              width: '46px',
                              height: '36px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#ffffff',
                              border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                              color: isSelected ? '#16a34a' : '#475569',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {item.icon}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 3: Text Style */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '10px', display: 'block' }}>
                      Text Style
                    </label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Group 1: B, I, U, S */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          {
                            key: 'b',
                            label: <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '14px' }}>B</span>,
                            action: () => {
                              const curr = activeBlock!.props.content || '';
                              const updated = curr.includes('<strong>') ? curr.replace(/<\/?strong>/g, '') : `<strong>${curr}</strong>`;
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                            },
                          },
                          {
                            key: 'i',
                            label: <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '14px' }}>I</span>,
                            action: () => {
                              const curr = activeBlock!.props.content || '';
                              const updated = curr.includes('<em>') ? curr.replace(/<\/?em>/g, '') : `<em>${curr}</em>`;
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                            },
                          },
                          {
                            key: 'u',
                            label: <span style={{ fontFamily: 'Georgia, serif', textDecoration: 'underline', fontSize: '14px' }}>U</span>,
                            action: () => {
                              const curr = activeBlock!.props.content || '';
                              const updated = curr.includes('<u>') ? curr.replace(/<\/?u>/g, '') : `<u>${curr}</u>`;
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                            },
                          },
                          {
                            key: 's',
                            label: <span style={{ fontFamily: 'Georgia, serif', textDecoration: 'line-through', fontSize: '14px' }}>S</span>,
                            action: () => {
                              const curr = activeBlock!.props.content || '';
                              const updated = curr.includes('<s>') ? curr.replace(/<\/?s>/g, '') : `<s>${curr}</s>`;
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                            },
                          },
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            onClick={btn.action}
                            style={{
                              width: '40px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              color: '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Group 2: X2, X^2, Tx */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            const curr = activeBlock!.props.content || '';
                            const updated = curr.includes('<sub>') ? curr.replace(/<\/?sub>/g, '') : `<sub>${curr}</sub>`;
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                          }}
                          style={{
                            width: '40px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                            X<sub style={{ fontSize: '10px' }}>2</sub>
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            const curr = activeBlock!.props.content || '';
                            const updated = curr.includes('<sup>') ? curr.replace(/<\/?sup>/g, '') : `<sup>${curr}</sup>`;
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: updated } });
                          }}
                          style={{
                            width: '40px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                            X<sup style={{ fontSize: '10px' }}>2</sup>
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            const curr = activeBlock!.props.content || '';
                            const plain = curr.replace(/<[^>]+>/g, '').trim();
                            onUpdateBlock(activeBlock!.id, {
                              props: {
                                ...activeBlock!.props,
                                content: `<p>${plain || 'Text content'}</p>`,
                                headingTag: 'p',
                              },
                            });
                          }}
                          title="Clear formatting"
                          style={{
                            width: '40px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}>
                            T<sub style={{ fontSize: '10px' }}>x</sub>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: Insert */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '10px', display: 'block' }}>
                      Insert
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      {/* Group 1: Link, Image, Smile, Omega, Table */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => setIsLinkPromptOpen(!isLinkPromptOpen)}
                          title="Insert Link"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isLinkPromptOpen ? '#eff6ff' : '#ffffff',
                            border: isLinkPromptOpen ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <LinkIcon size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const imgHtml = `<img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600" alt="Inserted image" style="max-width:100%; border-radius:6px; margin: 8px 0; display:block;" />`;
                            const curr = activeBlock!.props.content || '';
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${imgHtml}` } });
                          }}
                          title="Insert Image"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <ImageIcon size={16} />
                        </button>
                        <button
                          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                          title="Insert Emoji"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isEmojiPickerOpen ? '#fef3c7' : '#ffffff',
                            border: isEmojiPickerOpen ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Smile size={16} />
                        </button>
                        <button
                          onClick={() => setIsSpecialCharsOpen(!isSpecialCharsOpen)}
                          title="Special Characters (Ω)"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isSpecialCharsOpen ? '#f1f5f9' : '#ffffff',
                            border: isSpecialCharsOpen ? '1px solid #94a3b8' : '1px solid #e2e8f0',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: 600,
                          }}
                        >
                          Ω
                        </button>
                        <button
                          onClick={() => {
                            const tableHtml = `<table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse; border:1px solid #e2e8f0; margin:10px 0;"><tr style="background-color:#f8fafc;"><th style="border:1px solid #e2e8f0; text-align:left; padding:6px; font-size:13px;">Item</th><th style="border:1px solid #e2e8f0; text-align:right; padding:6px; font-size:13px;">Qty</th></tr><tr><td style="border:1px solid #e2e8f0; padding:6px; font-size:13px;">Product A</td><td style="border:1px solid #e2e8f0; text-align:right; padding:6px; font-size:13px;">1</td></tr></table>`;
                            const curr = activeBlock!.props.content || '';
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${tableHtml}` } });
                          }}
                          title="Insert Table"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <TableIcon size={16} />
                        </button>
                      </div>

                      {/* Group 2: Lists & More */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => {
                            const listHtml = `<ul style="margin: 8px 0; padding-left: 20px;"><li>First point</li><li>Second point</li></ul>`;
                            const curr = activeBlock!.props.content || '';
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${listHtml}` } });
                          }}
                          title="Bullet List"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <List size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const listHtml = `<ol style="margin: 8px 0; padding-left: 20px;"><li>Step one</li><li>Step two</li></ol>`;
                            const curr = activeBlock!.props.content || '';
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${listHtml}` } });
                          }}
                          title="Numbered List"
                          style={{
                            width: '38px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <ListOrdered size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const dividerHtml = `<hr style="border:none; border-top:1px solid #e2e8f0; margin:12px 0;" />`;
                            const curr = activeBlock!.props.content || '';
                            onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${dividerHtml}` } });
                          }}
                          title="Insert Horizontal Divider"
                          style={{
                            width: '34px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <ChevronDown size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Emoji Popover */}
                    {isEmojiPickerOpen && (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '10px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gap: '6px',
                          marginBottom: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {['🔥', '🎉', '❤️', '⭐', '🚀', '👍', '💡', '✉️', '✨', '👏', '🎯', '💎'].map((em) => (
                          <button
                            key={em}
                            onClick={() => {
                              const curr = activeBlock!.props.content || '';
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${em}` } });
                              setIsEmojiPickerOpen(false);
                            }}
                            style={{
                              fontSize: '18px',
                              padding: '4px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '4px',
                            }}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Special Characters Popover */}
                    {isSpecialCharsOpen && (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '10px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gap: '6px',
                          marginBottom: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {['Ω', '©', '®', '™', '€', '£', '¥', '•', '—', '→', '★', '⚡'].map((sym) => (
                          <button
                            key={sym}
                            onClick={() => {
                              const curr = activeBlock!.props.content || '';
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${sym}` } });
                              setIsSpecialCharsOpen(false);
                            }}
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              padding: '6px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              cursor: 'pointer',
                              borderRadius: '4px',
                            }}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Link Insertion Prompt */}
                    {isLinkPromptOpen && (
                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '10px',
                          marginBottom: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Link text"
                          value={linkInputText}
                          onChange={(e) => setLinkInputText(e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                        <input
                          type="text"
                          placeholder="https://..."
                          value={linkInputUrl}
                          onChange={(e) => setLinkInputUrl(e.target.value)}
                          style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => setIsLinkPromptOpen(false)}
                            style={{ padding: '4px 8px', fontSize: '11px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const linkHtml = `<a href="${linkInputUrl || 'https://'}" style="color: #2563eb; text-decoration: underline;">${linkInputText || 'Link'}</a>`;
                              const curr = activeBlock!.props.content || '';
                              onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, content: `${curr} ${linkHtml}` } });
                              setIsLinkPromptOpen(false);
                            }}
                            style={{ padding: '4px 8px', fontSize: '11px', background: '#22c55e', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Insert
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Merge Tags Pill Dropdown */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setIsMergeTagsOpen(!isMergeTagsOpen)}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '0 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Code2 size={16} color="#64748b" />
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>Merge Tags</span>
                        </div>
                        <ChevronDown size={14} color="#64748b" />
                      </button>

                      {isMergeTagsOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '42px',
                            left: 0,
                            right: 0,
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 20,
                            overflow: 'hidden',
                          }}
                        >
                          {[
                            { name: 'First Name', tag: '{{firstName}}' },
                            { name: 'Last Name', tag: '{{lastName}}' },
                            { name: 'Email Address', tag: '{{email}}' },
                            { name: 'Company Name', tag: '{{company}}' },
                            { name: 'Unsubscribe Link', tag: '{{unsubscribeUrl}}' },
                            { name: 'View in Browser', tag: '{{viewInBrowserUrl}}' },
                            { name: 'Current Year', tag: '{{currentYear}}' },
                          ].map((item) => (
                            <button
                              key={item.tag}
                              onClick={() => {
                                const curr = activeBlock!.props.content || '';
                                onUpdateBlock(activeBlock!.id, {
                                  props: { ...activeBlock!.props, content: `${curr} ${item.tag}` },
                                });
                                setIsMergeTagsOpen(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'none',
                                border: 'none',
                                borderBottom: '1px solid #f1f5f9',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '12px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <span style={{ color: '#1e293b', fontWeight: 500 }}>{item.name}</span>
                              <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '11px' }}>{item.tag}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 5: Anchor Link */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Anchor Link</span>
                        <span title="Create an internal bookmark link so buttons or headers can jump directly to this block">
                          <HelpCircle size={15} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        </span>
                      </div>

                      {/* iOS Toggle Switch */}
                      <div
                        onClick={() => {
                          const currentVal = Boolean(activeBlock!.props.anchorLink);
                          onUpdateBlock(activeBlock!.id, {
                            props: {
                              ...activeBlock!.props,
                              anchorLink: !currentVal,
                              anchorId: !currentVal ? activeBlock!.props.anchorId || `anchor-${activeBlock!.id.slice(0, 4)}` : activeBlock!.props.anchorId,
                            },
                          });
                        }}
                        style={{
                          width: '42px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: activeBlock!.props.anchorLink ? '#22c55e' : '#e2e8f0',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '10px',
                            backgroundColor: '#ffffff',
                            position: 'absolute',
                            top: '2px',
                            left: activeBlock!.props.anchorLink ? '20px' : '2px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                          }}
                        />
                      </div>
                    </div>

                    {activeBlock!.props.anchorLink && (
                      <div style={{ marginTop: '10px' }}>
                        <input
                          type="text"
                          placeholder="anchor-id (e.g. section-one)"
                          value={activeBlock!.props.anchorId || ''}
                          onChange={(e) =>
                            onUpdateBlock(activeBlock!.id, {
                              props: { ...activeBlock!.props, anchorId: e.target.value },
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* SECTION 6: Include in */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>Include in</span>
                        <span title="Choose which output versions include this block (standard HTML, AMP HTML, or both)">
                          <HelpCircle size={15} color="#94a3b8" style={{ cursor: 'pointer' }} />
                        </span>
                      </div>

                      {/* 3-way Pill Switch: Both, HTML, ⚡ HTML */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          { id: 'both', label: 'Both' },
                          { id: 'html', label: 'HTML' },
                          { id: 'amp', label: <><Zap size={12} style={{ display: 'inline', marginRight: '2px' }} /> HTML</> },
                        ].map((opt) => {
                          const currentOpt = activeBlock!.props.includeIn || 'both';
                          const isSelected = currentOpt === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() =>
                                onUpdateBlock(activeBlock!.id, {
                                  props: { ...activeBlock!.props, includeIn: opt.id as any },
                                })
                              }
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                backgroundColor: '#ffffff',
                                border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                                color: isSelected ? '#16a34a' : '#64748b',
                                fontWeight: isSelected ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Direct HTML Content */}
                  <div style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => setShowRawHtml(!showRawHtml)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ChevronDown size={14} style={{ transform: showRawHtml ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                      <span>{showRawHtml ? 'Hide Raw HTML' : 'Edit Raw HTML'}</span>
                    </button>
                    {showRawHtml && (
                      <textarea
                        rows={4}
                        value={activeBlock.props.content || ''}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, content: e.target.value },
                          })
                        }
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          resize: 'vertical',
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                /* STYLES TAB FOR TEXT BLOCK */
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Font Family */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        Font Family
                      </label>
                      <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                        {ALL_EMAIL_FONTS.find((f) => f.value === (activeBlock.props.fontFamily || document.settings.fontFamily))?.name || 'Default'}
                      </span>
                    </div>
                    <select
                      value={activeBlock.props.fontFamily || document.settings.fontFamily || 'Arial, "Helvetica Neue", Helvetica, sans-serif'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                          onBatchUpdateBlocks({ props: { fontFamily: val } });
                        } else {
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, fontFamily: val },
                          });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {Array.from(new Set(ALL_EMAIL_FONTS.map((f) => f.category))).map((category) => (
                        <optgroup key={category} label={category}>
                          {ALL_EMAIL_FONTS.filter((f) => f.category === category).map((font) => (
                            <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                              {font.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Font Weight: Light to Bold */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        Font Weight (Light to Bold)
                      </label>
                      <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                        {ALL_FONT_WEIGHTS.find(
                          (w) => String(w.value) === String(activeBlock.props.fontWeight || (activeBlock.props.headingTag?.startsWith('h') ? 700 : 400))
                        )?.label || `${activeBlock.props.fontWeight || 400}`}
                      </span>
                    </div>
                    <select
                      value={String(activeBlock.props.fontWeight || (activeBlock.props.headingTag?.startsWith('h') ? 700 : 400))}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (activeBlocks.length > 1 && onBatchUpdateBlocks) {
                          onBatchUpdateBlocks({ props: { fontWeight: val } });
                        } else {
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, fontWeight: val },
                          });
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {ALL_FONT_WEIGHTS.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label} ({w.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Size & Line Height */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                        Font Size (px)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            const curr = activeBlock!.props.fontSize || 16;
                            if (curr > 10) onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, fontSize: curr - 1 } });
                          }}
                          style={{ width: '32px', height: '34px', border: '1px solid #cbd5e1', borderRadius: '6px 0 0 6px', background: '#f8fafc', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          min={10}
                          max={72}
                          value={activeBlock.props.fontSize || 16}
                          onChange={(e) =>
                            onUpdateBlock(activeBlock!.id, {
                              props: { ...activeBlock!.props, fontSize: Number(e.target.value) },
                            })
                          }
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            height: '34px',
                            borderTop: '1px solid #cbd5e1',
                            borderBottom: '1px solid #cbd5e1',
                            borderLeft: 'none',
                            borderRight: 'none',
                            fontSize: '13px',
                          }}
                        />
                        <button
                          onClick={() => {
                            const curr = activeBlock!.props.fontSize || 16;
                            if (curr < 72) onUpdateBlock(activeBlock!.id, { props: { ...activeBlock!.props, fontSize: curr + 1 } });
                          }}
                          style={{ width: '32px', height: '34px', border: '1px solid #cbd5e1', borderRadius: '0 6px 6px 0', background: '#f8fafc', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                        Line Height
                      </label>
                      <select
                        value={activeBlock.props.lineHeight || 1.5}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, lineHeight: Number(e.target.value) },
                          })
                        }
                        style={{
                          width: '100%',
                          height: '34px',
                          padding: '0 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                        }}
                      >
                        <option value={1.2}>1.2 (Tight)</option>
                        <option value={1.4}>1.4 (Standard)</option>
                        <option value={1.5}>1.5 (Relaxed)</option>
                        <option value={1.8}>1.8 (Loose)</option>
                        <option value={2.0}>2.0 (Double)</option>
                      </select>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Text Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={activeBlock.props.color || '#1e293b'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, color: e.target.value },
                          })
                        }
                        style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={activeBlock.props.color || '#1e293b'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, color: e.target.value },
                          })
                        }
                        style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  {/* Padding */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Padding (px)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                        <div key={side}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{side}</span>
                          <input
                            type="number"
                            min={0}
                            max={60}
                            value={activeBlock!.padding?.[side] ?? 10}
                            onChange={(e) =>
                              onUpdateBlock(activeBlock!.id, {
                                padding: { ...activeBlock!.padding, [side]: Number(e.target.value) },
                              })
                            }
                            style={{
                              width: '100%',
                              padding: '6px 4px',
                              textAlign: 'center',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* OTHER BLOCK TYPES (Button, Image, etc.) */
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase' }}>
                    {activeBlock.type} Settings
                  </span>
                </div>

            {activeBlock.type === 'button' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.text || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, text: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.url || 'https://'}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, url: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Button Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={activeBlock.props.buttonColor || '#22c55e'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, buttonColor: e.target.value },
                        })
                      }
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={activeBlock.props.buttonColor || '#22c55e'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, buttonColor: e.target.value },
                        })
                      }
                      style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Text Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={activeBlock.props.textColor || '#ffffff'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, textColor: e.target.value },
                        })
                      }
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={activeBlock.props.textColor || '#ffffff'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, textColor: e.target.value },
                        })
                      }
                      style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', color: '#64748b' }}>Border Radius</label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{activeBlock.props.borderRadius ?? 6}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={28}
                    value={activeBlock.props.borderRadius ?? 6}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, borderRadius: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', accentColor: '#22c55e' }}
                  />
                </div>
              </div>
            )}

            {activeBlock.type === 'image' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.src || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, src: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.alt || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, alt: e.target.value },
                      })
                    }
                    placeholder="Image description"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Link On Click (Optional)
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.url || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, url: e.target.value },
                      })
                    }
                    placeholder="https://"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            )}

            {activeBlock.type === 'spacer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b' }}>Spacer Height</label>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                    {activeBlock.props.spacerHeight || 28}px
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={120}
                  value={activeBlock.props.spacerHeight || 28}
                  onChange={(e) =>
                    onUpdateBlock(activeBlock!.id, {
                      props: { ...activeBlock!.props, spacerHeight: Number(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: '#22c55e' }}
                />
              </div>
            )}

            {activeBlock.type === 'divider' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Line Style
                  </label>
                  <select
                    value={activeBlock.props.dividerStyle || 'solid'}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, dividerStyle: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Divider Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={activeBlock.props.dividerColor || '#e2e8f0'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, dividerColor: e.target.value },
                        })
                      }
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={activeBlock.props.dividerColor || '#e2e8f0'}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, dividerColor: e.target.value },
                        })
                      }
                      style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Thickness (px)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={activeBlock.props.dividerHeight || 1}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, dividerHeight: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

            {activeBlock.type === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b' }}>Icon Size</label>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{activeBlock.props.iconSize || 28}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={44}
                  value={activeBlock.props.iconSize || 28}
                  onChange={(e) =>
                    onUpdateBlock(activeBlock!.id, {
                      props: { ...activeBlock!.props, iconSize: Number(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: '#22c55e' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', color: '#64748b' }}>Icon Spacing</label>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{activeBlock.props.iconSpacing || 12}px</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={24}
                  value={activeBlock.props.iconSpacing || 12}
                  onChange={(e) =>
                    onUpdateBlock(activeBlock!.id, {
                      props: { ...activeBlock!.props, iconSpacing: Number(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: '#22c55e' }}
                />
              </div>
            )}

            {activeBlock.type === 'video' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Video URL (YouTube/Vimeo)
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.videoUrl || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, videoUrl: e.target.value },
                      })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.src || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, src: e.target.value },
                      })
                    }
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

            {activeBlock.type === 'html' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                  Raw HTML Snippet
                </label>
                <textarea
                  rows={6}
                  value={activeBlock.props.customHtml || activeBlock.props.htmlCode || ''}
                  onChange={(e) =>
                    onUpdateBlock(activeBlock!.id, {
                      props: { ...activeBlock!.props, customHtml: e.target.value, htmlCode: e.target.value },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            )}

            {activeBlock.type === 'timer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                  Countdown Display Values
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                    <div key={unit}>
                      <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{unit}</span>
                      <input
                        type="text"
                        maxLength={2}
                        value={(activeBlock!.props as any)[unit] || '00'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, [unit]: e.target.value },
                          })
                        }
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '6px 2px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeBlock.type === 'shape' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'block' }}>
                    Shape / Element Preset
                  </label>
                  <select
                    value={activeBlock.props.shapeType || 'badge'}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, shapeType: e.target.value },
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="badge">Highlight Badge / Container</option>
                    <option value="pill">Pill Ribbon / Tag</option>
                    <option value="circle">Geometric Circle</option>
                    <option value="accent-bar">Horizontal Color Accent Bar</option>
                    <option value="line-ornament">Dividing Line with Center Accent</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Center Label / Icon Text
                  </label>
                  <input
                    type="text"
                    value={activeBlock.props.shapeText || ''}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, shapeText: e.target.value },
                      })
                    }
                    placeholder="Enter text or emoji badge..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Fill Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={activeBlock.props.fillColor || '#f0fdf4'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, fillColor: e.target.value },
                          })
                        }
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={activeBlock.props.fillColor || '#f0fdf4'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, fillColor: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Border / Stroke Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={activeBlock.props.strokeColor || '#22c55e'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, strokeColor: e.target.value },
                          })
                        }
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        value={activeBlock.props.strokeColor || '#22c55e'}
                        onChange={(e) =>
                          onUpdateBlock(activeBlock!.id, {
                            props: { ...activeBlock!.props, strokeColor: e.target.value },
                          })
                        }
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Border Width (px)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={activeBlock.props.strokeWidth ?? 2}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, strokeWidth: Number(e.target.value) },
                        })
                      }
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                      Corner Radius (px)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={activeBlock.props.borderRadius ?? 8}
                      onChange={(e) =>
                        onUpdateBlock(activeBlock!.id, {
                          props: { ...activeBlock!.props, borderRadius: Number(e.target.value) },
                        })
                      }
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                    Height / Thickness (px)
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={120}
                    value={activeBlock.props.shapeHeight || 52}
                    onChange={(e) =>
                      onUpdateBlock(activeBlock!.id, {
                        props: { ...activeBlock!.props, shapeHeight: Number(e.target.value) },
                      })
                    }
                    style={{ width: '100%', accentColor: '#22c55e' }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
          /* STRIPO ACCORDION CARDS FOR GLOBAL STYLES */
          <>
            {/* Global Styles & Layout Accordion */}
            <div className="stripo-accordion">
              <div
                onClick={() => toggleSection('global')}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  Global Styles &amp; Layout
                </span>
                {openSections.global ? <CaretDown size={14} /> : <CaretRight size={14} />}
              </div>

              {openSections.global && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* General Background Color */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>General Background Color</span>
                      <Question size={13} color="#94a3b8" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="color"
                        value={document.settings.backgroundColor}
                        onChange={(e) => onUpdateSettings({ backgroundColor: e.target.value })}
                        style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {document.settings.backgroundColor}
                      </span>
                    </div>
                  </div>

                  {/* Message Content Width Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Message Content Width</span>
                      <Question size={13} color="#94a3b8" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '9999px', padding: '2px 4px', border: '1px solid #e2e8f0' }}>
                      <button
                        onClick={() => onUpdateSettings({ contentWidth: Math.max(480, document.settings.contentWidth - 20) })}
                        style={{ padding: '4px 6px', color: '#64748b' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '36px', textAlign: 'center' }}>
                        {document.settings.contentWidth}
                      </span>
                      <button
                        onClick={() => onUpdateSettings({ contentWidth: Math.min(800, document.settings.contentWidth + 20) })}
                        style={{ padding: '4px 6px', color: '#64748b' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Default Font Family */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Default Font Family</span>
                      <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                        {ALL_EMAIL_FONTS.find((f) => f.value === document.settings.fontFamily)?.name || 'Default'}
                      </span>
                    </div>
                    <select
                      value={document.settings.fontFamily || 'Arial, "Helvetica Neue", Helvetica, sans-serif'}
                      onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {Array.from(new Set(ALL_EMAIL_FONTS.map((f) => f.category))).map((category) => (
                        <optgroup key={category} label={category}>
                          {ALL_EMAIL_FONTS.filter((f) => f.category === category).map((font) => (
                            <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                              {font.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Responsive Design Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b' }}>Responsive Design</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Auto-stack columns on mobile</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={document.settings.responsive}
                      onChange={(e) => onUpdateSettings({ responsive: e.target.checked })}
                      style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#22c55e' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stripe Styles Accordion */}
            <div className="stripo-accordion">
              <div
                onClick={() => toggleSection('stripe')}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  Stripe Styles
                </span>
                {openSections.stripe ? <CaretDown size={14} /> : <CaretRight size={14} />}
              </div>

              {openSections.stripe && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#475569' }}>Inner Content Background</span>
                    <input
                      type="color"
                      value={document.settings.contentBackgroundColor}
                      onChange={(e) => onUpdateSettings({ contentBackgroundColor: e.target.value })}
                      style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Button Styles Accordion */}
            <div className="stripo-accordion">
              <div
                onClick={() => toggleSection('buttons')}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  backgroundColor: '#f8fafc',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                  Button Styles
                </span>
                {openSections.buttons ? <CaretDown size={14} /> : <CaretRight size={14} />}
              </div>

              {openSections.buttons && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#475569' }}>Default Primary Color</span>
                    <input
                      type="color"
                      value={document.settings.primaryColor}
                      onChange={(e) => onUpdateSettings({ primaryColor: e.target.value })}
                      style={{ width: '28px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
