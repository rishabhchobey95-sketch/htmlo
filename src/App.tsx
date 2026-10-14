import React, { useState, useMemo } from 'react';
import { initialEmailDoc } from './data/defaultTemplate';
import { EmailDocument, ViewMode, ActiveTab, BlockType, BlockNode, StripeNode, StructureNode } from './types/editor';
import { EmailCompiler } from './compiler/EmailCompiler';
import { TopBar } from './components/TopBar';
import { LeftDock } from './components/LeftDock';
import { Canvas } from './components/Canvas';
import { InspectorPanel } from './components/InspectorPanel';
import { CodeView } from './components/CodeView';
import { PreviewModal } from './components/PreviewModal';
import { ExportModal } from './components/ExportModal';
import { Dashboard } from './components/Dashboard';
import { AiAssistantModal, AiOptions } from './components/AiAssistantModal';
import { AiFloatingCursors } from './components/AiFloatingCursors';
import { DockLayoutState, DEFAULT_DOCK_LAYOUT } from './types/dock';
import { FloatingWindow } from './components/FloatingWindow';
import { DockSplitter } from './components/DockSplitter';
import { CommandPalette } from './components/CommandPalette';
import { AuditPanel } from './components/AuditPanel';
import { runCompilerSelfTest } from './compiler/compilerSelfTest';
import {
  SquaresFour,
  SlidersHorizontal,
  Code as CodeIcon,
} from '@phosphor-icons/react';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'editor'>('dashboard');
  const [document, setDocument] = useState<EmailDocument>(initialEmailDoc);
  const [history, setHistory] = useState<EmailDocument[]>([initialEmailDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<ActiveTab>('blocks');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [selectedStripeId, setSelectedStripeId] = useState<string | null>(null);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);

  // Sync selectedBlockId with selectedBlockIds
  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id);
    setSelectedBlockIds(id ? [id] : []);
  };

  const handleToggleSelectBlock = (id: string) => {
    setSelectedBlockIds((prev) => {
      const exists = prev.includes(id);
      let next: string[];
      if (exists) {
        next = prev.filter((item) => item !== id);
      } else {
        next = [...prev, id];
      }
      setSelectedBlockId(next.length > 0 ? next[next.length - 1] : null);
      return next;
    });
  };

  const handleSelectMultipleBlocks = (ids: string[]) => {
    setSelectedBlockIds(ids);
    setSelectedBlockId(ids.length > 0 ? ids[ids.length - 1] : null);
  };

  const handleClearSelection = () => {
    setSelectedBlockId(null);
    setSelectedBlockIds([]);
    setSelectedStripeId(null);
    setSelectedStructureId(null);
  };

  // Docking & Shifting Window Layout State
  const [dockLayout, setDockLayout] = useState<DockLayoutState>(() => {
    try {
      const saved = localStorage.getItem('htmlo_dock_layout');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DOCK_LAYOUT;
  });

  const handleUpdateDockLayout = (updater: (prev: DockLayoutState) => DockLayoutState) => {
    setDockLayout((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('htmlo_dock_layout', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleResetDockLayout = () => {
    setDockLayout(DEFAULT_DOCK_LAYOUT);
    try {
      localStorage.setItem('htmlo_dock_layout', JSON.stringify(DEFAULT_DOCK_LAYOUT));
    } catch {}
  };

  const handleSwapSideDocks = () => {
    handleUpdateDockLayout((prev) => ({
      ...prev,
      palettePosition: prev.palettePosition === 'left' ? 'right' : prev.palettePosition === 'right' ? 'left' : prev.palettePosition,
      inspectorPosition: prev.inspectorPosition === 'right' ? 'left' : prev.inspectorPosition === 'left' ? 'right' : prev.inspectorPosition,
    }));
  };

  // AI Assistant & Collaborative Floating Cursors state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  // Enterprise Modals & Simulation State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuditPanelOpen, setIsAuditPanelOpen] = useState(false);
  const [isDarkModeSimulated, setIsDarkModeSimulated] = useState(false);
  const [compilerTestStatus] = useState<'pass' | 'fail'>(() => {
    try {
      return runCompilerSelfTest().passed ? 'pass' : 'fail';
    } catch {
      return 'fail';
    }
  });

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Command Palette, Cmd+J for AI Director)
  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Compile HTML
  const compiledHtml = useMemo(() => {
    return EmailCompiler.compile(document);
  }, [document]);

  // Coalesced History Commits (Trailing debounce for rapid scrubbing, immediate for node operations)
  const historyDebounceRef = React.useRef<number | null>(null);

  const pushState = (newDoc: EmailDocument, immediate = false) => {
    setDocument(newDoc);
    if (immediate) {
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      const updatedHistory = history.slice(0, historyIndex + 1);
      updatedHistory.push(newDoc);
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    } else {
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = window.setTimeout(() => {
        setHistory((prev) => {
          const updated = prev.slice(0, historyIndex + 1);
          updated.push(newDoc);
          return updated;
        });
        setHistoryIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setDocument(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setDocument(history[historyIndex + 1]);
    }
  };

  const handleUpdateSettings = (updates: Partial<EmailDocument['settings']>) => {
    const newDoc = {
      ...document,
      settings: { ...document.settings, ...updates },
    };
    pushState(newDoc);
  };

  const handleUpdateBlockContent = (blockId: string, content: string) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          const b = col.blocks.find((blk) => blk.id === blockId);
          if (b) {
            b.props.content = content;
            break;
          }
        }
      }
    }
    pushState(newDoc);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<BlockNode> | { props: any }) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          const b = col.blocks.find((blk) => blk.id === blockId);
          if (b) {
            Object.assign(b, updates);
            break;
          }
        }
      }
    }
    pushState(newDoc);
  };

  const handleDeleteBlock = (blockId?: string) => {
    const idsToDelete = blockId ? [blockId] : selectedBlockIds.length > 0 ? selectedBlockIds : selectedBlockId ? [selectedBlockId] : [];
    if (idsToDelete.length === 0) return;

    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          col.blocks = col.blocks.filter((b) => !idsToDelete.includes(b.id));
        }
      }
    }
    setSelectedBlockId(null);
    setSelectedBlockIds([]);
    pushState(newDoc);
  };

  const handleDuplicateBlock = (blockId?: string) => {
    const idsToDuplicate = blockId ? [blockId] : selectedBlockIds.length > 0 ? selectedBlockIds : selectedBlockId ? [selectedBlockId] : [];
    if (idsToDuplicate.length === 0) return;

    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    const newSelectedIds: string[] = [];

    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          const nextBlocks: BlockNode[] = [];
          for (const blk of col.blocks) {
            nextBlocks.push(blk);
            if (idsToDuplicate.includes(blk.id)) {
              const clone = JSON.parse(JSON.stringify(blk)) as BlockNode;
              clone.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
              nextBlocks.push(clone);
              newSelectedIds.push(clone.id);
            }
          }
          col.blocks = nextBlocks;
        }
      }
    }
    if (newSelectedIds.length > 0) {
      setSelectedBlockIds(newSelectedIds);
      setSelectedBlockId(newSelectedIds[newSelectedIds.length - 1]);
    }
    pushState(newDoc);
  };

  const handleBatchUpdateBlocks = (updates: Partial<BlockNode> | { props: any }) => {
    const idsToUpdate = selectedBlockIds.length > 0 ? selectedBlockIds : selectedBlockId ? [selectedBlockId] : [];
    if (idsToUpdate.length === 0) return;

    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          for (const b of col.blocks) {
            if (idsToUpdate.includes(b.id)) {
              if ('props' in updates) {
                b.props = { ...b.props, ...(updates as any).props };
              }
              const restUpdates = { ...updates };
              delete (restUpdates as any).props;
              Object.assign(b, restUpdates);
            }
          }
        }
      }
    }
    pushState(newDoc);
  };

  const handleUpdateStripe = (stripeId: string, updates: Partial<StripeNode>) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    const stripe = newDoc.stripes.find((s) => s.id === stripeId);
    if (stripe) {
      Object.assign(stripe, updates);
      pushState(newDoc);
    }
  };

  // Add block to first available column or selected container
  const createDefaultBlock = (type: BlockType): BlockNode => {
    const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    switch (type) {
      case 'text':
        return {
          id,
          type: 'text',
          align: 'left',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            content: '<p style="margin:0;font-size:16px;line-height:1.5;">Type your text here or edit styles in the inspector.</p>',
            color: '#1e293b',
            fontSize: 16,
            lineHeight: 1.5,
          },
        };
      case 'button':
        return {
          id,
          type: 'button',
          align: 'center',
          padding: { top: 14, right: 16, bottom: 14, left: 16 },
          props: {
            text: 'Action Button',
            url: 'https://',
            buttonColor: '#22c55e',
            textColor: '#ffffff',
            borderRadius: 6,
            fontSize: 15,
          },
        };
      case 'image':
        return {
          id,
          type: 'image',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop',
            alt: 'Email image',
            imageWidth: 'full',
          },
        };
      case 'spacer':
        return {
          id,
          type: 'spacer',
          align: 'center',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          props: { spacerHeight: 28 },
        };
      case 'divider':
        return {
          id,
          type: 'divider',
          align: 'center',
          padding: { top: 14, right: 16, bottom: 14, left: 16 },
          props: { dividerHeight: 1, dividerStyle: 'solid', dividerColor: '#e2e8f0' },
        };
      case 'social':
        return {
          id,
          type: 'social',
          align: 'center',
          padding: { top: 14, right: 16, bottom: 14, left: 16 },
          props: {
            iconSize: 28,
            iconSpacing: 12,
            networks: [
              { id: '1', network: 'facebook', url: '#' },
              { id: '2', network: 'twitter', url: '#' },
              { id: '3', network: 'instagram', url: '#' },
              { id: '4', network: 'linkedin', url: '#' },
            ],
          },
        };
      case 'video':
        return {
          id,
          type: 'video',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop',
          },
        };
      case 'html':
        return {
          id,
          type: 'html',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            customHtml: '<div style="padding:16px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:6px;text-align:center;font-size:14px;color:#475569;">Custom HTML Element</div>',
          },
        };
      case 'menu':
        return {
          id,
          type: 'menu',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            menuItems: [
              { id: '1', label: 'Home', url: '#' },
              { id: '2', label: 'Products', url: '#' },
              { id: '3', label: 'Pricing', url: '#' },
              { id: '4', label: 'Contact', url: '#' },
            ],
          },
        };
      case 'timer':
        return {
          id,
          type: 'timer',
          align: 'center',
          padding: { top: 16, right: 16, bottom: 16, left: 16 },
          props: {
            days: '03',
            hours: '14',
            minutes: '28',
            seconds: '45',
          },
        };
      case 'shape':
        return {
          id,
          type: 'shape',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            shapeType: 'badge',
            shapeWidth: 'full',
            shapeHeight: 56,
            fillColor: '#f0fdf4',
            strokeColor: '#22c55e',
            strokeWidth: 2,
            strokeStyle: 'solid',
            borderRadius: 8,
            shapeText: '🔥 SPECIAL ANNOUNCEMENT',
            shapeTextColor: '#15803d',
          },
        };
      default:
        return {
          id,
          type,
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {},
        };
    }
  };

  // Add block to first available column or right after selected block
  const handleAddBlock = (type: BlockType) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    const newBlock = createDefaultBlock(type);

    // 1. If a block is currently selected, insert immediately after it
    if (selectedBlockId) {
      for (const stripe of newDoc.stripes) {
        for (const struct of stripe.structures) {
          for (const col of struct.columns) {
            const idx = col.blocks.findIndex((b) => b.id === selectedBlockId);
            if (idx !== -1) {
              col.blocks.splice(idx + 1, 0, newBlock);
              setSelectedBlockId(newBlock.id);
              pushState(newDoc);
              return;
            }
          }
        }
      }
    }

    // 2. If a stripe is selected, insert into its first column
    if (selectedStripeId) {
      const stripe = newDoc.stripes.find((s) => s.id === selectedStripeId);
      if (stripe && stripe.structures[0]?.columns[0]) {
        stripe.structures[0].columns[0].blocks.push(newBlock);
        setSelectedBlockId(newBlock.id);
        pushState(newDoc);
        return;
      }
    }

    // 3. Fallback: add to the first content stripe or any column
    for (const stripe of newDoc.stripes) {
      if (stripe.structures[0]?.columns[0]) {
        stripe.structures[0].columns[0].blocks.push(newBlock);
        setSelectedBlockId(newBlock.id);
        pushState(newDoc);
        return;
      }
    }
  };

  const handleDropBlock = (containerId: string, blockType: BlockType, targetIndex?: number) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    const newBlock = createDefaultBlock(blockType);

    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        const col = struct.columns.find((c) => c.id === containerId);
        if (col) {
          if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= col.blocks.length) {
            col.blocks.splice(targetIndex, 0, newBlock);
          } else {
            col.blocks.push(newBlock);
          }
          setSelectedBlockId(newBlock.id);
          pushState(newDoc);
          return;
        }
      }
    }
  };

  const handleMoveBlock = (blockId: string, targetContainerId: string, targetIndex?: number) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    let blockToMove: BlockNode | null = null;

    // Find and remove from origin
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        for (const col of struct.columns) {
          const idx = col.blocks.findIndex((b) => b.id === blockId);
          if (idx !== -1) {
            blockToMove = col.blocks.splice(idx, 1)[0];
            break;
          }
        }
        if (blockToMove) break;
      }
      if (blockToMove) break;
    }

    if (!blockToMove) return;

    // Insert into destination
    for (const stripe of newDoc.stripes) {
      for (const struct of stripe.structures) {
        const col = struct.columns.find((c) => c.id === targetContainerId);
        if (col) {
          if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= col.blocks.length) {
            col.blocks.splice(targetIndex, 0, blockToMove);
          } else {
            col.blocks.push(blockToMove);
          }
          setSelectedBlockId(blockToMove.id);
          pushState(newDoc);
          return;
        }
      }
    }
  };

  const handleAddLayout = (cols: number[], targetIndex?: number) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    let targetStripe = selectedStripeId ? newDoc.stripes.find((s) => s.id === selectedStripeId) : null;
    let insertIndex = targetIndex;

    if (!targetStripe && selectedStructureId) {
      for (const s of newDoc.stripes) {
        const sIdx = s.structures.findIndex((st) => st.id === selectedStructureId);
        if (sIdx !== -1) {
          targetStripe = s;
          if (typeof insertIndex !== 'number') {
            insertIndex = sIdx + 1;
          }
          break;
        }
      }
    }

    if (!targetStripe) {
      targetStripe = newDoc.stripes.find((s) => s.stripeType === 'content') || newDoc.stripes[0];
    }
    if (!targetStripe) return;

    const newStructure: StructureNode = {
      id: `struct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stackOnMobile: true,
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      columns: cols.map((width, idx) => ({
        id: `col-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        widthPercent: width,
        padding: { top: 12, right: 12, bottom: 12, left: 12 },
        blocks: [],
      })),
    };

    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= targetStripe.structures.length) {
      targetStripe.structures.splice(insertIndex, 0, newStructure);
    } else {
      targetStripe.structures.push(newStructure);
    }

    setSelectedStructureId(newStructure.id);
    setSelectedStripeId(targetStripe.id);
    setSelectedBlockId(null);
    pushState(newDoc);
  };

  const handleDropStructure = (stripeId?: string, cols?: number[], targetIndex?: number) => {
    const validCols = cols && cols.length > 0 ? cols : [100];
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    let targetStripe = stripeId ? newDoc.stripes.find((s) => s.id === stripeId) : null;
    if (!targetStripe) {
      targetStripe = newDoc.stripes.find((s) => s.stripeType === 'content') || newDoc.stripes[0];
    }
    if (!targetStripe) return;

    const newStructure: StructureNode = {
      id: `struct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stackOnMobile: true,
      padding: { top: 16, right: 16, bottom: 16, left: 16 },
      columns: validCols.map((width, idx) => ({
        id: `col-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        widthPercent: width,
        padding: { top: 12, right: 12, bottom: 12, left: 12 },
        blocks: [],
      })),
    };

    if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= targetStripe.structures.length) {
      targetStripe.structures.splice(targetIndex, 0, newStructure);
    } else {
      targetStripe.structures.push(newStructure);
    }

    setSelectedStructureId(newStructure.id);
    setSelectedStripeId(targetStripe.id);
    setSelectedBlockId(null);
    pushState(newDoc);
  };

  const handleDeleteStructure = (structureId: string) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      const idx = stripe.structures.findIndex((s) => s.id === structureId);
      if (idx !== -1) {
        stripe.structures.splice(idx, 1);
        if (selectedStructureId === structureId) {
          setSelectedStructureId(null);
        }
        pushState(newDoc);
        return;
      }
    }
  };

  const handleDuplicateStructure = (structureId: string) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      const idx = stripe.structures.findIndex((s) => s.id === structureId);
      if (idx !== -1) {
        const origin = stripe.structures[idx];
        const clone: StructureNode = JSON.parse(JSON.stringify(origin));
        clone.id = `struct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        clone.columns = clone.columns.map((c, cIdx) => ({
          ...c,
          id: `col-${Date.now()}-${cIdx}-${Math.random().toString(36).substr(2, 4)}`,
          blocks: c.blocks.map((b) => ({
            ...b,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          })),
        }));
        stripe.structures.splice(idx + 1, 0, clone);
        setSelectedStructureId(clone.id);
        pushState(newDoc);
        return;
      }
    }
  };

  const handleMoveStructure = (structureId: string, direction: 'up' | 'down') => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    for (const stripe of newDoc.stripes) {
      const idx = stripe.structures.findIndex((s) => s.id === structureId);
      if (idx !== -1) {
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < stripe.structures.length) {
          const item = stripe.structures.splice(idx, 1)[0];
          stripe.structures.splice(targetIdx, 0, item);
          pushState(newDoc);
          return;
        }
      }
    }
  };

  const handleApplyModule = (moduleId: string) => {
    const newDoc = JSON.parse(JSON.stringify(document)) as EmailDocument;
    if (moduleId === 'hero-promo') {
      const heroStruct: StructureNode = {
        id: `struct-${Date.now()}`,
        stackOnMobile: true,
        padding: { top: 24, right: 24, bottom: 24, left: 24 },
        columns: [
          {
            id: `col-${Date.now()}`,
            widthPercent: 100,
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            blocks: [
              {
                id: `blk-${Date.now()}-1`,
                type: 'text',
                align: 'center',
                padding: { top: 8, right: 0, bottom: 8, left: 0 },
                props: { content: '<h2 style="font-size:26px;color:#0f172a;margin:0;">Special Announcement</h2>' },
              },
              {
                id: `blk-${Date.now()}-2`,
                type: 'button',
                align: 'center',
                padding: { top: 12, right: 0, bottom: 12, left: 0 },
                props: { text: 'Claim Offer Now', buttonColor: '#10b981', textColor: '#ffffff' },
              },
            ],
          },
        ],
      };
      newDoc.stripes[1]?.structures.push(heroStruct);
      pushState(newDoc);
    }
  };

  const _handleExportHtml = () => {
    const blob = new Blob([compiledHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.settings.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'email'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplyHtmlFromCode = (newHtml: string) => {
    const parsed = EmailCompiler.parseHtml(newHtml);
    if (parsed) {
      pushState(parsed);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(compiledHtml);
  };

  const handleSave = () => {
    localStorage.setItem('htmlo_draft', JSON.stringify(document));
    alert('Draft successfully saved to local storage!');
  };

  const handleStartAiGeneration = (promptText: string, _options: AiOptions) => {
    setIsAiModalOpen(false);
    setAiPrompt(promptText);
    setCurrentScreen('editor');
    setIsAiGenerating(true);
  };

  const handleFinishAiGeneration = (generatedDoc: EmailDocument) => {
    setDocument(generatedDoc);
    setHistory([generatedDoc]);
    setHistoryIndex(0);
    setIsAiGenerating(false);
  };

  if (currentScreen === 'dashboard') {
    return (
      <>
        <Dashboard
          onOpenTemplate={(doc) => {
            setDocument(doc);
            setHistory([doc]);
            setHistoryIndex(0);
            setCurrentScreen('editor');
          }}
          onNewTemplate={() => {
            setCurrentScreen('editor');
          }}
          onOpenAiAssistant={() => setIsAiModalOpen(true)}
        />
        <AiAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          onGenerate={handleStartAiGeneration}
        />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Application Bar */}
      <TopBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isCodeOpen={isCodeDrawerOpen}
        onToggleCode={() => setIsCodeDrawerOpen(!isCodeDrawerOpen)}
        onBackToDashboard={() => setCurrentScreen('dashboard')}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onTriggerAiSwarm={() => {
          setAiPrompt('High-Conversion SaaS Product Launch Email');
          setIsAiGenerating(true);
        }}
        onOpenAudit={() => setIsAuditPanelOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDarkMode={isDarkModeSimulated}
        onToggleDarkMode={() => setIsDarkModeSimulated(!isDarkModeSimulated)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExportHtml={() => setIsExportOpen(true)}
        onCopyHtml={handleCopyHtml}
        onSave={handleSave}
        onOpenPreview={() => setIsPreviewOpen(true)}
        dockLayout={dockLayout}
        onUpdateDockLayout={handleUpdateDockLayout}
        onResetDockLayout={handleResetDockLayout}
        onSwapSideDocks={handleSwapSideDocks}
      />

      {/* Main Studio Workspace with Full Docking & Shifting System */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - var(--topbar-height))', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        
        {/* ================= LEFT SIDE PANEL (DOCK) ================= */}
        {/* If Left Panel is Palette */}
        {dockLayout.palettePosition === 'left' && (
          <div style={{ width: `${dockLayout.paletteWidth}px`, height: '100%', minHeight: 0, display: 'flex', flexShrink: 0 }}>
            <LeftDock
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddBlock={handleAddBlock}
              onAddLayout={handleAddLayout}
              onApplyModule={handleApplyModule}
              dockPosition="left"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: target }))}
              onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'floating' }))}
              onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'hidden' }))}
            />
          </div>
        )}

        {/* If Left Panel is Inspector (Shifted to Left!) */}
        {dockLayout.inspectorPosition === 'left' && (
          <div style={{ width: `${dockLayout.inspectorWidth}px`, height: '100%', minHeight: 0, display: 'flex', flexShrink: 0 }}>
            <InspectorPanel
              document={document}
              selectedBlockId={selectedBlockId}
              selectedBlockIds={selectedBlockIds}
              selectedStripeId={selectedStripeId}
              selectedStructureId={selectedStructureId}
              onUpdateSettings={handleUpdateSettings}
              onUpdateBlock={handleUpdateBlock}
              onBatchUpdateBlocks={handleBatchUpdateBlocks}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onUpdateStripe={handleUpdateStripe}
              onUnselectBlock={handleClearSelection}
              dockPosition="left"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: target }))}
              onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'floating' }))}
              onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'hidden' }))}
            />
          </div>
        )}

        {/* Left Resizer Splitter (if any panel is docked to left) */}
        {(dockLayout.palettePosition === 'left' || dockLayout.inspectorPosition === 'left') && (
          <DockSplitter
            direction="vertical"
            onResize={(delta) => {
              if (dockLayout.palettePosition === 'left') {
                handleUpdateDockLayout((prev) => ({
                  ...prev,
                  paletteWidth: Math.max(220, Math.min(520, prev.paletteWidth + delta)),
                }));
              } else {
                handleUpdateDockLayout((prev) => ({
                  ...prev,
                  inspectorWidth: Math.max(260, Math.min(560, prev.inspectorWidth + delta)),
                }));
              }
            }}
          />
        )}

        {/* Quick reveal strip if left dock is hidden */}
        {dockLayout.palettePosition === 'hidden' && dockLayout.inspectorPosition !== 'left' && (
          <div
            onClick={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'left' }))}
            title="Click to reveal Blocks Palette"
            style={{
              width: '26px',
              height: '100%',
              backgroundColor: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              zIndex: 30,
              userSelect: 'none',
            }}
          >
            <SquaresFour size={16} color="#22c55e" />
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '11px', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px' }}>
              Blocks
            </span>
          </div>
        )}

        {/* ================= CENTER: CANVAS + CODE VIEW ================= */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          
          {/* Main Visual Canvas Area (Side-by-Side if Code is docked Right!) */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
            <Canvas
              document={document}
              viewMode={viewMode === 'mobile' ? 'mobile' : 'desktop'}
              selectedBlockId={selectedBlockId}
              selectedBlockIds={selectedBlockIds}
              selectedStripeId={selectedStripeId}
              selectedStructureId={selectedStructureId}
              onSelectBlock={handleSelectBlock}
              onToggleSelectBlock={handleToggleSelectBlock}
              onSelectMultipleBlocks={handleSelectMultipleBlocks}
              onSelectStripe={setSelectedStripeId}
              onSelectStructure={setSelectedStructureId}
              onUpdateBlockContent={handleUpdateBlockContent}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onDropBlock={handleDropBlock}
              onMoveBlock={handleMoveBlock}
              onDropStructure={handleDropStructure}
              onDeleteStructure={handleDeleteStructure}
              onDuplicateStructure={handleDuplicateStructure}
              onMoveStructure={handleMoveStructure}
            />

            {/* If Code Editor is docked to RIGHT side split! */}
            {isCodeDrawerOpen && dockLayout.codePosition === 'right' && (
              <>
                <DockSplitter
                  direction="vertical"
                  onResize={(delta) => {
                    handleUpdateDockLayout((prev) => ({
                      ...prev,
                      codeWidth: Math.max(340, Math.min(window.innerWidth * 0.6, prev.codeWidth - delta)),
                    }));
                  }}
                />
                <div style={{ width: `${dockLayout.codeWidth}px`, height: '100%', minHeight: 0, display: 'flex', flexShrink: 0 }}>
                  <CodeView
                    htmlContent={compiledHtml}
                    onApplyHtml={handleApplyHtmlFromCode}
                    onClose={() => setIsCodeDrawerOpen(false)}
                    customCss={document.settings.customCss || ''}
                    onUpdateCustomCss={(css) => handleUpdateSettings({ customCss: css })}
                    dockPosition="right"
                    onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: target }))}
                    onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: 'floating' }))}
                  />
                </div>
              </>
            )}
          </div>

          {/* Bottom Split Code Editor (when docked to Bottom!) */}
          {isCodeDrawerOpen && dockLayout.codePosition === 'bottom' && (
            <>
              <DockSplitter
                direction="horizontal"
                onResize={(delta) => {
                  handleUpdateDockLayout((prev) => ({
                    ...prev,
                    codeHeight: Math.max(160, Math.min(window.innerHeight * 0.75, prev.codeHeight - delta)),
                  }));
                }}
              />
              <div style={{ height: `${dockLayout.codeHeight}px`, width: '100%', flexShrink: 0 }}>
                <CodeView
                  htmlContent={compiledHtml}
                  onApplyHtml={handleApplyHtmlFromCode}
                  onClose={() => setIsCodeDrawerOpen(false)}
                  customCss={document.settings.customCss || ''}
                  onUpdateCustomCss={(css) => handleUpdateSettings({ customCss: css })}
                  dockPosition="bottom"
                  onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: target }))}
                  onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: 'floating' }))}
                />
              </div>
            </>
          )}
        </div>

        {/* Right Resizer Splitter (if any panel is docked to right) */}
        {(dockLayout.inspectorPosition === 'right' || dockLayout.palettePosition === 'right') && (
          <DockSplitter
            direction="vertical"
            onResize={(delta) => {
              if (dockLayout.inspectorPosition === 'right') {
                handleUpdateDockLayout((prev) => ({
                  ...prev,
                  inspectorWidth: Math.max(260, Math.min(560, prev.inspectorWidth - delta)),
                }));
              } else {
                handleUpdateDockLayout((prev) => ({
                  ...prev,
                  paletteWidth: Math.max(220, Math.min(520, prev.paletteWidth - delta)),
                }));
              }
            }}
          />
        )}

        {/* ================= RIGHT SIDE PANEL (DOCK) ================= */}
        {/* If Right Panel is Inspector */}
        {dockLayout.inspectorPosition === 'right' && (
          <div style={{ width: `${dockLayout.inspectorWidth}px`, height: '100%', minHeight: 0, display: 'flex', flexShrink: 0 }}>
            <InspectorPanel
              document={document}
              selectedBlockId={selectedBlockId}
              selectedBlockIds={selectedBlockIds}
              selectedStripeId={selectedStripeId}
              selectedStructureId={selectedStructureId}
              onUpdateSettings={handleUpdateSettings}
              onUpdateBlock={handleUpdateBlock}
              onBatchUpdateBlocks={handleBatchUpdateBlocks}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onUpdateStripe={handleUpdateStripe}
              onUnselectBlock={handleClearSelection}
              dockPosition="right"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: target }))}
              onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'floating' }))}
              onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'hidden' }))}
            />
          </div>
        )}

        {/* If Right Panel is Palette (Shifted to Right!) */}
        {dockLayout.palettePosition === 'right' && (
          <div style={{ width: `${dockLayout.paletteWidth}px`, height: '100%', minHeight: 0, display: 'flex', flexShrink: 0 }}>
            <LeftDock
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddBlock={handleAddBlock}
              onAddLayout={handleAddLayout}
              onApplyModule={handleApplyModule}
              dockPosition="right"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: target }))}
              onFloat={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'floating' }))}
              onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'hidden' }))}
            />
          </div>
        )}

        {/* Quick reveal strip if right dock is hidden */}
        {dockLayout.inspectorPosition === 'hidden' && dockLayout.palettePosition !== 'right' && (
          <div
            onClick={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'right' }))}
            title="Click to reveal Inspector Panel"
            style={{
              width: '26px',
              height: '100%',
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              zIndex: 30,
              userSelect: 'none',
            }}
          >
            <SlidersHorizontal size={16} color="#22c55e" />
            <span style={{ writingMode: 'vertical-rl', fontSize: '11px', fontWeight: 600, color: '#64748b', letterSpacing: '0.5px' }}>
              Inspector
            </span>
          </div>
        )}

        {/* ================= FLOATING WINDOWS (DETACHED MODE) ================= */}
        {/* Floating Palette Window */}
        {dockLayout.palettePosition === 'floating' && (
          <FloatingWindow
            title="Blocks & Elements Palette"
            icon={<SquaresFour size={16} color="#22c55e" />}
            initialState={dockLayout.floatingPalette}
            onStateChange={(st) => handleUpdateDockLayout((prev) => ({ ...prev, floatingPalette: st }))}
            onDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: target as any }))}
            onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: 'hidden' }))}
          >
            <LeftDock
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddBlock={handleAddBlock}
              onAddLayout={handleAddLayout}
              onApplyModule={handleApplyModule}
              dockPosition="floating"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, palettePosition: target }))}
              onFloat={() => {}}
            />
          </FloatingWindow>
        )}

        {/* Floating Inspector Window */}
        {dockLayout.inspectorPosition === 'floating' && (
          <FloatingWindow
            title="Inspector & Styles"
            icon={<SlidersHorizontal size={16} color="#22c55e" />}
            initialState={dockLayout.floatingInspector}
            onStateChange={(st) => handleUpdateDockLayout((prev) => ({ ...prev, floatingInspector: st }))}
            onDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: target as any }))}
            onClose={() => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: 'hidden' }))}
          >
            <InspectorPanel
              document={document}
              selectedBlockId={selectedBlockId}
              selectedBlockIds={selectedBlockIds}
              selectedStripeId={selectedStripeId}
              selectedStructureId={selectedStructureId}
              onUpdateSettings={handleUpdateSettings}
              onUpdateBlock={handleUpdateBlock}
              onBatchUpdateBlocks={handleBatchUpdateBlocks}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onUpdateStripe={handleUpdateStripe}
              onUnselectBlock={handleClearSelection}
              dockPosition="floating"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, inspectorPosition: target }))}
              onFloat={() => {}}
            />
          </FloatingWindow>
        )}

        {/* Floating Code Editor Window */}
        {isCodeDrawerOpen && dockLayout.codePosition === 'floating' && (
          <FloatingWindow
            title="HTML & CSS Studio IDE"
            icon={<CodeIcon size={16} color="#22c55e" />}
            initialState={dockLayout.floatingCode}
            onStateChange={(st) => handleUpdateDockLayout((prev) => ({ ...prev, floatingCode: st }))}
            onDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: target as any }))}
            onClose={() => setIsCodeDrawerOpen(false)}
            supportedDocks={[
              { target: 'bottom', label: 'Dock Bottom', icon: <CodeIcon size={14} /> },
              { target: 'right', label: 'Dock Side Split', icon: <SlidersHorizontal size={14} /> },
            ]}
          >
            <CodeView
              htmlContent={compiledHtml}
              onApplyHtml={handleApplyHtmlFromCode}
              onClose={() => setIsCodeDrawerOpen(false)}
              customCss={document.settings.customCss || ''}
              onUpdateCustomCss={(css) => handleUpdateSettings({ customCss: css })}
              dockPosition="floating"
              onShiftDock={(target) => handleUpdateDockLayout((prev) => ({ ...prev, codePosition: target }))}
              onFloat={() => {}}
            />
          </FloatingWindow>
        )}
      </div>

      {/* Standalone Dual-Screen Preview Modal (Stripo Exact) */}
      {isPreviewOpen && (
        <PreviewModal
          htmlContent={compiledHtml}
          templateName={document.settings.title}
          subjectLine={document.settings.title}
          onClose={() => setIsPreviewOpen(false)}
          onExport={() => {
            setIsPreviewOpen(false);
            setIsExportOpen(true);
          }}
        />
      )}

      {/* Stripo Exact Export Modal */}
      {isExportOpen && (
        <ExportModal
          htmlContent={compiledHtml}
          templateName={document.settings.title}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Collaborative Animated Floating AI Cursors */}
      {isAiGenerating && (
        <AiFloatingCursors
          isActive={isAiGenerating}
          prompt={aiPrompt}
          onFinish={handleFinishAiGeneration}
          onCancel={() => setIsAiGenerating(false)}
        />
      )}

      {/* AI Assistant Creation Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerate={handleStartAiGeneration}
      />

      {/* Bottom Telemetry Status Bar */}
      <footer
        style={{
          height: '26px',
          padding: '0 16px',
          backgroundColor: '#0c0c0e',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#94a3b8',
          userSelect: 'none',
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '10.5px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: compilerTestStatus === 'pass' ? '#10b981' : '#ef4444',
                boxShadow: compilerTestStatus === 'pass' ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none',
              }}
            />
            <span style={{ color: compilerTestStatus === 'pass' ? '#34d399' : '#f87171', fontWeight: 600 }}>
              Compiler Self-Test: {compilerTestStatus === 'pass' ? '100% PASS' : 'FAIL'}
            </span>
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
            AST: {document.stripes.length} Stripes // Width: {document.settings.contentWidth}px
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            onClick={() => setIsAuditPanelOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#22d3ee')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <span>Preflight:</span>
            <span style={{ color: '#22d3ee', fontFamily: 'monospace', fontWeight: 600 }}>102 KB Meter</span>
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span
            onClick={() => {
              setAiPrompt('High-Conversion SaaS Product Launch Email');
              setIsAiGenerating(true);
            }}
            title="Click to summon AI Swarm Cursors"
            style={{ color: '#818cf8', fontFamily: 'monospace', cursor: 'pointer', transition: 'color 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c7d2fe')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#818cf8')}
          >
            ⚡ Summon Swarm (⌘J)
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Click or press ⌘K to open Commands"
            style={{ color: '#64748b', fontFamily: 'monospace', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ⌘K Commands
          </span>
        </div>
      </footer>

      {/* Global Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onInsertBlock={(type) => {
          const firstStripe = document.stripes[0];
          const firstStruct = firstStripe?.structures[0];
          const firstCol = firstStruct?.columns[0];
          if (firstCol) {
            handleDropBlock(firstCol.id, type, 0);
          }
        }}
        onInsertStructure={(colCount) => {
          const firstStripe = document.stripes[0];
          if (firstStripe) {
            let cols = [100];
            if (colCount === 2) cols = [50, 50];
            else if (colCount === 3) cols = [33.33, 33.33, 33.34];
            else if (colCount === 4) cols = [25, 25, 25, 25];
            handleDropStructure(firstStripe.id, cols, 0);
          }
        }}
        onTriggerAi={(p) => {
          setAiPrompt(p);
          setIsAiGenerating(true);
        }}
        onOpenAudit={() => setIsAuditPanelOpen(true)}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleDarkMode={() => setIsDarkModeSimulated(!isDarkModeSimulated)}
        isDarkMode={isDarkModeSimulated}
      />

      {/* Deliverability & MSO Preflight Auditor */}
      <AuditPanel
        isOpen={isAuditPanelOpen}
        onClose={() => setIsAuditPanelOpen(false)}
        document={document}
        onAutoFix={(fixedDoc) => pushState(fixedDoc, true)}
        onSummonAiFix={() => {
          setAiPrompt('Auto-fix all MSO and deliverability risks');
          setIsAiGenerating(true);
        }}
      />
    </div>
  );
};

export default App;
