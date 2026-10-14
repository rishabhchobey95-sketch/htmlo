import React, { useState } from 'react';
import {
  PlayCircle,
  VideoCamera,
  SpeakerHigh,
  DownloadSimple,
  GithubLogo,
  Sparkle,
  ShieldCheck,
  Lightning,
  Clock,
  ArrowSquareOut
} from '@phosphor-icons/react';

interface TutorialVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  voice: string;
  narrator: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  highlights: { time: string; label: string; desc: string }[];
  githubUrl: string;
}

const TUTORIALS: TutorialVideo[] = [
  {
    id: 'launch',
    title: 'htmlo Launch Masterclass & AI Swarm Deep Dive',
    category: 'Featured Masterclass',
    duration: '21s (1,260 frames @ 60fps)',
    voice: 'Andrew Neural (Studio Voiceover)',
    narrator: 'Male, Confident & Warm',
    videoUrl: '/tutorials/htmlo-launch.mp4',
    posterUrl: '/tutorials/htmlo-launch-poster.jpg',
    description:
      'A comprehensive walkthrough demonstrating the problem with Outlook 2007-2024 Word rendering, summoning the 4-agent AI Swarm with ⌘J, mathematical VML roundrect compilation, and live 102 KB Gmail clipping sentinel auditing.',
    highlights: [
      { time: '00:00', label: 'The Outlook Nightmare', desc: 'Why border-radius and flexbox break in MSO Word' },
      { time: '00:03', label: 'Summon ⌘J Swarm', desc: '4 autonomous cursors collaborating in real time' },
      { time: '00:08', label: 'VML Vector Compiler', desc: '<v:roundrect> mathematical vector injection' },
      { time: '00:12', label: '102 KB Gmail Sentinel', desc: 'Live preflight byte budgeting & dual emulation' },
      { time: '00:15', label: 'Zero Oxlint Warnings', desc: '100% compliance across Apple, Gmail, and Outlook' },
    ],
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/htmlo-launch.mp4',
  },
  {
    id: 'explainer',
    title: 'How It Works: Step-by-Step Architecture Explainer',
    category: 'Architecture Guide',
    duration: '20s (1,200 frames @ 60fps)',
    voice: 'Christopher Neural (Studio Voiceover)',
    narrator: 'Male, Authoritative Educator',
    videoUrl: '/tutorials/htmlo-explainer.mp4',
    posterUrl: '/tutorials/htmlo-explainer-poster.jpg',
    description:
      'Node flowchart visualization detailing the 3-step pipeline: design parsing into structured table AST, mathematical compilation into dual-engine XHTML and VML, and byte-level preflight auditing.',
    highlights: [
      { time: '00:00', label: 'The Dual Bottleneck', desc: 'Outlook stripped CSS vs. Gmail >102 KB clipping' },
      { time: '00:04', label: 'Step 1: AST Generation', desc: 'AI Swarm coordinates 600px table layout tree' },
      { time: '00:09', label: 'Step 2: Dual Compiler', desc: 'EmailCompiler.ts outputs bulletproof XHTML & VML' },
      { time: '00:14', label: 'Step 3: Byte Sentinel', desc: 'Real-time preflight audit locks payload under 102 KB' },
    ],
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/htmlo-explainer.mp4',
  },
  {
    id: 'vox',
    title: 'The 2007 Word Engine: Documentary Case Study',
    category: 'Investigative Essay',
    duration: '20s (1,200 frames @ 60fps)',
    voice: 'Guy Neural (Studio Voiceover)',
    narrator: 'Male, Expressive Documentary',
    videoUrl: '/tutorials/vox-htmlo.mp4',
    posterUrl: '/tutorials/vox-htmlo-poster.jpg',
    description:
      'A Vox-style mixed-media documentary featuring archival 2007 clippings, forensic evidence board with red yarn connections, darkroom blueprint inversion, and rubber-stamp compliance auditing.',
    highlights: [
      { time: '00:00', label: 'Archival 2007 Cutout', desc: 'When Microsoft switched Outlook to Microsoft Word' },
      { time: '00:04', label: 'Forensic Evidence Board', desc: 'Case file: ⌘J 4-agent AI Swarm red yarn linkage' },
      { time: '00:09', label: 'Blueprint Inversion', desc: 'Chalkboard slate reveals VML vector armor' },
      { time: '00:14', label: 'Rubber Stamp Verdict', desc: '41.8 KB payload passed with zero Oxlint warnings' },
    ],
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/vox-htmlo.mp4',
  },
  {
    id: 'brag',
    title: 'Kinetic Typography & Engineering Showcase',
    category: 'Fast-Paced Showcase',
    duration: '18s (1,080 frames @ 60fps)',
    voice: 'Brian Neural (Studio Voiceover)',
    narrator: 'Male, Approachable & Direct',
    videoUrl: '/tutorials/brag.mp4',
    posterUrl: '/tutorials/brag-poster.jpg',
    description:
      'High-velocity kinetic typography breakdown showcasing the core engineering achievements of htmlo: React 19, TypeScript 6.0, Vite 8.3, and zero flexbox hacks.',
    highlights: [
      { time: '00:00', label: 'The Secret Exposed', desc: 'Kinetic strike-through on broken CSS' },
      { time: '00:03', label: 'Autonomous AI Swarm', desc: 'Telekinesis laser beam projection across canvas' },
      { time: '00:07', label: 'Mathematical VML', desc: 'Zero flexbox hacks, pure vector compliance' },
      { time: '00:11', label: 'Live Sentinel Auditing', desc: 'Instantaneous dual-engine preview' },
    ],
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/releases/tag/v1.0.0',
  },
];

