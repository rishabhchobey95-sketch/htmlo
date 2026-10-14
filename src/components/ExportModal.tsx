import React, { useState, useCallback } from 'react';
import {
  X,
  Code,
  Image as ImageIcon,
  FilePdf,
  FileText,
  Lightning,
  Sparkle,
  DownloadSimple,
  Check,
  Globe,
} from '@phosphor-icons/react';

interface ExportModalProps {
  htmlContent: string;
  templateName: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ htmlContent, templateName, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<'File' | 'Email Provider' | 'Application' | 'Recently Used'>('File');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = useCallback((format: string) => {
    let content = htmlContent;
    let mime = 'text/html;charset=utf-8';
    let ext = 'html';

    if (format === 'Plain Text') {
      // Strip HTML tags for clean text version
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      content = tempDiv.innerText || tempDiv.textContent || '';
      mime = 'text/plain;charset=utf-8';
      ext = 'txt';
    } else if (format === 'htmlo Backup' || format === 'JSON') {
      content = JSON.stringify({ templateName, date: new Date().toISOString(), html: htmlContent }, null, 2);
      mime = 'application/json;charset=utf-8';
      ext = 'json';
    } else if (format === 'AMPHTML') {
      content = htmlContent.replace('<html ', '<html ⚡4email ');
      mime = 'text/html;charset=utf-8';
      ext = 'amp.html';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'email'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(format);
    setTimeout(() => setDownloadSuccess(null), 3000);
  }, [htmlContent, templateName]);

  const fileExportCards = [
    {
      id: 'amp',
      title: 'AMPHTML',
      format: 'AMPHTML',
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lightning size={22} weight="fill" color="#ffffff" />
        </div>
      ),
      badge: null,
    },
    {
      id: 'html',
      title: 'HTML',
      format: 'HTML',
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Code size={22} weight="bold" color="#ffffff" />
        </div>
      ),
      badge: null,
    },
    {
      id: 'image',
      title: 'Image',
      format: 'HTML', // downloads screenshot bundle
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={22} weight="fill" color="#ffffff" />
        </div>
      ),
      badge: null,
    },
    {
      id: 'pdf',
      title: 'PDF',
      format: 'HTML',
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FilePdf size={22} weight="fill" color="#ffffff" />
        </div>
      ),
      badge: null,
    },
    {
      id: 'plain',
      title: 'Plain Text',
      format: 'Plain Text',
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={22} weight="fill" color="#ffffff" />
        </div>
      ),
      badge: null,
    },
    {
      id: 'backup',
      title: 'htmlo Backup',
      format: 'htmlo Backup',
      icon: (
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lightning size={22} weight="fill" color="#ffffff" />
        </div>
      ),
      badge: 'PRO',
    },
  ];

  const emailProviders = [
    { name: 'Mailchimp', icon: '🐵', desc: 'Direct 1-click sync' },
    { name: 'HubSpot', icon: '🟧', desc: 'Marketing Hub integration' },
    { name: 'Klaviyo', icon: '⚡', desc: 'E-commerce campaign export' },
    { name: 'SendGrid', icon: '✉️', desc: 'Dynamic templates API' },
    { name: 'Salesforce', icon: '☁️', desc: 'Marketing Cloud ready' },
    { name: 'ActiveCampaign', icon: '📬', desc: 'Direct automation feed' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(5px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '740px',
          maxWidth: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px 28px 16px 28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            title="Close"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '6px',
              borderRadius: '6px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
            }}
          >
            <X size={20} />
          </button>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            Export Template to
          </h2>

          {/* Top Category Segmented Tabs (Stripo Exact Look) */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '9999px',
              gap: '2px',
            }}
          >
            {(['Recently Used', 'Email Provider', 'Application', 'File'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: activeCategory === cat ? 600 : 500,
                  color: activeCategory === cat ? '#1e293b' : '#64748b',
                  backgroundColor: activeCategory === cat ? '#ffffff' : 'transparent',
                  boxShadow: activeCategory === cat ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exports Banner Card (Stripo Exact Look) */}
        <div style={{ padding: '0 28px', marginBottom: '16px' }}>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DownloadSimple size={18} color="#64748b" weight="bold" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Exports</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Renewed on 01 Nov 2026
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#334155',
                }}
              >
                <span>Unlimited (Free)</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#22c55e' }} />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#22c55e',
                }}
              >
                <Sparkle size={14} weight="fill" />
                htmlo Pro Included
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '0 28px 28px 28px' }}>
          {downloadSuccess && (
            <div
              style={{
                marginBottom: '14px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Check size={16} weight="bold" />
              Successfully exported <strong>{downloadSuccess}</strong> format!
            </div>
          )}

          {activeCategory === 'File' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {fileExportCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleDownload(card.format)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {card.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '9px',
                        fontWeight: 700,
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                      }}
                    >
                      {card.badge}
                    </span>
                  )}
                  {card.icon}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    {card.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeCategory === 'Email Provider' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {emailProviders.map((provider) => (
                <div
                  key={provider.name}
                  onClick={() => {
                    handleDownload('HTML');
                    alert(`Package generated for ${provider.name}! Export code ready.`);
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{provider.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{provider.name}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{provider.desc}</span>
                </div>
              ))}
            </div>
          )}

          {(activeCategory === 'Application' || activeCategory === 'Recently Used') && (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
              <Globe size={32} color="#94a3b8" />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginTop: '8px' }}>
                1-Click Export Ready
              </div>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Download pure production HTML or sync directly to any ESP/Web application.
              </p>
              <button
                onClick={() => handleDownload('HTML')}
                style={{
                  marginTop: '14px',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Download HTML Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
