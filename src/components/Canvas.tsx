import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Trash,
  Copy,
  DotsSixVertical,
  TextB,
  TextItalic,
  TextAUnderline,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  PencilSimple,
  Plus,
  CaretUp,
  CaretDown,
  Columns,
  Code,
  Check,
} from '@phosphor-icons/react';
import {
  EmailDocument,
  ViewMode,
  BlockType,
  BlockNode,
} from '../types/editor';

interface CanvasProps {
  document: EmailDocument;
  viewMode: ViewMode;
  selectedBlockId: string | null;
  selectedBlockIds?: string[];
  selectedStripeId: string | null;
  selectedStructureId?: string | null;
  onSelectBlock: (id: string | null) => void;
  onToggleSelectBlock?: (id: string) => void;
  onSelectMultipleBlocks?: (ids: string[]) => void;
  onSelectStripe: (id: string | null) => void;
  onSelectStructure?: (id: string | null) => void;
  onUpdateBlockContent: (blockId: string, content: string) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<BlockNode> | { props: any }) => void;
  onDeleteBlock: (blockId?: string) => void;
  onDuplicateBlock: (blockId?: string) => void;
  onDropBlock: (containerId: string, blockType: BlockType, targetIndex?: number) => void;
  onMoveBlock?: (blockId: string, targetContainerId: string, targetIndex?: number) => void;
  onDropStructure: (stripeId?: string, cols?: number[], targetIndex?: number) => void;
  onDeleteStructure?: (structureId: string) => void;
  onDuplicateStructure?: (structureId: string) => void;
  onMoveStructure?: (structureId: string, direction: 'up' | 'down') => void;
}

// Inline Text Editor with persistent focus & rich formatting bubble
const InlineTextEditor: React.FC<{
  block: BlockNode;
  isSelected: boolean;
  textColor?: string;
  fontFamily?: string;
  onContentChange: (html: string) => void;
  onSelect: () => void;
}> = ({ block, isSelected, textColor, fontFamily, onContentChange, onSelect }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const lastHtmlRef = useRef<string>(block.props.content || '');

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== (block.props.content || '')) {
      if (!isEditing) {
        contentRef.current.innerHTML = block.props.content || '<p>Click to edit text...</p>';
        lastHtmlRef.current = block.props.content || '';
      }
    }
  }, [block.props.content, isEditing]);

  const execCmd = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    if (contentRef.current) {
      const newHtml = contentRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onContentChange(newHtml);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Floating Stripo Rich Formatting Bar on Focus/Selection */}
      {(isSelected || isEditing) && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '-42px',
            left: '0',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 60,
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            fontSize: '12px',
          }}
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('bold');
            }}
            style={{ color: '#ffffff', padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Bold"
          >
            <TextB size={14} weight="bold" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('italic');
            }}
            style={{ color: '#ffffff', padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Italic"
          >
            <TextItalic size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('underline');
            }}
            style={{ color: '#ffffff', padding: '3px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Underline"
          >
            <TextAUnderline size={14} />
          </button>

          <div style={{ width: '1px', height: '14px', backgroundColor: '#475569' }} />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('justifyLeft');
            }}
            style={{ color: '#ffffff', padding: '3px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Align Left"
          >
            <TextAlignLeft size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('justifyCenter');
            }}
            style={{ color: '#ffffff', padding: '3px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Align Center"
          >
            <TextAlignCenter size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd('justifyRight');
            }}
            style={{ color: '#ffffff', padding: '3px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
            title="Align Right"
          >
            <TextAlignRight size={14} />
          </button>

          <div style={{ width: '1px', height: '14px', backgroundColor: '#475569' }} />

          <input
            type="color"
            defaultValue={block.props.color || '#1e293b'}
            onChange={(e) => execCmd('foreColor', e.target.value)}
            title="Text Color"
            style={{
              width: '18px',
              height: '18px',
              padding: 0,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              background: 'none',
            }}
          />
        </div>
      )}

      {/* Actual ContentEditable Area */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onFocus={() => {
          setIsEditing(true);
          onSelect();
        }}
        onBlur={(e) => {
          setIsEditing(false);
          const newHtml = e.currentTarget.innerHTML;
          if (newHtml !== lastHtmlRef.current) {
            lastHtmlRef.current = newHtml;
            onContentChange(newHtml);
          }
        }}
        style={{
          outline: 'none',
          color: block.props.color || textColor || '#1e293b',
          fontSize: `${block.props.fontSize || 16}px`,
          lineHeight: block.props.lineHeight || 1.5,
          fontFamily: block.props.fontFamily || fontFamily,
          fontWeight: block.props.fontWeight || (block.props.headingTag?.startsWith('h') ? 700 : 'normal'),
          fontStyle: block.props.fontStyle || 'normal',
          textAlign: block.align || 'left',
          minHeight: '22px',
          cursor: 'text',
        }}
      />
    </div>
  );
};

