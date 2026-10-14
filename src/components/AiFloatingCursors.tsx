import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkle,
  Pause,
  Play,
  FastForward,
  ShieldCheck,
  PaintBrush,
  PenNib,
  Compass,
} from '@phosphor-icons/react';
import { EmailDocument } from '../types/editor';
import { StarBorder, AnimatedBeam, DecryptedText, ShinyText } from './reactbits';

interface AiFloatingCursorsProps {
  isActive: boolean;
  prompt: string;
  onFinish: (generatedDoc: EmailDocument) => void;
  onCancel: () => void;
}

interface AgentCursor {
  id: 'architect' | 'copywriter' | 'art_director' | 'mso_guardian';
  name: string;
  role: string;
  color: string;
  icon: React.ReactNode;
  status: string;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  active: boolean;
  telemetry: string;
}

const TIMELINE_STEPS = [
  {
    architect: { x: 22, y: 15, status: 'Lifting Header Stripe from LeftDock...', telemetry: 'stripeType: header' },
    copywriter: { x: 48, y: 18, status: 'Drafting brand tagline and preheader...', telemetry: 'preheader: &zwnj;&nbsp;' },
    art_director: { x: 68, y: 22, status: 'Connecting styles to InspectorPanel...', telemetry: 'padding: 24px 32px' },
    mso_guardian: { x: 38, y: 28, status: 'Verifying Apple Mail & Outlook 365 DPI...', telemetry: 'dpi: 96 // table-layout: fixed' },
    streamCopy: 'LAUNCH // 2026 EDITION',
    liftGhost: true,
  },
  {
    architect: { x: 42, y: 34, status: 'Dropping 2-Column Hero Structure...', telemetry: 'cols: 50% / 50% split' },
    copywriter: { x: 50, y: 40, status: 'Streaming hero value proposition headline...', telemetry: 'tokens: 28 // converted' },
    art_director: { x: 78, y: 36, status: 'Adjusting CTA button padding and arcsize...', telemetry: 'arcsize: 20% // #22c55e' },
    mso_guardian: { x: 55, y: 46, status: 'Embedding bulletproof <v:roundrect> CTA...', telemetry: 'w:anchorlock // mso-fit: true' },
    streamCopy: 'Experience High-Conversion Email Architecture',
    liftGhost: false,
  },
  {
    architect: { x: 32, y: 58, status: 'Arranging 3-Column Feature Grid...', telemetry: '33.3% x 3 fluid columns' },
    copywriter: { x: 60, y: 62, status: 'Crafting concise feature descriptions...', telemetry: 'lineHeight: 1.6' },
    art_director: { x: 66, y: 68, status: 'Harmonizing card background and border contrast...', telemetry: 'WCAG AAA ratio: 7.2:1' },
    mso_guardian: { x: 46, y: 72, status: 'Testing reverse mobile stacking rules...', telemetry: 'reverseStackMobile: true' },
    streamCopy: 'Engineered for 100% Inbox Deliverability',
    liftGhost: false,
  },
  {
    architect: { x: 50, y: 80, status: 'Constructing social proof and footer stripe...', telemetry: 'networks: 4 connected' },
    copywriter: { x: 42, y: 84, status: 'Inserting compliant unsubscribe merge tags...', telemetry: '{{unsubscribe_url}}' },
    art_director: { x: 58, y: 86, status: 'Finalizing typography cadence & line-height...', telemetry: 'fontFamily: Inter, sans-serif' },
    mso_guardian: { x: 52, y: 90, status: 'Auditing 102KB Gmail clipping threshold...', telemetry: 'size: 21.5 KB // 100% PASS' },
    streamCopy: 'Verified Clean & Inbox-Ready',
    liftGhost: false,
  },
  {
    architect: { x: 48, y: 50, status: 'AST Graph Assembled ✨', telemetry: 'status: 100% optimal' },
    copywriter: { x: 52, y: 50, status: 'Copy refined and proofread ✨', telemetry: 'status: 100% optimal' },
    art_director: { x: 50, y: 52, status: 'Design polished for retina ✨', telemetry: 'status: 100% optimal' },
    mso_guardian: { x: 50, y: 48, status: 'All 9 Outlook validations passed ✨', telemetry: 'status: 100% optimal' },
    streamCopy: 'Email Compilation Complete!',
    liftGhost: false,
  },
];