export const TutorialsSection: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string>('launch');
  const activeVideo = TUTORIALS.find((v) => v.id === activeVideoId) || TUTORIALS[0];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #052E16 0%, #064E3B 50%, #16A34A 100%)',
          borderRadius: '16px',
          padding: '32px 36px',
          color: '#ffffff',
          marginBottom: '32px',
          boxShadow: '0 20px 40px rgba(5, 46, 22, 0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            <SpeakerHigh size={16} color="#86EFAC" weight="bold" />
            <span>Studio Male Voiceover Narrated Tutorials</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            htmlo Video Tutorials & Motion Guides
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: '#D1FAE5', maxWidth: '640px', lineHeight: 1.5 }}>
            Master visual email engineering with high-definition motion tutorials. Each video is narrated by our AI voice director with full step-by-step UI breakdowns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="https://github.com/rishabhchobey95-sketch/htmlo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              color: '#052E16',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
            }}
          >
            <GithubLogo size={20} weight="fill" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>

      {/* Main Video Cinema Theater */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          marginBottom: '36px',
        }}
      >
        {/* Video Player */}
        <div style={{ position: 'relative', width: '100%', backgroundColor: '#020617', aspectRatio: '16/9' }}>
          <video
            key={activeVideo.videoUrl}
            controls
            autoPlay
            playsInline
            poster={activeVideo.posterUrl}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
          >
            <source src={activeVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Metadata & Timeline Highlights */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {activeVideo.category}
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {activeVideo.duration}
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <SpeakerHigh size={14} color="#16A34A" />
                  {activeVideo.voice} ({activeVideo.narrator})
                </span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                {activeVideo.title}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={activeVideo.videoUrl}
                download
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  backgroundColor: '#F8FAFC',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <DownloadSimple size={16} />
                <span>Download MP4</span>
              </a>
              <a
                href={activeVideo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#052E16',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <GithubLogo size={16} />
                <span>GitHub Asset</span>
              </a>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            {activeVideo.description}
          </p>

          {/* Timeline Chapter Pills */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px 0' }}>
              Tutorial Key Moments & Audio Cues
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {activeVideo.highlights.map((h, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#16A34A', fontSize: '12px', backgroundColor: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                      {h.time}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>{h.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Other Tutorials */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 18px 0' }}>
          Select Another Video Tutorial
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px' }}>
          {TUTORIALS.map((tut) => {
            const isCurrent = tut.id === activeVideoId;
            return (
              <div
                key={tut.id}
                onClick={() => setActiveVideoId(tut.id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: isCurrent ? '2px solid #16A34A' : '1px solid #E2E8F0',
                  boxShadow: isCurrent ? '0 10px 25px rgba(22, 163, 74, 0.18)' : '0 4px 12px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#0F172A' }}>
                  <img
                    src={tut.posterUrl}
                    alt={tut.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '999px',
                        backgroundColor: isCurrent ? '#16A34A' : 'rgba(255,255,255,0.9)',
                        color: isCurrent ? '#ffffff' : '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                      }}
                    >
                      <PlayCircle size={26} weight="fill" />
                    </div>
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {tut.duration.split(' ')[0]}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {tut.category}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {tut.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <SpeakerHigh size={13} color="#16A34A" />
                    <span>{tut.narrator}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
