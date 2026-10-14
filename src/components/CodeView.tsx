import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  X,
  Gear,
  MagicWand,
  ArrowsOutLineVertical,
  ArrowsInLineVertical,
  DotsSixVertical,
  FloppyDisk,
  ArrowsLeftRight,
  ArrowSquareOut,
} from '@phosphor-icons/react';
import { EmailCompiler } from '../compiler/EmailCompiler';
import { CodeDockPosition } from '../types/dock';

interface CodeViewProps {
  htmlContent: string;
  onApplyHtml: (newHtml: string) => void;
  onClose?: () => void;
  customCss?: string;
  onUpdateCustomCss?: (css: string) => void;
  dockPosition?: CodeDockPosition;
  onShiftDock?: (target: CodeDockPosition) => void;
  onFloat?: () => void;
  height?: number;
  width?: number;
}

export const CodeView: React.FC<CodeViewProps> = ({
  htmlContent,
  onApplyHtml,
  onClose,
  customCss = '',
  onUpdateCustomCss,
  dockPosition = 'bottom',
  onShiftDock,
  onFloat,
  height: _height,
  width: _width,
}) => {
  const [code, setCode] = useState(htmlContent);
  const [prevHtml, setPrevHtml] = useState(htmlContent);
  if (prevHtml !== htmlContent) {
    setPrevHtml(htmlContent);
    setCode(htmlContent);
  }
  const [cssCode, setCssCode] = useState(customCss);
  const [activeTab, setActiveTab] = useState<'html' | 'default-css' | 'custom-css'>('html');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const drawerHeight = 280;
  const [isMaximized, setIsMaximized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    const textToCopy = activeTab === 'html' ? code : activeTab === 'custom-css' ? cssCode : DEFAULT_CSS;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (activeTab === 'html') {
      const formatted = EmailCompiler.formatHtml(code);
      setCode(formatted);
      onApplyHtml(formatted);
    }
  };

  const handleApply = () => {
    if (activeTab === 'html') {
      onApplyHtml(code);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    } else if (activeTab === 'custom-css' && onUpdateCustomCss) {
      onUpdateCustomCss(cssCode);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  // Support Tab key indentation in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;

      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      if (activeTab === 'html') {
        setCode(newVal);
      } else {
        setCssCode(newVal);
      }

      // Restore caret position
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  const activeContent = activeTab === 'html' ? code : activeTab === 'custom-css' ? cssCode : DEFAULT_CSS;
  const lineCount = Math.max(1, activeContent.split('\n').length);

  return (
    <div
      style={{
        width: '100%',
        height: isMaximized ? 'calc(100vh - var(--topbar-height))' : `${drawerHeight}px`,
        backgroundColor: '#1e1e1e',
        borderTop: '1px solid #333333',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 45,
        boxShadow: '0 -4px 18px rgba(0,0,0,0.2)',
        position: 'relative',
        transition: 'height 0.15s ease',
      }}
    >
      {/* Stripo-Exact Code Editor Header Bar (IMG 2) */}
      <div
        style={{
          height: '38px',
          backgroundColor: '#2d3037',
          borderBottom: '1px solid #202226',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          color: '#cccccc',
          fontSize: '12px',
          userSelect: 'none',
        }}
      >
        {/* Left Action Controls (Format, Settings, Maximize, Shift, Float) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restore Split View' : 'Maximize Code View'}
            style={{ color: '#94a3b8', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
          >
            {isMaximized ? <ArrowsInLineVertical size={14} /> : <ArrowsOutLineVertical size={14} />}
          </button>

          {onShiftDock && (
            <button
              onClick={() => onShiftDock(dockPosition === 'bottom' ? 'right' : 'bottom')}
              title={dockPosition === 'bottom' ? 'Shift to Right Side Split' : 'Shift to Bottom Split'}
              style={{
                color: '#94a3b8',
                padding: '4px 6px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <ArrowsLeftRight size={13} color="#22c55e" />
              <span>{dockPosition === 'bottom' ? 'Side Split' : 'Bottom Split'}</span>
            </button>
          )}

          {onFloat && (
            <button
              onClick={onFloat}
              title="Float / Detach Code Window"
              style={{
                color: '#94a3b8',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <ArrowSquareOut size={14} />
            </button>
          )}

          <button
            onClick={handleFormat}
            title="Auto-format HTML indentation"
            style={{ color: '#94a3b8', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <MagicWand size={14} />
            <span style={{ fontSize: '11px' }}>Format</span>
          </button>

          <button
            title="Editor Settings"
            style={{ color: '#94a3b8', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center' }}
          >
            <Gear size={14} />
          </button>
        </div>

        {/* Center Title: ::: Code Editor */}
        <div
          title="Code Editor Panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#cbd5e1',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'row-resize',
            padding: '4px 16px',
            borderRadius: '4px',
          }}
        >
          <DotsSixVertical size={14} color="#94a3b8" />
          <span>::: Code Editor</span>
        </div>

        {/* Right Tab Switcher & Actions (Default CSS / Custom CSS / Apply / Copy / Close) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', backgroundColor: '#1e2025', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setActiveTab('html')}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: activeTab === 'html' ? '#ffffff' : '#858585',
                backgroundColor: activeTab === 'html' ? '#3b4048' : 'transparent',
              }}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('default-css')}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: activeTab === 'default-css' ? '#ffffff' : '#858585',
                backgroundColor: activeTab === 'default-css' ? '#3b4048' : 'transparent',
              }}
            >
              Default CSS
            </button>
            <button
              onClick={() => setActiveTab('custom-css')}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: activeTab === 'custom-css' ? '#ffffff' : '#858585',
                backgroundColor: activeTab === 'custom-css' ? '#3b4048' : 'transparent',
              }}
            >
              Custom CSS
            </button>
          </div>

          {/* Apply Changes to Canvas Button */}
          <button
            onClick={handleApply}
            title="Apply edited/pasted HTML to the email canvas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: applied ? '#16a34a' : '#22c55e',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {applied ? <Check size={13} weight="bold" /> : <FloppyDisk size={13} />}
            <span>{applied ? 'Applied!' : 'Apply to Canvas'}</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            title="Copy Code to Clipboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              color: copied ? '#4ade80' : '#cccccc',
              backgroundColor: '#3b4048',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Close Editor */}
          {onClose && (
            <button
              onClick={onClose}
              title="Close Code Editor"
              style={{
                padding: '4px',
                color: '#94a3b8',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body: VS Code Theme with dynamic line numbers and editable code */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', backgroundColor: '#181a1f' }}>
        {/* Left Dynamic Line Numbers Gutter */}
        <div
          style={{
            width: '46px',
            backgroundColor: '#181a1f',
            borderRight: '1px solid #2b2d35',
            padding: '12px 6px',
            textAlign: 'right',
            color: '#5c6370',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.6',
            userSelect: 'none',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: Math.min(lineCount, 500) }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Fully Editable Code Area (Copy, Paste, Type, Delete) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {activeTab === 'html' ? (
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="Paste or write your HTML email code here..."
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#181a1f',
                color: '#abb2bf',
                fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace",
                fontSize: '12.5px',
                lineHeight: '1.6',
                border: 'none',
                padding: '12px 16px',
                resize: 'none',
                outline: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflow: 'auto',
                caretColor: '#22c55e',
              }}
            />
          ) : activeTab === 'custom-css' ? (
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="/* Add custom responsive email CSS here */&#10;@media only screen and (max-width: 600px) {&#10;  .custom-class { font-size: 14px !important; }&#10;}"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#181a1f',
                color: '#e5c07b',
                fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace",
                fontSize: '12.5px',
                lineHeight: '1.6',
                border: 'none',
                padding: '12px 16px',
                resize: 'none',
                outline: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflow: 'auto',
                caretColor: '#22c55e',
              }}
            />
          ) : (
            <textarea
              readOnly
              value={DEFAULT_CSS}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#181a1f',
                color: '#98c379',
                fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace",
                fontSize: '12.5px',
                lineHeight: '1.6',
                border: 'none',
                padding: '12px 16px',
                resize: 'none',
                outline: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflow: 'auto',
                opacity: 0.9,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DEFAULT_CSS = `/* Standard Outlook & Cross-Client Reset Rules */
body, table, td, a {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
table, td {
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
  border-collapse: collapse !important;
}
img {
  -ms-interpolation-mode: bicubic;
  border: 0;
  height: auto;
  line-height: 100%;
  outline: none;
  text-decoration: none;
}

/* Mobile Responsive Media Queries */
@media only screen and (max-width: 600px) {
  .htmlo-wrapper { width: 100% !important; }
  .htmlo-content { width: 100% !important; max-width: 100% !important; }
  .htmlo-column { display: block !important; width: 100% !important; }
  .htmlo-fluid-img { width: 100% !important; max-width: 100% !important; }
  .htmlo-hide-mobile { display: none !important; }
}`;
