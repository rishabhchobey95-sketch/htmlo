import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlass,
  Sparkle,
  SquareSplitHorizontal,
  ShieldCheck,
  Eye,
  DownloadSimple,
  TextT,
  Image,
  CursorClick,
  Minus,
  Rows,
  ShareNetwork,
  Video,
  FileCode,
  ListDashes,
  Timer,
  Shapes,
  Moon,
  Sun,
  X,
} from '@phosphor-icons/react';
import { BlockType } from '../types/editor';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock: (type: BlockType) => void;
  onInsertStructure: (colCount: number) => void;
  onTriggerAi: (prompt: string) => void;
  onOpenAudit: () => void;
  onOpenPreview: () => void;
  onOpenExport: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

interface CommandItem {
  id: string;
  category: 'Blocks' | 'Structures' | 'AI Director' | 'Tools & Audit';
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onInsertBlock,
  onInsertStructure,
  onTriggerAi,
  onOpenAudit,
  onOpenPreview,
  onOpenExport,
  onToggleDarkMode,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // AI Director
    {
      id: 'ai-launch',
      category: 'AI Director',
      label: 'Build Complete SaaS Product Launch Email',
      description: 'Summon 4-agent swarm to craft hero, countdown, and features',
      icon: <Sparkle size={16} className="text-indigo-400" weight="fill" />,
      action: () => onTriggerAi('Create a SaaS Product Launch Email with countdown and features'),
      shortcut: 'Cmd+J',
    },
    {
      id: 'ai-newsletter',
      category: 'AI Director',
      label: 'Design Minimalist Founder Weekly Newsletter',
      description: 'Clean typographic layout with editorial storytelling',
      icon: <Sparkle size={16} className="text-emerald-400" weight="fill" />,
      action: () => onTriggerAi('Design a Minimalist Founder Weekly Newsletter'),
    },
    {
      id: 'ai-ecommerce',
      category: 'AI Director',
      label: 'Create Luxury E-Commerce Drop with Timer',
      description: 'High-contrast product showcase with bulletproof CTA',
      icon: <Sparkle size={16} className="text-amber-400" weight="fill" />,
      action: () => onTriggerAi('Create Luxury E-Commerce Drop with Live Countdown Timer'),
    },
    // Blocks
    {
      id: 'blk-text',
      category: 'Blocks',
      label: 'Insert Text Block',
      description: 'Headings, paragraphs, bullet points with rich typography',
      icon: <TextT size={16} className="text-blue-400" />,
      action: () => onInsertBlock('text'),
    },
    {
      id: 'blk-button',
      category: 'Blocks',
      label: 'Insert Bulletproof Button',
      description: 'Outlook MSO VML roundrect compatible CTA',
      icon: <CursorClick size={16} className="text-emerald-400" />,
      action: () => onInsertBlock('button'),
    },
    {
      id: 'blk-image',
      category: 'Blocks',
      label: 'Insert Image Block',
      description: 'Fluid retina image with alt tags and destination URL',
      icon: <Image size={16} className="text-purple-400" />,
      action: () => onInsertBlock('image'),
    },
    {
      id: 'blk-timer',
      category: 'Blocks',
      label: 'Insert Countdown Timer',
      description: 'Cross-client table countdown with Days/Hours/Mins/Secs',
      icon: <Timer size={16} className="text-red-400" />,
      action: () => onInsertBlock('timer'),
    },
    {
      id: 'blk-shape',
      category: 'Blocks',
      label: 'Insert Vector Shape / Pill Badge',
      description: 'Pills, badges, diamonds, and accent decorative bars',
      icon: <Shapes size={16} className="text-amber-400" />,
      action: () => onInsertBlock('shape'),
    },
    {
      id: 'blk-video',
      category: 'Blocks',
      label: 'Insert Video Thumbnail',
      description: 'Clickable thumbnail with play badge overlay',
      icon: <Video size={16} className="text-rose-400" />,
      action: () => onInsertBlock('video'),
    },
    {
      id: 'blk-social',
      category: 'Blocks',
      label: 'Insert Social Icons Bar',
      description: 'Twitter/X, GitHub, LinkedIn, Instagram networks',
      icon: <ShareNetwork size={16} className="text-cyan-400" />,
      action: () => onInsertBlock('social'),
    },
    {
      id: 'blk-divider',
      category: 'Blocks',
      label: 'Insert Divider Line',
      description: 'Solid, dashed, or dotted styled separator line',
      icon: <Minus size={16} className="text-zinc-400" />,
      action: () => onInsertBlock('divider'),
    },
    {
      id: 'blk-html',
      category: 'Blocks',
      label: 'Insert Custom HTML / AMP Snippet',
      description: 'Raw HTML table, custom styles, or embed snippet',
      icon: <FileCode size={16} className="text-orange-400" />,
      action: () => onInsertBlock('html'),
    },
    {
      id: 'blk-menu',
      category: 'Blocks',
      label: 'Insert Header Menu Row',
      description: 'Horizontal link navigation items with delimiters',
      icon: <ListDashes size={16} className="text-teal-400" />,
      action: () => onInsertBlock('menu'),
    },
    // Structures
    {
      id: 'struct-1col',
      category: 'Structures',
      label: 'Insert 1-Column Row',
      description: 'Single 100% full-width column structure',
      icon: <Rows size={16} className="text-indigo-400" />,
      action: () => onInsertStructure(1),
    },
    {
      id: 'struct-2col',
      category: 'Structures',
      label: 'Insert 2-Column Row (50% / 50%)',
      description: 'Two fluid columns with mobile stacking',
      icon: <SquareSplitHorizontal size={16} className="text-indigo-400" />,
      action: () => onInsertStructure(2),
    },
    {
      id: 'struct-3col',
      category: 'Structures',
      label: 'Insert 3-Column Row (33% x 3)',
      description: 'Three fluid columns for feature grids',
      icon: <SquareSplitHorizontal size={16} className="text-indigo-400" />,
      action: () => onInsertStructure(3),
    },
    {
      id: 'struct-4col',
      category: 'Structures',
      label: 'Insert 4-Column Row (25% x 4)',
      description: 'Four columns for mini badges or product rows',
      icon: <SquareSplitHorizontal size={16} className="text-indigo-400" />,
      action: () => onInsertStructure(4),
    },
    // Tools
    {
      id: 'tool-audit',
      category: 'Tools & Audit',
      label: 'Open Deliverability & MSO Preflight Auditor',
      description: 'Audit 102KB Gmail clipping, Outlook VML, and WCAG contrast',
      icon: <ShieldCheck size={16} className="text-cyan-400" weight="fill" />,
      action: onOpenAudit,
    },
    {
      id: 'tool-preview',
      category: 'Tools & Audit',
      label: 'Open Live Device Preview',
      description: 'Desktop, Mobile iframe simulation with persona switcher',
      icon: <Eye size={16} className="text-emerald-400" />,
      action: onOpenPreview,
    },
    {
      id: 'tool-export',
      category: 'Tools & Audit',
      label: 'Export Compiled HTML & JSON',
      description: 'Download RFC 5322 XHTML or copy to clipboard',
      icon: <DownloadSimple size={16} className="text-amber-400" />,
      action: onOpenExport,
    },
    {
      id: 'tool-darkmode',
      category: 'Tools & Audit',
      label: isDarkMode ? 'Switch to Canvas Light Mode' : 'Simulate Client Dark Mode Inversion',
      description: 'Simulates Outlook / Gmail Android color inversion',
      icon: isDarkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-indigo-400" />,
      action: onToggleDarkMode,
    },
  ];

  // Filter commands by query
  const filtered = commands.filter((c) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.label.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '90px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#121217',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '14px',
          boxShadow: '0 28px 70px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <MagnifyingGlass size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search blocks, or summon AI swarm..."
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#ffffff',
              fontFamily: 'inherit',
            }}
          />
          <kbd
            style={{
              padding: '2px 6px',
              fontSize: '10px',
              fontFamily: 'monospace',
              color: '#94a3b8',
              backgroundColor: '#27272a',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            ESC
          </kbd>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '4px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                    color: isSelected ? '#ffffff' : '#d4d4d8',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            backgroundColor: '#27272a',
                            color: '#a1a1aa',
                            fontWeight: 400,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#27272a',
                        color: '#a1a1aa',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Helper Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            backgroundColor: 'rgba(9, 9, 11, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11px',
            color: '#71717a',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>htmlo v2.0 // Argon Core</span>
        </div>
      </div>
    </div>
  );
};