export const Canvas: React.FC<CanvasProps> = ({
  document,
  viewMode,
  selectedBlockId,
  selectedBlockIds = [],
  selectedStripeId,
  selectedStructureId,
  onSelectBlock,
  onToggleSelectBlock,
  onSelectMultipleBlocks,
  onSelectStripe,
  onSelectStructure,
  onUpdateBlockContent,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onDropBlock,
  onMoveBlock,
  onDropStructure,
  onDeleteStructure,
  onDuplicateStructure,
  onMoveStructure,
}) => {
  const { settings, stripes } = document;
  const contentWidth = viewMode === 'mobile' ? 375 : settings.contentWidth || 600;

  // Active Drag & Drop Hover States
  const [dropTarget, setDropTarget] = useState<{
    colId: string;
    index: number;
  } | null>(null);

  const [structureDropTarget, setStructureDropTarget] = useState<{
    stripeId: string;
    index: number;
  } | null>(null);

  const [hoveredStructId, setHoveredStructId] = useState<string | null>(null);
  const [editingButtonId, setEditingButtonId] = useState<string | null>(null);
  const [editingHtmlBlockId, setEditingHtmlBlockId] = useState<string | null>(null);
  const [editingHtmlValue, setEditingHtmlValue] = useState<string>('');

  // Marquee (Drag Box) Multi-Selection State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);

  // Compute active selected IDs set
  const activeSelectedSet = useMemo(() => {
    const set = new Set<string>(selectedBlockIds);
    if (selectedBlockId) set.add(selectedBlockId);
    return set;
  }, [selectedBlockIds, selectedBlockId]);

  const handleDrop = (e: React.DragEvent, colId: string, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
    setStructureDropTarget(null);

    const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      if (data.kind === 'block') {
        onDropBlock(colId, data.blockType, targetIndex);
      } else if (data.kind === 'move-block' && onMoveBlock) {
        onMoveBlock(data.blockId, colId, targetIndex);
      } else if (data.kind === 'structure') {
        // If a structure is dropped on a column/block, insert it right below this structure!
        let foundStripeId = '';
        let foundStructIdx = -1;
        for (const stripe of stripes) {
          const idx = stripe.structures.findIndex((st) => st.columns.some((c) => c.id === colId));
          if (idx !== -1) {
            foundStripeId = stripe.id;
            foundStructIdx = idx;
            break;
          }
        }
        if (foundStripeId) {
          onDropStructure(foundStripeId, data.cols, foundStructIdx + 1);
        } else {
          onDropStructure(undefined, data.cols);
        }
      }
    } catch (err) {
      console.warn('Drop error:', err);
    }
  };

  // Handle Marquee Selection
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag box if clicking on the canvas background, not on inputs or buttons
    if (e.button !== 0) return; // left click only
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.isContentEditable ||
      target.closest('[contenteditable="true"]') ||
      target.closest('button')
    ) {
      return;
    }

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMarquee({ startX: x, startY: y, currentX: x, currentY: y });
      setIsMarqueeDragging(true);

      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        onSelectBlock(null);
        onSelectStripe(null);
        setEditingButtonId(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMarqueeDragging || !marquee || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    setMarquee((prev) => (prev ? { ...prev, currentX: curX, currentY: curY } : null));

    // Calculate selection bounding box in viewport coordinates
    const minX = Math.min(marquee.startX, curX) + rect.left;
    const maxX = Math.max(marquee.startX, curX) + rect.left;
    const minY = Math.min(marquee.startY, curY) + rect.top;
    const maxY = Math.max(marquee.startY, curY) + rect.top;

    // Detect intersecting blocks
    const blockEls = canvasRef.current.querySelectorAll('[data-block-id]');
    const selectedIds: string[] = [];
    blockEls.forEach((el) => {
      const bRect = el.getBoundingClientRect();
      const intersects =
        bRect.left < maxX &&
        bRect.right > minX &&
        bRect.top < maxY &&
        bRect.bottom > minY;
      if (intersects) {
        const id = el.getAttribute('data-block-id');
        if (id) selectedIds.push(id);
      }
    });

    if (onSelectMultipleBlocks && selectedIds.length > 0) {
      onSelectMultipleBlocks(selectedIds);
    }
  };

  const handleMouseUp = () => {
    setIsMarqueeDragging(false);
    setMarquee(null);
  };

  return (
    <main
      className="stripo-canvas-bg"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        WebkitOverflowScrolling: 'touch',
        userSelect: isMarqueeDragging ? 'none' : 'auto',
      }}
    >
      {/* Visual Marquee Drag Box */}
      {isMarqueeDragging && marquee && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(marquee.startX, marquee.currentX)}px`,
            top: `${Math.min(marquee.startY, marquee.currentY)}px`,
            width: `${Math.abs(marquee.currentX - marquee.startX)}px`,
            height: `${Math.abs(marquee.currentY - marquee.startY)}px`,
            border: '1.5px dashed #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}

      {/* Floating Multi-Selection Toast Indicator */}
      {activeSelectedSet.size > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            zIndex: 100,
            fontSize: '13px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            {activeSelectedSet.size} elements selected
          </span>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#334155' }} />
          <button
            type="button"
            onClick={() => onDuplicateBlock()}
            title="Duplicate selected elements"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            <Copy size={14} />
            <span>Duplicate</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteBlock()}
            title="Delete selected elements"
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            <Trash size={14} />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectBlock(null);
              if (onSelectMultipleBlocks) onSelectMultipleBlocks([]);
            }}
            title="Clear selection"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '11px',
              padding: '2px 6px',
            }}
          >
            Clear (Esc)
          </button>
        </div>
      )}

      {/* Inner Centering Wrapper with generous scroll headroom & bottom clearance */}
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: viewMode === 'mobile' ? '30px 10px 320px 10px' : '40px 20px 320px 20px',
        }}
        onClick={(e) => {
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            onSelectBlock(null);
            onSelectStripe(null);
            setEditingButtonId(null);
          }
        }}
      >
        {/* Outer Email Card Canvas with exact Stripo soft shadow */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: `${contentWidth}px`,
            backgroundColor: settings.contentBackgroundColor || '#ffffff',
            borderRadius: viewMode === 'mobile' ? '36px' : '4px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
            border: viewMode === 'mobile' ? '10px solid #1e293b' : '1px solid #e2e8f0',
            overflow: 'hidden',
            transition: 'width 0.25s ease',
            position: 'relative',
          }}
        >
          {/* Custom Injected Email CSS from Pasted Template */}
          {settings.customCss && (
            <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
          )}

          {/* Mobile Mock Notch if mobile view */}
          {viewMode === 'mobile' && (
            <div
              style={{
                height: '24px',
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '60px', height: '4px', backgroundColor: '#475569', borderRadius: '9999px' }} />
            </div>
          )}

          {/* Stripes Loop */}
          {stripes.map((stripe) => (
            <div
              key={stripe.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStripe(stripe.id);
                onSelectBlock(null);
              }}
              style={{
                backgroundColor: stripe.backgroundColor || 'transparent',
                backgroundImage: stripe.backgroundImageUrl ? `url(${stripe.backgroundImageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: `${stripe.padding.top}px ${stripe.padding.right}px ${stripe.padding.bottom}px ${stripe.padding.left}px`,
                border: selectedStripeId === stripe.id ? '2px solid #64748b' : '1px solid transparent',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Stripo-style Stripe Pill Label */}
              {selectedStripeId === stripe.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#475569',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    zIndex: 20,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <span>Stripe ({stripe.stripeType})</span>
                  <DotsSixVertical size={12} />
                </div>
              )}

              {/* Inner Content Structure Width */}
              <div
                style={{
                  width: '100%',
                  maxWidth: `${settings.contentWidth}px`,
                  margin: '0 auto',
                  backgroundColor: 'transparent',
                  position: 'relative',
                }}
              >
                {/* When Stripe has 0 structures: Empty Drop Zone */}
                {stripe.structures.length === 0 && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStructureDropTarget({ stripeId: stripe.id, index: 0 });
                    }}
                    onDragLeave={(e) => {
                      e.stopPropagation();
                      setStructureDropTarget(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStructureDropTarget(null);
                      const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
                      if (raw) {
                        try {
                          const data = JSON.parse(raw);
                          if (data.kind === 'structure') {
                            onDropStructure(stripe.id, data.cols, 0);
                          }
                        } catch {}
                      }
                    }}
                    onClick={() => onDropStructure(stripe.id, [100], 0)}
                    style={{
                      padding: '32px 20px',
                      margin: '12px 0',
                      border: structureDropTarget?.stripeId === stripe.id ? '2px dashed #22c55e' : '1.5px dashed #cbd5e1',
                      borderRadius: '8px',
                      backgroundColor: structureDropTarget?.stripeId === stripe.id ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#64748b',
                    }}
                  >
                    <Columns size={26} color="#22c55e" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      Drop a Structure Here or Click to Add 1 Column
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Drag 1, 2, 3, or 4 column structures from the left dock
                    </span>
                  </div>
                )}

                {stripe.structures.map((struct, sIdx) => {
                  const isStructSelected = selectedStructureId === struct.id;
                  const isDropBefore = structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === sIdx;

                  return (
                    <React.Fragment key={struct.id}>
                      {/* Structure Drop Zone (Above Structure) */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setStructureDropTarget({ stripeId: stripe.id, index: sIdx });
                        }}
                        onDragLeave={(e) => {
                          e.stopPropagation();
                          if (structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === sIdx) {
                            setStructureDropTarget(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setStructureDropTarget(null);
                          const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
                          if (raw) {
                            try {
                              const data = JSON.parse(raw);
                              if (data.kind === 'structure') {
                                onDropStructure(stripe.id, data.cols, sIdx);
                              }
                            } catch {}
                          }
                        }}
                        style={{
                          height: isDropBefore ? '16px' : '4px',
                          backgroundColor: isDropBefore ? '#22c55e' : 'transparent',
                          borderRadius: '4px',
                          margin: '2px 0',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 25,
                        }}
                      >
                        {isDropBefore && (
                          <span
                            style={{
                              fontSize: '10px',
                              color: '#ffffff',
                              fontWeight: 700,
                              backgroundColor: '#15803d',
                              padding: '1px 8px',
                              borderRadius: '9999px',
                            }}
                          >
                            Insert Structure Here
                          </span>
                        )}
                      </div>

                      {/* Structure Container */}
                      <div
                        onMouseEnter={() => setHoveredStructId(struct.id)}
                        onMouseLeave={() => setHoveredStructId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStructure?.(struct.id);
                          onSelectBlock(null);
                          onSelectStripe(stripe.id);
                        }}
                        style={{
                          padding: `${struct.padding.top}px ${struct.padding.right}px ${struct.padding.bottom}px ${struct.padding.left}px`,
                          display: 'flex',
                          flexDirection: viewMode === 'mobile' && struct.stackOnMobile ? 'column' : 'row',
                          gap: '12px',
                          position: 'relative',
                          backgroundColor: struct.backgroundColor || 'transparent',
                          borderRadius: '6px',
                          border: isStructSelected ? '2px solid #22c55e' : hoveredStructId === struct.id ? '1px dashed #94a3b8' : '1px solid transparent',
                          transition: 'border 0.15s ease',
                        }}
                      >
                        {/* Floating Structure Action Toolbar */}
                        {(isStructSelected || hoveredStructId === struct.id) && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: '-26px',
                              right: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              zIndex: 40,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            }}
                          >
                            <span style={{ color: '#86efac', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Columns size={12} weight="bold" />
                              Structure ({struct.columns.length} Col{struct.columns.length > 1 ? 's' : ''})
                            </span>
                            {onMoveStructure && (
                              <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => onMoveStructure(struct.id, 'up')}
                                  title="Move Up"
                                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '1px 3px' }}
                                >
                                  <CaretUp size={12} weight="bold" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onMoveStructure(struct.id, 'down')}
                                  title="Move Down"
                                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '1px 3px' }}
                                >
                                  <CaretDown size={12} weight="bold" />
                                </button>
                              </div>
                            )}
                            {onDuplicateStructure && (
                              <button
                                type="button"
                                onClick={() => onDuplicateStructure(struct.id)}
                                title="Duplicate Structure"
                                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '1px 3px' }}
                              >
                                <Copy size={13} />
                              </button>
                            )}
                            {onDeleteStructure && (
                              <button
                                type="button"
                                onClick={() => onDeleteStructure(struct.id)}
                                title="Delete Structure"
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '1px 3px' }}
                              >
                                <Trash size={13} />
                              </button>
                            )}
                          </div>
                        )}

                        {struct.columns.map((col) => (
                          <div
                            key={col.id}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (col.blocks.length === 0) {
                                setDropTarget({ colId: col.id, index: 0 });
                              }
                            }}
                            onDragLeave={() => {
                              if (col.blocks.length === 0) {
                                setDropTarget(null);
                              }
                            }}
                            onDrop={(e) => handleDrop(e, col.id, col.blocks.length)}
                            style={{
                              flex: viewMode === 'mobile' ? '1 1 100%' : `${col.widthPercent} 0 0%`,
                              width: viewMode === 'mobile' ? '100%' : `${col.widthPercent}%`,
                              backgroundColor: col.backgroundColor || 'transparent',
                              padding: `${col.padding.top}px ${col.padding.right}px ${col.padding.bottom}px ${col.padding.left}px`,
                              minHeight: '52px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              borderRadius: '4px',
                              position: 'relative',
                            }}
                          >
                            {/* Empty Column Placeholder with Click-to-Add */}
                            {col.blocks.length === 0 && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDropBlock(col.id, 'text', 0);
                                }}
                                style={{
                                  padding: '20px 12px',
                                  textAlign: 'center',
                                  color: dropTarget?.colId === col.id ? '#16a34a' : '#64748b',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  border: dropTarget?.colId === col.id ? '2px dashed #22c55e' : '1.5px dashed #cbd5e1',
                                  borderRadius: '6px',
                                  backgroundColor: dropTarget?.colId === col.id ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                                  transition: 'all 0.15s ease',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  cursor: 'pointer',
                                }}
                                title="Click to add text or drag blocks here"
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontWeight: 600 }}>
                                  <Plus size={15} weight="bold" />
                                  <span>Add Block</span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>or drag from left panel</span>
                              </div>
                            )}

                        {/* Blocks in this Column */}
                        {col.blocks.map((block, bIdx) => {
                          const isSelected = activeSelectedSet.has(block.id);
                          const _isPrimarySelected = (selectedBlockId === block.id) || (selectedBlockIds.length > 0 && selectedBlockIds[selectedBlockIds.length - 1] === block.id);
                          const multiCount = activeSelectedSet.size;

                          return (
                            <React.Fragment key={block.id}>
                              {/* Stripo Drop Insertion Indicator (Above Block) */}
                              {dropTarget?.colId === col.id && dropTarget?.index === bIdx && (
                                <div
                                  style={{
                                    height: '4px',
                                    backgroundColor: '#22c55e',
                                    borderRadius: '2px',
                                    margin: '2px 0',
                                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.7)',
                                    animation: 'pulse 1s infinite',
                                  }}
                                />
                              )}

                              <div
                                data-block-id={block.id}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const isBottom = e.clientY - rect.top > rect.height / 2;
                                  setDropTarget({
                                    colId: col.id,
                                    index: isBottom ? bIdx + 1 : bIdx,
                                  });
                                }}
                                onDragLeave={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  if (
                                    e.clientX < rect.left ||
                                    e.clientX > rect.right ||
                                    e.clientY < rect.top ||
                                    e.clientY > rect.bottom
                                  ) {
                                    setDropTarget(null);
                                  }
                                }}
                                onDrop={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const isBottom = e.clientY - rect.top > rect.height / 2;
                                  handleDrop(e, col.id, isBottom ? bIdx + 1 : bIdx);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (e.shiftKey || e.ctrlKey || e.metaKey) {
                                    if (onToggleSelectBlock) {
                                      onToggleSelectBlock(block.id);
                                    } else {
                                      onSelectBlock(block.id);
                                    }
                                  } else {
                                    onSelectBlock(block.id);
                                  }
                                  onSelectStripe(null);
                                }}
                                style={{
                                  padding: `${block.padding.top}px ${block.padding.right}px ${block.padding.bottom}px ${block.padding.left}px`,
                                  textAlign: block.align,
                                  position: 'relative',
                                  border: isSelected
                                    ? multiCount > 1
                                      ? '2px solid #3b82f6'
                                      : '2px solid #22c55e'
                                    : '1px solid transparent',
                                  backgroundColor: isSelected && multiCount > 1 ? 'rgba(59, 130, 246, 0.04)' : 'transparent',
                                  borderRadius: '4px',
                                  transition: 'border-color 0.1s ease, background-color 0.1s ease',
                                }}
                              >
                                {/* Stripo Active Block Badge and Controls */}
                                {isSelected && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      position: 'absolute',
                                      top: '-28px',
                                      right: '0',
                                      backgroundColor: '#ffffff',
                                      border: multiCount > 1 ? '1px solid #93c5fd' : '1px solid #cbd5e1',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '2px 6px',
                                      gap: '6px',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                      zIndex: 40,
                                    }}
                                  >
                                    {/* Drag Handle to Reorder */}
                                    <div
                                      draggable
                                      onDragStart={(e) => {
                                        e.stopPropagation();
                                        e.dataTransfer.setData(
                                          'text/plain',
                                          JSON.stringify({ kind: 'move-block', blockId: block.id, sourceColId: col.id })
                                        );
                                        e.dataTransfer.effectAllowed = 'move';
                                      }}
                                      title="Drag to move block"
                                      style={{ cursor: 'grab', padding: '2px', color: '#64748b', display: 'flex', alignItems: 'center' }}
                                    >
                                      <DotsSixVertical size={14} />
                                    </div>

                                    <span
                                      style={{
                                        fontSize: '10px',
                                        color: multiCount > 1 ? '#2563eb' : '#16a34a',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {multiCount > 1 ? `Selected (${multiCount})` : block.type}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDuplicateBlock(block.id);
                                      }}
                                      title={multiCount > 1 ? `Duplicate ${multiCount} Blocks` : 'Duplicate Block'}
                                      style={{ padding: '2px', color: '#64748b' }}
                                    >
                                      <Copy size={13} />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteBlock(block.id);
                                      }}
                                      title={multiCount > 1 ? `Delete ${multiCount} Blocks` : 'Delete Block'}
                                      style={{ padding: '2px', color: '#ef4444' }}
                                    >
                                      <Trash size={13} />
                                    </button>
                                  </div>
                                )}

                                {/* Block Renderers */}
                                {block.type === 'text' && (
                                  <InlineTextEditor
                                    block={block}
                                    isSelected={isSelected}
                                    textColor={settings.textColor}
                                    fontFamily={settings.fontFamily}
                                    onContentChange={(html) => onUpdateBlockContent(block.id, html)}
                                    onSelect={() => {
                                      onSelectBlock(block.id);
                                      onSelectStripe(null);
                                    }}
                                  />
                                )}

                                {block.type === 'button' && (
                                  <div style={{ display: 'inline-block', position: 'relative' }}>
                                    {editingButtonId === block.id ? (
                                      <input
                                        type="text"
                                        autoFocus
                                        defaultValue={block.props.text || 'Action Button'}
                                        onBlur={(e) => {
                                          setEditingButtonId(null);
                                          if (onUpdateBlock) {
                                            onUpdateBlock(block.id, {
                                              props: { ...block.props, text: e.target.value },
                                            });
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                          }
                                        }}
                                        style={{
                                          backgroundColor: block.props.buttonColor || '#22c55e',
                                          color: block.props.textColor || '#ffffff',
                                          padding: '10px 24px',
                                          borderRadius: `${block.props.borderRadius ?? 6}px`,
                                          fontWeight: 600,
                                          fontSize: '15px',
                                          fontFamily: settings.fontFamily,
                                          border: '2px dashed #ffffff',
                                          outline: 'none',
                                          textAlign: 'center',
                                        }}
                                      />
                                    ) : (
                                      <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        onDoubleClick={(e) => {
                                          e.stopPropagation();
                                          setEditingButtonId(block.id);
                                        }}
                                        title="Double-click to edit button label"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          backgroundColor: block.props.buttonColor || '#22c55e',
                                          color: block.props.textColor || '#ffffff',
                                          padding: '12px 28px',
                                          borderRadius: `${block.props.borderRadius ?? 6}px`,
                                          textDecoration: 'none',
                                          fontWeight: 600,
                                          fontSize: '15px',
                                          fontFamily: settings.fontFamily,
                                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <span>{block.props.text || 'Action Button'}</span>
                                        {isSelected && (
                                          <PencilSimple
                                            size={12}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingButtonId(block.id);
                                            }}
                                          />
                                        )}
                                      </a>
                                    )}
                                  </div>
                                )}

                                {block.type === 'image' && (
                                  <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                                    <img
                                      src={block.props.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop'}
                                      alt={block.props.alt || 'Email image'}
                                      style={{
                                        width: block.props.imageWidth === 'full' ? '100%' : block.props.imageWidth ? `${block.props.imageWidth}px` : '100%',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        margin: block.align === 'center' ? '0 auto' : block.align === 'right' ? '0 0 0 auto' : '0',
                                        borderRadius: `${block.props.borderRadius ?? 4}px`,
                                      }}
                                    />
                                  </div>
                                )}

                                {block.type === 'spacer' && (
                                  <div
                                    style={{
                                      height: `${block.props.spacerHeight || 28}px`,
                                      backgroundColor: 'rgba(241, 245, 249, 0.7)',
                                      border: '1px dashed #cbd5e1',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '11px',
                                      fontWeight: 500,
                                      color: '#64748b',
                                    }}
                                  >
                                    Spacer ({block.props.spacerHeight || 28}px)
                                  </div>
                                )}

                                {block.type === 'divider' && (
                                  <hr
                                    style={{
                                      border: 'none',
                                      borderTop: `${block.props.dividerHeight || 1}px ${block.props.dividerStyle || 'solid'} ${block.props.dividerColor || '#e2e8f0'}`,
                                      margin: 0,
                                    }}
                                  />
                                )}

                                {block.type === 'social' && (
                                  <div style={{ display: 'flex', gap: `${block.props.iconSpacing || 12}px`, justifyContent: block.align }}>
                                    {(block.props.networks || [
                                      { id: '1', network: 'facebook' },
                                      { id: '2', network: 'twitter' },
                                      { id: '3', network: 'instagram' },
                                      { id: '4', network: 'linkedin' },
                                    ]).map((net: any, idx: number) => (
                                      <div
                                        key={idx}
                                        style={{
                                          width: `${block.props.iconSize || 28}px`,
                                          height: `${block.props.iconSize || 28}px`,
                                          borderRadius: '9999px',
                                          backgroundColor: '#2563eb',
                                          color: '#ffffff',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '11px',
                                          fontWeight: 'bold',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        {net.network[0]}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {block.type === 'video' && (
                                  <div
                                    style={{
                                      position: 'relative',
                                      maxWidth: '100%',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      backgroundColor: '#0f172a',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <img
                                      src={block.props.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop'}
                                      alt="Video cover"
                                      style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.85 }}
                                    />
                                    <div
                                      style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '48px',
                                          height: '48px',
                                          borderRadius: '9999px',
                                          backgroundColor: '#ef4444',
                                          color: '#ffffff',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                        }}
                                      >
                                        ▶
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {block.type === 'html' && (
                                  <div style={{ position: 'relative', width: '100%' }}>
                                    {/* Action Header for HTML Block: Quick Toggle between Preview and Live In-Canvas Code Editor */}
                                    {isSelected && (
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          backgroundColor: '#0f172a',
                                          color: '#ffffff',
                                          padding: '4px 10px',
                                          borderRadius: '6px 6px 0 0',
                                          fontSize: '11px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <Code size={13} color="#22c55e" weight="bold" />
                                          <span>HTML Block (Click to Edit Code)</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (editingHtmlBlockId === block.id) {
                                              if (onUpdateBlock) {
                                                onUpdateBlock(block.id, {
                                                  props: { ...block.props, customHtml: editingHtmlValue, htmlCode: editingHtmlValue },
                                                });
                                              }
                                              setEditingHtmlBlockId(null);
                                            } else {
                                              setEditingHtmlBlockId(block.id);
                                              setEditingHtmlValue(block.props.customHtml || block.props.htmlCode || '');
                                            }
                                          }}
                                          style={{
                                            backgroundColor: editingHtmlBlockId === block.id ? '#15803d' : '#334155',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '2px 8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '11px',
                                          }}
                                        >
                                          {editingHtmlBlockId === block.id ? (
                                            <>
                                              <Check size={12} weight="bold" />
                                              <span>Apply Changes</span>
                                            </>
                                          ) : (
                                            <>
                                              <PencilSimple size={12} />
                                              <span>Edit Code In Canvas</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    )}

                                    {editingHtmlBlockId === block.id ? (
                                      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', position: 'relative' }}>
                                        <textarea
                                          value={editingHtmlValue}
                                          onChange={(e) => setEditingHtmlValue(e.target.value)}
                                          onBlur={() => {
                                            if (onUpdateBlock) {
                                              onUpdateBlock(block.id, {
                                                props: { ...block.props, customHtml: editingHtmlValue, htmlCode: editingHtmlValue },
                                              });
                                            }
                                          }}
                                          rows={12}
                                          placeholder="<div>Paste or write custom HTML here...</div>"
                                          style={{
                                            width: '100%',
                                            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                            fontSize: '13px',
                                            lineHeight: 1.5,
                                            padding: '12px',
                                            backgroundColor: '#090d16',
                                            color: '#38bdf8',
                                            border: '2px solid #22c55e',
                                            borderRadius: isSelected ? '0 0 6px 6px' : '6px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            whiteSpace: 'pre-wrap',
                                          }}
                                        />
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: '8px',
                                            marginTop: '6px',
                                          }}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (onUpdateBlock) {
                                                onUpdateBlock(block.id, {
                                                  props: { ...block.props, customHtml: editingHtmlValue, htmlCode: editingHtmlValue },
                                                });
                                              }
                                              setEditingHtmlBlockId(null);
                                            }}
                                            style={{
                                              backgroundColor: '#22c55e',
                                              color: '#ffffff',
                                              fontWeight: 600,
                                              fontSize: '12px',
                                              border: 'none',
                                              borderRadius: '6px',
                                              padding: '6px 14px',
                                              cursor: 'pointer',
                                            }}
                                          >
                                            Done Editing (Preview)
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        onDoubleClick={(e) => {
                                          e.stopPropagation();
                                          setEditingHtmlBlockId(block.id);
                                          setEditingHtmlValue(block.props.customHtml || block.props.htmlCode || '');
                                        }}
                                        title="Double-click to edit HTML code directly on canvas"
                                        style={{
                                          width: '100%',
                                          cursor: 'pointer',
                                          minHeight: '24px',
                                        }}
                                        dangerouslySetInnerHTML={{
                                          __html: block.props.customHtml || block.props.htmlCode || '<div style="padding:16px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:6px;text-align:center;color:#64748b;font-size:13px;">Double-click to write or paste HTML</div>',
                                        }}
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Shape & Decorative Lines Block */}
                                {block.type === 'shape' && (
                                  <div
                                    style={{
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: block.align,
                                    }}
                                  >
                                    {block.props.shapeType === 'circle' ? (
                                      <div
                                        style={{
                                          width: `${Math.min(block.props.shapeHeight || 64, 120)}px`,
                                          height: `${Math.min(block.props.shapeHeight || 64, 120)}px`,
                                          borderRadius: '50%',
                                          backgroundColor: block.props.fillColor || '#f0fdf4',
                                          border: `${block.props.strokeWidth ?? 2}px ${block.props.strokeStyle || 'solid'} ${block.props.strokeColor || '#22c55e'}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: block.props.shapeTextColor || '#15803d',
                                          fontSize: '13px',
                                          fontWeight: 700,
                                        }}
                                      >
                                        {block.props.shapeText || ''}
                                      </div>
                                    ) : block.props.shapeType === 'pill' ? (
                                      <div
                                        style={{
                                          width: block.props.shapeWidth === 'full' ? '100%' : typeof block.props.shapeWidth === 'number' ? `${block.props.shapeWidth}px` : 'auto',
                                          padding: '10px 24px',
                                          borderRadius: '9999px',
                                          backgroundColor: block.props.fillColor || '#eff6ff',
                                          border: `${block.props.strokeWidth ?? 2}px ${block.props.strokeStyle || 'solid'} ${block.props.strokeColor || '#3b82f6'}`,
                                          color: block.props.shapeTextColor || '#1d4ed8',
                                          fontSize: '13px',
                                          fontWeight: 700,
                                          letterSpacing: '0.5px',
                                          textAlign: 'center',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        {block.props.shapeText || 'Pill Highlight Badge'}
                                      </div>
                                    ) : block.props.shapeType === 'accent-bar' ? (
                                      <div
                                        style={{
                                          width: block.props.shapeWidth === 'full' ? '100%' : typeof block.props.shapeWidth === 'number' ? `${block.props.shapeWidth}px` : '100%',
                                          height: `${block.props.shapeHeight || 6}px`,
                                          borderRadius: `${block.props.borderRadius ?? 3}px`,
                                          backgroundColor: block.props.fillColor || '#22c55e',
                                          border: block.props.strokeWidth ? `${block.props.strokeWidth}px ${block.props.strokeStyle || 'solid'} ${block.props.strokeColor || '#15803d'}` : 'none',
                                        }}
                                      />
                                    ) : block.props.shapeType === 'line-ornament' ? (
                                      <div
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                        }}
                                      >
                                        <div style={{ flex: 1, height: `${block.props.strokeWidth ?? 1}px`, backgroundColor: block.props.strokeColor || '#cbd5e1' }} />
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: block.props.shapeTextColor || '#64748b', whiteSpace: 'nowrap' }}>
                                          {block.props.shapeText || '✦ ✦ ✦'}
                                        </span>
                                        <div style={{ flex: 1, height: `${block.props.strokeWidth ?? 1}px`, backgroundColor: block.props.strokeColor || '#cbd5e1' }} />
                                      </div>
                                    ) : (
                                      // Rectangle / Badge default
                                      <div
                                        style={{
                                          width: block.props.shapeWidth === 'full' ? '100%' : typeof block.props.shapeWidth === 'number' ? `${block.props.shapeWidth}px` : '100%',
                                          padding: '14px 20px',
                                          borderRadius: `${block.props.borderRadius ?? 8}px`,
                                          backgroundColor: block.props.fillColor || '#f0fdf4',
                                          border: `${block.props.strokeWidth ?? 2}px ${block.props.strokeStyle || 'solid'} ${block.props.strokeColor || '#22c55e'}`,
                                          color: block.props.shapeTextColor || '#15803d',
                                          fontSize: '14px',
                                          fontWeight: 700,
                                          letterSpacing: '0.5px',
                                          textAlign: 'center',
                                        }}
                                      >
                                        {block.props.shapeText || '🔥 SPECIAL ANNOUNCEMENT'}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {block.type === 'menu' && (
                                  <div style={{ display: 'flex', gap: '16px', justifyContent: block.align }}>
                                    {(block.props.menuItems || [
                                      { id: '1', label: 'Home' },
                                      { id: '2', label: 'Shop' },
                                      { id: '3', label: 'Blog' },
                                    ]).map((item: any, i: number) => (
                                      <span
                                        key={i}
                                        style={{
                                          fontSize: '13px',
                                          fontWeight: 600,
                                          color: '#475569',
                                        }}
                                      >
                                        {item.label}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {block.type === 'timer' && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '12px',
                                      justifyContent: block.align,
                                      padding: '8px 0',
                                    }}
                                  >
                                    {[
                                      { label: 'DAYS', val: block.props.days || '03' },
                                      { label: 'HOURS', val: block.props.hours || '14' },
                                      { label: 'MINS', val: block.props.minutes || '28' },
                                      { label: 'SECS', val: block.props.seconds || '45' },
                                    ].map((unit, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          backgroundColor: '#1e293b',
                                          color: '#ffffff',
                                          padding: '8px 12px',
                                          borderRadius: '6px',
                                          textAlign: 'center',
                                          minWidth: '52px',
                                        }}
                                      >
                                        <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>
                                          {unit.val}
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px', letterSpacing: '0.5px' }}>
                                          {unit.label}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}

                        {/* Stripo Drop Insertion Indicator (Bottom of Column) */}
                        {dropTarget?.colId === col.id && dropTarget?.index === col.blocks.length && col.blocks.length > 0 && (
                          <div
                            style={{
                              height: '4px',
                              backgroundColor: '#22c55e',
                              borderRadius: '2px',
                              margin: '2px 0',
                              boxShadow: '0 0 10px rgba(34, 197, 94, 0.7)',
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}

              {/* Drop Zone At Bottom of Stripe */}
              {stripe.structures.length > 0 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setStructureDropTarget({ stripeId: stripe.id, index: stripe.structures.length });
                  }}
                  onDragLeave={(e) => {
                    e.stopPropagation();
                    if (structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === stripe.structures.length) {
                      setStructureDropTarget(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setStructureDropTarget(null);
                    const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
                    if (raw) {
                      try {
                        const data = JSON.parse(raw);
                        if (data.kind === 'structure') {
                          onDropStructure(stripe.id, data.cols, stripe.structures.length);
                        }
                      } catch {}
                    }
                  }}
                  style={{
                    height: structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === stripe.structures.length ? '16px' : '4px',
                    backgroundColor: structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === stripe.structures.length ? '#22c55e' : 'transparent',
                    borderRadius: '4px',
                    margin: '4px 0',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {structureDropTarget?.stripeId === stripe.id && structureDropTarget?.index === stripe.structures.length && (
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#ffffff',
                        fontWeight: 700,
                        backgroundColor: '#15803d',
                        padding: '1px 8px',
                        borderRadius: '9999px',
                      }}
                    >
                      Insert Structure at End
                    </span>
                  )}
                </div>
              )}
            </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
