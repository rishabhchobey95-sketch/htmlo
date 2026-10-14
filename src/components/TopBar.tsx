import React from 'react';
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  Code,
  Eye,
  DeviceMobile,
  Desktop,
  DownloadSimple,
  Copy,
  FloppyDisk,
  Lightning,
  SquaresFour,
  ClockCounterClockwise,
  CaretLeft,
  MagicWand,
  ShieldCheck,
  MagnifyingGlass,
  Sun,
  Moon,
  Sparkle,
} from '@phosphor-icons/react';
import { ViewMode } from '../types/editor';
import { DockLayoutState } from '../types/dock';
import { DockLayoutManager } from './DockLayoutManager';

interface TopBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isCodeOpen?: boolean;
  onToggleCode?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExportHtml: () => void;
  onCopyHtml: () => void;
  onSave: () => void;
  onOpenPreview: () => void;
  onBackToDashboard?: () => void;
  onOpenAiAssistant?: () => void;
  onTriggerAiSwarm?: () => void;
  onOpenAudit?: () => void;
  onOpenCommandPalette?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  dockLayout?: DockLayoutState;
  onUpdateDockLayout?: (updater: (prev: DockLayoutState) => DockLayoutState) => void;
  onResetDockLayout?: () => void;
  onSwapSideDocks?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  setViewMode,
  isCodeOpen = false,
  onToggleCode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExportHtml,
  onCopyHtml,
  onSave,
  onOpenPreview,
  onBackToDashboard,
  onOpenAiAssistant,
  onTriggerAiSwarm,
  onOpenAudit,
  onOpenCommandPalette,
  isDarkMode = false,
  onToggleDarkMode,
  dockLayout,
  onUpdateDockLayout,
  onResetDockLayout,
  onSwapSideDocks,
}) => {
  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--stripo-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
      }}
    >
      {/* Left: Brand Icon + Choose Template */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Back to Dashboard Chevron */}
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            title="Back to Templates Dashboard"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
          >
            <CaretLeft size={16} weight="bold" />
          </button>
        )}

        {/* Stripo-style stylized brand */}
        <div
          onClick={onBackToDashboard}
          title="Go to Templates Dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            <Lightning size={18} weight="fill" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.5px' }}>
            htmlo
          </span>
        </div>

        <button
          onClick={onBackToDashboard}
          className="stripo-pill-btn"
          title="Choose a different template"
          style={{
            marginLeft: '6px',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#334155',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <SquaresFour size={15} />
          Choose Template
        </button>

        {/* Undo, History, Redo Pill Group */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '2px',
            marginLeft: '12px',
          }}
        >
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            style={{
              padding: '6px 10px',
              borderRadius: '9999px',
              color: canUndo ? '#334155' : '#cbd5e1',
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
          >
            <ArrowCounterClockwise size={15} />
          </button>
          <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }} />
          <button
            title="Version History"
            style={{
              padding: '6px 10px',
              borderRadius: '9999px',
              color: '#64748b',
            }}
          >
            <ClockCounterClockwise size={15} />
          </button>
          <div style={{ width: '1px', height: '14px', backgroundColor: '#e2e8f0' }} />
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            style={{
              padding: '6px 10px',
              borderRadius: '9999px',
              color: canRedo ? '#334155' : '#cbd5e1',
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
          >
            <ArrowClockwise size={15} />
          </button>
        </div>

        {/* AI Assistant & Swarm Triggers */}
        {onOpenAiAssistant && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onOpenAiAssistant}
              className="stripo-pill-btn"
              title="Create email messages with AI Assistant"
              style={{
                backgroundColor: '#f5f3ff',
                borderColor: '#ddd6fe',
                color: '#7c3aed',
                fontWeight: 600,
                gap: '6px',
              }}
            >
              <MagicWand size={15} weight="fill" />
              <span>AI Assistant</span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                beta
              </span>
            </button>

            {onTriggerAiSwarm && (
              <button
                onClick={onTriggerAiSwarm}
                className="stripo-pill-btn"
                title="Immediately activate multi-agent AI Cursors Swarm"
                style={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  color: '#38bdf8',
                  fontWeight: 600,
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
                }}
              >
                <Sparkle size={14} color="#38bdf8" weight="fill" />
                <span>Summon Swarm</span>
              </button>
            )}
          </div>
        )}

        {/* Code Toggle & Preview */}
        <button
          onClick={onToggleCode || (() => setViewMode(viewMode === 'code' ? 'desktop' : 'code'))}
          className="stripo-pill-btn"
          title="Toggle Code View"
          style={{
            backgroundColor: isCodeOpen ? '#dcfce7' : '#ffffff',
            borderColor: isCodeOpen ? '#22c55e' : '#e2e8f0',
            color: isCodeOpen ? '#15803d' : '#334155',
            fontWeight: isCodeOpen ? 600 : 500,
          }}
        >
          <Code size={15} weight={isCodeOpen ? 'bold' : 'regular'} />
          Code
        </button>

        <button
          onClick={onOpenPreview}
          className="stripo-pill-btn"
        >
          <Eye size={15} />
          Preview
        </button>

        {/* Deliverability & MSO Preflight Auditor */}
        {onOpenAudit && (
          <button
            onClick={onOpenAudit}
            className="stripo-pill-btn"
            title="Open Deliverability & MSO Preflight Auditor"
            style={{
              backgroundColor: '#ecfeff',
              borderColor: '#a5f3fc',
              color: '#0891b2',
              fontWeight: 600,
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} weight="fill" color="#0891b2" />
            <span>Preflight Audit</span>
          </button>
        )}

        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="stripo-pill-btn"
            title="Open Command Palette (Cmd+K / Ctrl+K)"
            style={{
              gap: '6px',
              color: '#475569',
              fontSize: '12px',
            }}
          >
            <MagnifyingGlass size={14} />
            <span className="hidden md:inline">Commands</span>
            <kbd
              style={{
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                fontFamily: 'monospace',
              }}
            >
              ⌘K
            </kbd>
          </button>
        )}

        {/* Client Dark Mode Inversion Toggle */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="stripo-pill-btn"
            title={isDarkMode ? 'Switch to Standard Canvas' : 'Simulate Client Dark Mode Inversion'}
            style={{
              padding: '6px 10px',
              color: isDarkMode ? '#818cf8' : '#64748b',
              backgroundColor: isDarkMode ? '#1e1e24' : '#ffffff',
            }}
          >
            {isDarkMode ? <Sun size={15} weight="bold" color="#fbbf24" /> : <Moon size={15} />}
          </button>
        )}
      </div>

      {/* Right: Responsive Switcher + Dock Manager + Save CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Docking & Windows Layout Manager */}
        {dockLayout && onUpdateDockLayout && onResetDockLayout && onSwapSideDocks && (
          <DockLayoutManager
            layout={dockLayout}
            onUpdateLayout={onUpdateDockLayout}
            onResetLayout={onResetDockLayout}
            onSwapSideDocks={onSwapSideDocks}
          />
        )}
        {/* Desktop / Mobile Device Pill Switcher (Exact Stripo style) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={() => setViewMode('desktop')}
            title="Desktop View"
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              color: viewMode === 'desktop' ? '#1e293b' : '#64748b',
              backgroundColor: viewMode === 'desktop' ? '#ffffff' : 'transparent',
              boxShadow: viewMode === 'desktop' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              border: viewMode === 'desktop' ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Desktop size={17} weight={viewMode === 'desktop' ? 'bold' : 'regular'} />
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            title="Mobile View"
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              color: viewMode === 'mobile' ? '#1e293b' : '#64748b',
              backgroundColor: viewMode === 'mobile' ? '#ffffff' : 'transparent',
              boxShadow: viewMode === 'mobile' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              border: viewMode === 'mobile' ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <DeviceMobile size={17} weight={viewMode === 'mobile' ? 'bold' : 'regular'} />
          </button>
        </div>

        <button
          onClick={onCopyHtml}
          className="stripo-pill-btn"
          title="Copy HTML to clipboard"
        >
          <Copy size={15} />
          Copy
        </button>

        <button
          onClick={onExportHtml}
          className="stripo-pill-btn"
          title="Download HTML file"
        >
          <DownloadSimple size={15} />
          Export
        </button>

        {/* Stripo Signature Green Save Button */}
        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#22c55e',
            boxShadow: '0 1px 3px rgba(34, 197, 94, 0.3)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
        >
          <FloppyDisk size={16} weight="bold" />
          Save Email
        </button>
      </div>
    </header>
  );
};