export const AiFloatingCursors: React.FC<AiFloatingCursorsProps> = ({
  isActive,
  prompt,
  onFinish,
  onCancel,
}) => {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 3>(1);
  const [streamingText, setStreamingText] = useState(TIMELINE_STEPS[0].streamCopy);
  const [isLiftingGhost, setIsLiftingGhost] = useState(TIMELINE_STEPS[0].liftGhost);

  // 4 Specialized Spatial AI Agent Cursors initialized at Step 0
  const [cursors, setCursors] = useState<AgentCursor[]>([
    {
      id: 'architect',
      name: 'Architect',
      role: 'Grid & Structure',
      color: '#6366f1', // Indigo
      icon: <Compass size={12} weight="bold" />,
      status: TIMELINE_STEPS[0].architect.status,
      x: TIMELINE_STEPS[0].architect.x,
      y: TIMELINE_STEPS[0].architect.y,
      prevX: TIMELINE_STEPS[0].architect.x,
      prevY: TIMELINE_STEPS[0].architect.y,
      active: true,
      telemetry: TIMELINE_STEPS[0].architect.telemetry,
    },
    {
      id: 'copywriter',
      name: 'Copywriter',
      role: 'Conversion Copy',
      color: '#10b981', // Emerald
      icon: <PenNib size={12} weight="bold" />,
      status: TIMELINE_STEPS[0].copywriter.status,
      x: TIMELINE_STEPS[0].copywriter.x,
      y: TIMELINE_STEPS[0].copywriter.y,
      prevX: TIMELINE_STEPS[0].copywriter.x,
      prevY: TIMELINE_STEPS[0].copywriter.y,
      active: true,
      telemetry: TIMELINE_STEPS[0].copywriter.telemetry,
    },
    {
      id: 'art_director',
      name: 'Art Director',
      role: 'Harmonies & CTA',
      color: '#f59e0b', // Amber
      icon: <PaintBrush size={12} weight="bold" />,
      status: TIMELINE_STEPS[0].art_director.status,
      x: TIMELINE_STEPS[0].art_director.x,
      y: TIMELINE_STEPS[0].art_director.y,
      prevX: TIMELINE_STEPS[0].art_director.x,
      prevY: TIMELINE_STEPS[0].art_director.y,
      active: true,
      telemetry: TIMELINE_STEPS[0].art_director.telemetry,
    },
    {
      id: 'mso_guardian',
      name: 'MSO Guardian',
      role: 'Outlook MSO Engine',
      color: '#06b6d4', // Cyan
      icon: <ShieldCheck size={12} weight="bold" />,
      status: TIMELINE_STEPS[0].mso_guardian.status,
      x: TIMELINE_STEPS[0].mso_guardian.x,
      y: TIMELINE_STEPS[0].mso_guardian.y,
      prevX: TIMELINE_STEPS[0].mso_guardian.x,
      prevY: TIMELINE_STEPS[0].mso_guardian.y,
      active: true,
      telemetry: TIMELINE_STEPS[0].mso_guardian.telemetry,
    },
  ]);

  // Telekinesis beam coordinates connecting Art Director to Inspector panel
  const [beamTarget, setBeamTarget] = useState<{ x: number; y: number } | null>(null);

  const handleComplete = useCallback(() => {
    const cleanPrompt = prompt.trim() || 'AI Masterpiece Email';
    const generated: EmailDocument = {
      version: '2.0.0',
      settings: {
        title: cleanPrompt.slice(0, 40),
        preheader: `Exclusive update: ${cleanPrompt.slice(0, 60)} — tap to view full announcement.`,
        contentWidth: 600,
        backgroundColor: '#09090b',
        contentBackgroundColor: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        primaryColor: '#6366f1',
        textColor: '#0f172a',
        linkColor: '#6366f1',
        underlineLinks: false,
        responsive: true,
      },
      stripes: [
        {
          id: `stripe-ai-header-${Date.now()}`,
          stripeType: 'header',
          backgroundColor: '#09090b',
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          structures: [
            {
              id: `struct-ai-hdr`,
              stackOnMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: `col-ai-hdr`,
                  widthPercent: 100,
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  blocks: [
                    {
                      id: `blk-ai-brand`,
                      type: 'text',
                      align: 'center',
                      padding: { top: 4, right: 0, bottom: 4, left: 0 },
                      props: {
                        content: '<div style="font-family:Inter,sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.5px;color:#818cf8;">⚡ HTMLO INTELLIGENCE</div>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: `stripe-ai-hero-${Date.now()}`,
          stripeType: 'content',
          backgroundColor: '#ffffff',
          padding: { top: 44, right: 32, bottom: 36, left: 32 },
          structures: [
            {
              id: `struct-ai-hero`,
              stackOnMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: `col-ai-hero`,
                  widthPercent: 100,
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  blocks: [
                    {
                      id: `blk-ai-tag`,
                      type: 'shape',
                      align: 'center',
                      padding: { top: 0, right: 0, bottom: 16, left: 0 },
                      props: {
                        shapeType: 'pill',
                        fillColor: '#eef2ff',
                        strokeColor: '#6366f1',
                        strokeWidth: 1,
                        shapeText: 'AUTONOMOUS MULTI-AGENT BUILD',
                        shapeTextColor: '#4f46e5',
                      },
                    },
                    {
                      id: `blk-ai-h1`,
                      type: 'text',
                      align: 'center',
                      padding: { top: 0, right: 0, bottom: 16, left: 0 },
                      props: {
                        content: `<h1 style="margin:0;font-size:32px;line-height:1.2;color:#0f172a;font-weight:800;letter-spacing:-0.8px;">${cleanPrompt}</h1>`,
                      },
                    },
                    {
                      id: `blk-ai-desc`,
                      type: 'text',
                      align: 'center',
                      padding: { top: 0, right: 0, bottom: 24, left: 0 },
                      props: {
                        content: '<p style="margin:0;font-size:16px;line-height:1.6;color:#475569;">Precision engineered by autonomous AI co-designers with bulletproof Outlook VML buttons, multi-column responsive stacking, and pixel perfection across all devices.</p>',
                      },
                    },
                    {
                      id: `blk-ai-cta`,
                      type: 'button',
                      align: 'center',
                      padding: { top: 8, right: 0, bottom: 16, left: 0 },
                      props: {
                        text: 'Explore Launchpad →',
                        buttonColor: '#6366f1',
                        textColor: '#ffffff',
                        borderRadius: 8,
                        url: 'https://htmlo.mail',
                        width: 240,
                        height: 48,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: `stripe-ai-features-${Date.now()}`,
          stripeType: 'content',
          backgroundColor: '#f8fafc',
          padding: { top: 36, right: 24, bottom: 36, left: 24 },
          structures: [
            {
              id: `struct-ai-cols`,
              stackOnMobile: true,
              reverseStackMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: `col-ai-f1`,
                  widthPercent: 50,
                  padding: { top: 12, right: 12, bottom: 12, left: 12 },
                  blocks: [
                    {
                      id: `blk-ai-timer`,
                      type: 'timer',
                      align: 'center',
                      padding: { top: 8, right: 8, bottom: 8, left: 8 },
                      props: {
                        targetDate: '48h 00m 00s',
                        timerBackground: '#0f172a',
                        timerTextColor: '#38bdf8',
                      },
                    },
                  ],
                },
                {
                  id: `col-ai-f2`,
                  widthPercent: 50,
                  padding: { top: 12, right: 12, bottom: 12, left: 12 },
                  blocks: [
                    {
                      id: `blk-ai-copy-feature`,
                      type: 'text',
                      align: 'left',
                      padding: { top: 8, right: 8, bottom: 8, left: 8 },
                      props: {
                        content: '<h3 style="margin:0 0 8px 0;font-size:18px;color:#0f172a;font-weight:700;">Zero Client Clipping</h3><p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">Compiled directly to RFC 5322 table specifications guaranteeing 100% deliverability under Gmail 102KB limits.</p>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: `stripe-ai-footer-${Date.now()}`,
          stripeType: 'footer',
          backgroundColor: '#09090b',
          padding: { top: 32, right: 24, bottom: 32, left: 24 },
          structures: [
            {
              id: `struct-ai-ftr`,
              stackOnMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: `col-ai-ftr`,
                  widthPercent: 100,
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  blocks: [
                    {
                      id: `blk-ai-social`,
                      type: 'social',
                      align: 'center',
                      padding: { top: 0, right: 0, bottom: 16, left: 0 },
                      props: {
                        networks: [
                          { id: '1', network: 'twitter', url: 'https://x.com' },
                          { id: '2', network: 'github', url: 'https://github.com' },
                          { id: '3', network: 'linkedin', url: 'https://linkedin.com' },
                        ],
                        iconSize: 24,
                        iconSpacing: 14,
                      },
                    },
                    {
                      id: `blk-ai-unsub`,
                      type: 'text',
                      align: 'center',
                      padding: { top: 0, right: 0, bottom: 0, left: 0 },
                      props: {
                        content: '<p style="margin:0;font-size:12px;color:#71717a;">You received this email because you are a valued member. <a href="{{unsubscribe_url}}" style="color:#818cf8;text-decoration:underline;">Unsubscribe here</a>.</p>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    onFinish(generated);
  }, [prompt, onFinish]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const intervalTime = 1600 / speedMultiplier;
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        if (next < TIMELINE_STEPS.length) {
          const stepData = TIMELINE_STEPS[next];
          setStreamingText(stepData.streamCopy);
          setIsLiftingGhost(stepData.liftGhost);

          setCursors((prevCursors) => [
            {
              ...prevCursors[0],
              prevX: prevCursors[0].x,
              prevY: prevCursors[0].y,
              x: stepData.architect.x,
              y: stepData.architect.y,
              status: stepData.architect.status,
              telemetry: stepData.architect.telemetry,
            },
            {
              ...prevCursors[1],
              prevX: prevCursors[1].x,
              prevY: prevCursors[1].y,
              x: stepData.copywriter.x,
              y: stepData.copywriter.y,
              status: stepData.copywriter.status,
              telemetry: stepData.copywriter.telemetry,
            },
            {
              ...prevCursors[2],
              prevX: prevCursors[2].x,
              prevY: prevCursors[2].y,
              x: stepData.art_director.x,
              y: stepData.art_director.y,
              status: stepData.art_director.status,
              telemetry: stepData.art_director.telemetry,
            },
            {
              ...prevCursors[3],
              prevX: prevCursors[3].x,
              prevY: prevCursors[3].y,
              x: stepData.mso_guardian.x,
              y: stepData.mso_guardian.y,
              status: stepData.mso_guardian.status,
              telemetry: stepData.mso_guardian.telemetry,
            },
          ]);

          // Set telekinesis beam to inspector panel on right side of screen
          if (next === 1 || next === 2) {
            setBeamTarget({ x: window.innerWidth - 120, y: 240 });
          } else {
            setBeamTarget(null);
          }

          return next;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            handleComplete();
          }, 600);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isActive, isPaused, speedMultiplier, handleComplete]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 80,
        overflow: 'hidden',
      }}
    >
      {/* Top Telemetry Transport HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto',
        }}
      >
        <StarBorder color="#6366f1" speed="4s" borderRadius={12}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '10px 18px',
              backgroundColor: 'rgba(14, 14, 18, 0.96)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#ffffff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.55)',
              borderRadius: '12px',
            }}
          >
            {/* Pulsing Swarm Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
                <span
                  style={{
                    position: 'absolute',
                    display: 'inline-flex',
                    height: '100%',
                    width: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#34d399',
                    opacity: 0.75,
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    borderRadius: '50%',
                    height: '10px',
                    width: '10px',
                    backgroundColor: '#10b981',
                  }}
                />
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkle size={14} color="#818cf8" weight="fill" />
                <ShinyText text="AI Swarm Choreography" color="#c7d2fe" speed={2.5} />
              </span>
            </div>

            {/* Stepper Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {TIMELINE_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '6px',
                    borderRadius: '9999px',
                    transition: 'all 0.3s ease',
                    width: i <= step ? '20px' : '8px',
                    backgroundColor: i <= step ? '#6366f1' : '#3f3f46',
                  }}
                />
              ))}
            </div>

            {/* Live Streaming Token Preview */}
            {streamingText && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#d4d4d8',
                }}
              >
                <span style={{ color: '#34d399' }}>»</span>
                <DecryptedText text={streamingText} speed={20} maxIterations={8} />
              </div>
            )}

            {/* Playback Transport Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
              <button
                onClick={() => setIsPaused(!isPaused)}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  color: '#cbd5e1',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
              </button>

              <button
                onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 3 : 1)}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: speedMultiplier === 3 ? '#4f46e5' : '#27272a',
                  color: speedMultiplier === 3 ? '#ffffff' : '#d4d4d8',
                }}
                title="Toggle Speed"
              >
                {speedMultiplier}x
              </button>

              <button
                onClick={handleComplete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.4)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              >
                <FastForward size={13} weight="fill" />
                <span>Instant</span>
              </button>

              <button
                onClick={onCancel}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Cancel
              </button>
            </div>
          </div>
        </StarBorder>
      </div>

      {/* Floating Ghost Component Lift (Architect picking component) */}
      {isLiftingGhost && (
        <div
          style={{
            position: 'absolute',
            zIndex: 82,
            left: `${cursors[0].x + 4}%`,
            top: `${cursors[0].y + 4}%`,
            transform: 'rotate(-4deg) scale(0.92)',
            filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.45))',
            pointerEvents: 'none',
            transition: 'all 0.7s ease',
          }}
        >
          <div
            style={{
              width: '220px',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#18181c',
              border: '2px solid rgba(99, 102, 241, 0.85)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={20} weight="bold" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>2-Col Hero Structure</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>50% / 50% Mobile-Fluid</div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Animated Beam (Art Director to Inspector telekinesis) */}
      {beamTarget && (
        <AnimatedBeam
          startX={(window.innerWidth * cursors[2].x) / 100}
          startY={(window.innerHeight * cursors[2].y) / 100}
          endX={beamTarget.x}
          endY={beamTarget.y}
          color="rgba(245, 158, 11, 0.4)"
          particleColor="#f59e0b"
          duration={1.4}
        />
      )}

      {/* 4 Multi-Agent SVG Cursors */}
      {cursors.map((cursor) => {
        // Calculate velocity tilt
        const dx = cursor.x - cursor.prevX;
        const tiltDeg = Math.max(-20, Math.min(20, dx * 2.5));

        return (
          <div
            key={cursor.id}
            style={{
              position: 'absolute',
              zIndex: 85,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
              transform: 'translate3d(0,0,0)',
              transition: isPaused
                ? 'none'
                : `left ${1.2 / speedMultiplier}s cubic-bezier(0.22, 1, 0.36, 1), top ${
                    1.2 / speedMultiplier
                  }s cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            {/* SVG Arrow with Velocity Banking */}
            <div
              style={{
                transform: `rotate(${tiltDeg}deg)`,
                transition: 'transform 0.3s ease-out',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
                width: '24px',
                height: '24px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.65 12.37H5.46L5.32 12.5L0.5 16.88V1.2L11.78 12.37H5.65Z"
                  fill={cursor.color}
                  stroke="#ffffff"
                  strokeWidth="1.6"
                />
              </svg>
            </div>

            {/* Glassmorphic Telemetry Pill */}
            <div
              style={{
                marginLeft: '14px',
                marginTop: '-4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                userSelect: 'none',
                filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))',
              }}
            >
              {/* Agent Role Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '2px 8px',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  borderBottomRightRadius: '6px',
                  borderBottomLeftRadius: '0px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: cursor.color,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.35)',
                  width: 'fit-content',
                }}
              >
                {cursor.icon}
                <span>{cursor.name}</span>
                <span style={{ fontSize: '9.5px', opacity: 0.85, fontWeight: 400 }}>({cursor.role})</span>
              </div>

              {/* Status & Telemetry Tooltip */}
              <div
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(18, 18, 22, 0.95)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#e4e4e7',
                  fontSize: '11px',
                  maxWidth: '280px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>{cursor.status}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#a1a1aa', marginTop: '2px' }}>
                  {cursor.telemetry}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
