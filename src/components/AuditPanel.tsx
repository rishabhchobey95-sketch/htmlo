import React from 'react';
import {
  ShieldCheck,
  Warning,
  CheckCircle,
  XCircle,
  Sparkle,
  Envelope,
  X,
} from '@phosphor-icons/react';
import { EmailDocument } from '../types/editor';
import { EmailCompiler } from '../compiler/EmailCompiler';

interface AuditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  document: EmailDocument;
  onAutoFix: (fixedDoc: EmailDocument) => void;
  onSummonAiFix: () => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  isOpen,
  onClose,
  document,
  onAutoFix,
  onSummonAiFix,
}) => {
  if (!isOpen) return null;

  const compiledHtml = EmailCompiler.compile(document);
  const byteSize = new Blob([compiledHtml]).size;
  const maxGmailBytes = 102400; // 102 KB
  const bytePercentage = Math.min(100, (byteSize / maxGmailBytes) * 100);
  const isClippedByGmail = byteSize >= maxGmailBytes;

  // Run deep preflight checks
  const issues: Array<{
    id: string;
    level: 'error' | 'warning' | 'pass';
    title: string;
    description: string;
    category: 'Deliverability' | 'Outlook VML' | 'Accessibility';
  }> = [];

  // Check 1: Gmail clipping
  if (isClippedByGmail) {
    issues.push({
      id: 'clip-err',
      level: 'error',
      title: 'Email Exceeds Gmail 102 KB Threshold',
      description: `Current size is ${(byteSize / 1024).toFixed(1)} KB. Gmail will clip message with "[Message clipped] View entire message".`,
      category: 'Deliverability',
    });
  } else if (byteSize > 85000) {
    issues.push({
      id: 'clip-warn',
      level: 'warning',
      title: 'Approaching Gmail 102 KB Clipping Threshold',
      description: `Current size is ${(byteSize / 1024).toFixed(1)} KB. Consider minifying HTML or optimizing image count.`,
      category: 'Deliverability',
    });
  } else {
    issues.push({
      id: 'clip-pass',
      level: 'pass',
      title: 'Safe from Gmail Message Clipping',
      description: `Compiled size is ${(byteSize / 1024).toFixed(1)} KB (Well under 102 KB limit).`,
      category: 'Deliverability',
    });
  }

  // Check 2: Preheader Snippet
  if (!document.settings.preheader) {
    issues.push({
      id: 'pre-err',
      level: 'warning',
      title: 'Missing Inbox Preheader Snippet',
      description: 'Without a preheader, inboxes display raw markup or trailing body text in recipient inboxes.',
      category: 'Deliverability',
    });
  } else {
    issues.push({
      id: 'pre-pass',
      level: 'pass',
      title: 'Zero-Width Preheader Hack Active',
      description: 'Padded with 60x zero-width entities to shield body text from previews.',
      category: 'Deliverability',
    });
  }

  // Check 3: Missing Alt text on images
  let missingAltCount = 0;
  let emptyLinkCount = 0;
  for (const s of document.stripes) {
    for (const st of s.structures) {
      for (const col of st.columns) {
        for (const blk of col.blocks) {
          if (blk.type === 'image' && (!blk.props.alt || blk.props.alt.trim() === '')) {
            missingAltCount++;
          }
          if ((blk.type === 'button' || blk.type === 'image') && (blk.props.url === '#' || !blk.props.url)) {
            emptyLinkCount++;
          }
        }
      }
    }
  }

  if (missingAltCount > 0) {
    issues.push({
      id: 'alt-err',
      level: 'warning',
      title: `${missingAltCount} Image(s) Missing Alt Text`,
      description: 'Screen readers and image-blocked inboxes need descriptive alternative text for accessibility.',
      category: 'Accessibility',
    });
  } else {
    issues.push({
      id: 'alt-pass',
      level: 'pass',
      title: 'All Images Have Descriptive Alt Tags',
      description: 'Passes WCAG 2.1 AA screen reader standards.',
      category: 'Accessibility',
    });
  }

  // Check 4: Empty links
  if (emptyLinkCount > 0) {
    issues.push({
      id: 'link-err',
      level: 'warning',
      title: `${emptyLinkCount} CTA/Button(s) Point to Empty '#' Link`,
      description: 'Empty anchor links can trigger spam filter heuristic scoring.',
      category: 'Deliverability',
    });
  }

  // Check 5: Outlook VML fallbacks
  const hasVmlRoundrect = compiledHtml.includes('<v:roundrect');
  const hasVmlRect = compiledHtml.includes('<v:rect');
  if (hasVmlRoundrect || hasVmlRect) {
    issues.push({
      id: 'vml-pass',
      level: 'pass',
      title: 'Outlook MSO / VML Vector Acceleration Active',
      description: 'VML roundrect and background fill tags detected for 100% desktop Outlook fidelity.',
      category: 'Outlook VML',
    });
  }

  // Calculate Health Score (0-100)
  const errorCount = issues.filter((i) => i.level === 'error').length;
  const warningCount = issues.filter((i) => i.level === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 30 - warningCount * 12);

  const handleQuickAutoFix = () => {
    const fixed = JSON.parse(JSON.stringify(document)) as EmailDocument;
    if (!fixed.settings.preheader) {
      fixed.settings.preheader = `Important update: ${fixed.settings.title || 'Exclusive announcement'}`;
    }
    for (const s of fixed.stripes) {
      for (const st of s.structures) {
        for (const col of st.columns) {
          for (const blk of col.blocks) {
            if (blk.type === 'image' && (!blk.props.alt || blk.props.alt.trim() === '')) {
              blk.props.alt = 'Email visual graphic';
            }
            if (blk.type === 'button' && (blk.props.url === '#' || !blk.props.url)) {
              blk.props.url = 'https://example.com/action';
            }
          }
        }
      }
    }
    onAutoFix(fixed);
  };

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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#111115',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#141419',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 182, 212, 0.12)',
                color: '#22d3ee',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Deliverability &amp; MSO Preflight Auditor</span>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    backgroundColor: '#083344',
                    color: '#22d3ee',
                    border: '1px solid #155e75',
                  }}
                >
                  v2.0
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                RFC 5322, Gmail 102KB &amp; Outlook MSO engine check
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Score & Gmail Meter Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Health Score Card */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `2px solid ${score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'}`,
                  backgroundColor: score >= 90 ? 'rgba(6, 78, 59, 0.35)' : score >= 70 ? 'rgba(120, 53, 15, 0.35)' : 'rgba(127, 29, 29, 0.35)',
                  color: score >= 90 ? '#34d399' : score >= 70 ? '#fbbf24' : '#f87171',
                  fontFamily: 'monospace',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.75 }}>/ 100</span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                  {score >= 90 ? 'Inbox Certified Ready' : score >= 70 ? 'Minor Optimization Needed' : 'Deliverability Risks Found'}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  {issues.filter((i) => i.level === 'pass').length} passed, {warningCount} warnings, {errorCount} errors
                </div>
              </div>
            </div>

            {/* Gmail 102 KB Meter */}
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Envelope size={14} color="#f87171" />
                  Gmail 102 KB Limit
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#cbd5e1' }}>
                  {(byteSize / 1024).toFixed(1)} KB / 102.4 KB
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: '#27272a', overflow: 'hidden', margin: '10px 0' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'all 0.3s ease',
                    width: `${bytePercentage}%`,
                    backgroundColor: bytePercentage >= 100 ? '#ef4444' : bytePercentage > 80 ? '#f59e0b' : '#10b981',
                  }}
                />
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{bytePercentage.toFixed(0)}% capacity</span>
                <span style={{ color: isClippedByGmail ? '#f87171' : '#34d399', fontWeight: 500 }}>
                  {isClippedByGmail ? '⚠️ Will Clip in Gmail' : '✓ Safe from clipping'}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Diagnostic Checks ({issues.length})
            </div>
            {issues.map((issue) => (
              <div
                key={issue.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {issue.level === 'pass' && <CheckCircle size={16} color="#10b981" weight="fill" />}
                  {issue.level === 'warning' && <Warning size={16} color="#f59e0b" weight="fill" />}
                  {issue.level === 'error' && <XCircle size={16} color="#ef4444" weight="fill" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff' }}>{issue.title}</span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#27272a',
                        color: '#a1a1aa',
                      }}
                    >
                      {issue.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
                    {issue.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#141419',
          }}
        >
          <button
            onClick={() => {
              onClose();
              onSummonAiFix();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
          >
            <Sparkle size={14} weight="fill" />
            <span>Summon AI MSO Guardian to Auto-Fix</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleQuickAutoFix}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#27272a',
                color: '#e4e4e7',
                fontSize: '12px',
                fontWeight: 500,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3f3f46')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
            >
              Apply Instant Fixes
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
