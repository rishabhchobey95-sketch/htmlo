import React, { useState } from 'react';
import {
  ArrowLeft,
  Sun,
  Moon,
  DownloadSimple,
  ShareNetwork,
  EnvelopeSimple,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';

interface PreviewModalProps {
  htmlContent: string;
  templateName: string;
  subjectLine?: string;
  onClose: () => void;
  onExport: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  htmlContent,
  templateName: _templateName,
  subjectLine = 'Welcome to htmlo Mail Studio',
  onClose,
  onExport,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [selectedMobileDevice, setSelectedMobileDevice] = useState('iPhone SE (2, 3 Gen), 8, 7, 6S, 6');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#f1f5f9',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Stripo Top Bar for Preview Emulation Mode */}
      <header
        style={{
          height: '52px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            className="stripo-pill-btn"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 500,
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Center: Controls (Test, Dark mode toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => alert('Test email simulated: sent to your testing inbox!')}
            className="stripo-pill-btn"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <EnvelopeSimple size={16} />
            Test
          </button>

          {/* Light / Dark Mode Toggle Pill */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setIsDark(false)}
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                backgroundColor: !isDark ? '#22c55e' : 'transparent',
                color: !isDark ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Sun size={15} weight={!isDark ? 'bold' : 'regular'} />
            </button>
            <button
              onClick={() => setIsDark(true)}
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                backgroundColor: isDark ? '#1e293b' : 'transparent',
                color: isDark ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Moon size={15} weight={isDark ? 'bold' : 'regular'} />
            </button>
          </div>
        </div>

        {/* Right: Export & Share CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#22c55e',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
          >
            <DownloadSimple size={16} weight="bold" />
            Export
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Preview link copied to clipboard!');
            }}
            className="stripo-pill-btn"
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <ShareNetwork size={16} />
            Share
          </button>
        </div>
      </header>

      {/* Main Dual Viewport Canvas (Desktop on Left, Mobile on Right) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: isDark ? '#0b0f19' : '#f1f5f9',
          padding: '16px 24px',
          gap: '24px',
        }}
      >
        {/* LEFT COLUMN: Desktop Viewport */}
        <div
          style={{
            flex: '1 1 58%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top Label & Workspace Info Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#d97706',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Preview Emulation Mode
            </span>
          </div>

          {/* Desktop Frame Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Subject line header bar */}
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '13px',
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>htmlo Studio Workspace</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{subjectLine}</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#64748b',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '3px 8px',
                }}
              >
                <span>~48 KB</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: '#22c55e' }} />
              </div>
            </div>

            {/* Scrollable Desktop iframe */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <iframe
                title="Desktop Email Simulation"
                srcDoc={htmlContent}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '1200px',
                  border: 'none',
                  display: 'block',
                  filter: isDark ? 'invert(0.9) hue-rotate(180deg)' : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Mobile Viewport */}
        <div
          style={{
            flex: '0 0 380px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top Device Dropdown Selector (Stripo Exact Look) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <select
              value={selectedMobileDevice}
              onChange={(e) => setSelectedMobileDevice(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <option value="iPhone SE (2, 3 Gen), 8, 7, 6S, 6">iPhone SE (2, 3 Gen), 8, 7, 6S, 6</option>
              <option value="iPhone 15 / 14 / 13 Pro">iPhone 15 / 14 / 13 Pro</option>
              <option value="Google Pixel 8 / 7">Google Pixel 8 / 7</option>
              <option value="Samsung Galaxy S24">Samsung Galaxy S24</option>
            </select>
          </div>

          {/* iPhone Frame Container */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: '36px',
              border: '10px solid #ffffff',
              boxShadow: '0 12px 36px rgba(0,0,0,0.12), 0 0 0 1px #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Mobile Top Bar (Inbox back, up/down arrows) */}
            <div
              style={{
                height: '42px',
                borderBottom: '1px solid #f1f5f9',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '13px', fontWeight: 500 }}>
                <CaretLeft size={16} />
                <span>Inbox</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <CaretLeft size={14} style={{ transform: 'rotate(90deg)' }} />
                <CaretRight size={14} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>

            {/* Scrollable Mobile iframe (iPhone viewport width 360px) */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
              <iframe
                title="Mobile Email Simulation"
                srcDoc={htmlContent}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '1200px',
                  border: 'none',
                  display: 'block',
                  filter: isDark ? 'invert(0.9) hue-rotate(180deg)' : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
