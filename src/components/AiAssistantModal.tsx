import React, { useState } from 'react';
import {
  X,
  MagicWand,
  CaretRight,
  CaretDown,
  Question,
  CircleNotch,
  Sparkle,
} from '@phosphor-icons/react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, options: AiOptions) => void;
}

export interface AiOptions {
  tone: string;
  audience: string;
  language: string;
  templateType: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [tone, setTone] = useState('Friendly & Professional');
  const [audience, setAudience] = useState('Subscribers & Customers');
  const [language, setLanguage] = useState('English');
  const [templateType, setTemplateType] = useState('Marketing Promotion');

  if (!isOpen) return null;

  const handleQuickPrompt = (text: string) => {
    setPrompt(text);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate(prompt.trim(), { tone, audience, language, templateType });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#ffffff',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Right Close Button */}
      <button
        onClick={onClose}
        title="Close AI Assistant"
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.color = '#1e293b';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }}
      >
        <X size={20} weight="bold" />
      </button>

      {/* Main Center Content Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#334155',
              letterSpacing: '-0.5px',
              margin: '0 0 4px 0',
            }}
          >
            Create email messages
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#334155',
                letterSpacing: '-0.5px',
              }}
            >
              with AI Assistant
            </span>
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'lowercase',
                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.3)',
              }}
            >
              beta
            </span>
          </div>
        </div>

        {/* Input Box Card with Magic Wand Submit Button */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            backgroundColor: '#ededed',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            position: 'relative',
          }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="I need you to..."
            rows={2}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#1e293b',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />

          {/* White Wand Button */}
          <button
            type="submit"
            disabled={!prompt.trim()}
            title="Generate with AI"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: prompt.trim() ? '#22c55e' : '#94a3b8',
              cursor: prompt.trim() ? 'pointer' : 'default',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (prompt.trim()) {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
                e.currentTarget.style.borderColor = '#22c55e';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <MagicWand size={20} weight={prompt.trim() ? 'fill' : 'regular'} />
          </button>
        </form>

        {/* Quick Suggestion Links: Try: Webinar  Email Digest  Be Surprised */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '14px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
            <span style={{ color: '#64748b' }}>Try:</span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Create an engaging Webinar invitation email with countdown timer, speaker highlight, and registration button.')}
              style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
            >
              Webinar
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Generate a weekly Email Digest with top 3 curated stories, author avatars, and reader discussion CTA.')}
              style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
            >
              Email Digest
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Build a high-converting Flash Sale announcement email with 50% discount voucher and bulletproof Outlook button.')}
              style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
            >
              Be Surprised
            </button>
          </div>

          <button
            type="button"
            onClick={() => onGenerate(prompt.trim() || 'Create a high-converting SaaS product launch email with 2-column hero and bulletproof Outlook button.', { tone, audience, language, templateType })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #334155',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)',
            }}
          >
            <Sparkle size={14} color="#38bdf8" weight="fill" />
            <span>Launch Live Swarm</span>
          </button>
        </div>

        {/* Collapsible: > Additional Options */}
        <div style={{ width: '100%', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            {showOptions ? <CaretDown size={14} /> : <CaretRight size={14} />}
            <span>Additional Options</span>
          </button>

          {showOptions && (
            <div
              style={{
                marginTop: '12px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="Friendly & Professional">Friendly & Professional</option>
                  <option value="Energetic & Bold">Energetic & Bold</option>
                  <option value="Urgent & Promotional">Urgent & Promotional</option>
                  <option value="Minimal & Elegant">Minimal & Elegant</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Target Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="Subscribers & Customers">Subscribers & Customers</option>
                  <option value="B2B Enterprise Leads">B2B Enterprise Leads</option>
                  <option value="Community Members">Community Members</option>
                  <option value="VIP Customers">VIP Customers</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                  Template Type
                </label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="Marketing Promotion">Marketing Promotion</option>
                  <option value="Transactional Notification">Transactional Notification</option>
                  <option value="Founder Newsletter">Founder Newsletter</option>
                  <option value="Product Launch">Product Launch</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Profile Completion Banner (Exact from screenshot) */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 20px',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          fontSize: '12.5px',
          color: '#475569',
        }}
      >
        {/* Circular Progress Ring Icon */}
        <div style={{ position: 'relative', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircleNotch size={18} color="#22c55e" style={{ animation: 'spin 4s linear infinite' }} />
        </div>
        <span>
          Get better results by{' '}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: '#16a34a', textDecoration: 'underline', fontWeight: 500 }}
          >
            telling us more about your project
          </a>
          . Right now, your profile is 63% complete.
        </span>
      </div>

      {/* Bottom Left Help Icon */}
      <button
        type="button"
        title="Help"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
        }}
      >
        <Question size={16} />
      </button>
    </div>
  );
};
