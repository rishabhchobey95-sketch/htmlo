import React, { useState } from 'react';
import {
  PlayCircle,
  SpeakerHigh,
  Clock,
  Sparkle,
  ShieldCheck,
  Lightning,
  GithubLogo,
  ArrowRight,
  Info,
  CheckCircle,
  FileCode
} from '@phosphor-icons/react';

interface MainVideoItem {
  id: string;
  badge: string;
  title: string;
  duration: string;
  frames: string;
  voice: string;
  narrator: string;
  videoUrl: string;
  posterUrl: string;
  contextHeader: string;
  contextProblem: string;
  contextSolution: string;
  keyFeatures: string[];
  techStack: string;
  githubUrl: string;
}

const MAIN_VIDEOS: MainVideoItem[] = [
  {
    id: 'launch',
    badge: 'Flagship Showcase',
    title: 'htmlo Launch Masterclass & 4-Agent AI Swarm',
    duration: '21 seconds',
    frames: '1,260 frames @ 60fps',
    voice: 'Andrew Neural',
    narrator: 'Studio Male Voiceover (Confident & Warm)',
    videoUrl: '/tutorials/htmlo-launch.mp4',
    posterUrl: '/tutorials/htmlo-launch-poster.jpg',
    contextHeader: 'Why Email Development Still Breaks in 2026',
    contextProblem:
      'Microsoft Outlook still renders emails using Microsoft Word\'s typography engine rather than a modern web browser. Essential modern CSS such as flexbox, CSS grid, and border-radius are completely stripped or ignored, causing buttons to render as crude sharp rectangles and layouts to collapse.',
    contextSolution:
      'htmlo introduces a mathematical AST compiler that detects Outlook engines and injects Microsoft Vector Markup Language (<v:roundrect>). Paired with autonomous collaborative AI Swarm Cursors (summoned via ⌘J) and a real-time 102 KB Gmail clipping sentinel, developers can design visually and compile bulletproof XHTML with 100% vector fidelity.',
    keyFeatures: [
      'Automatic <v:roundrect arcsize="18%"> VML vector button generation',
      'Autonomous 4-agent AI Swarm (Architect, Copywriter, Art Director, MSO Guardian)',
      'Live 102.0 KB Gmail Clipping Sentinel auditing with preheader armor',
      'Dual Desktop (600px) and Mobile (375px) synchronized emulation',
    ],
    techStack: 'React 19 • TypeScript 6.0 • Vite 8.3 • Zero Oxlint Warnings',
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/htmlo-launch.mp4',
  },
  {
    id: 'explainer',
    badge: 'Architecture Guide',
    title: 'How htmlo Works: 3-Step Compilation Pipeline',
    duration: '20 seconds',
    frames: '1,200 frames @ 60fps',
    voice: 'Christopher Neural',
    narrator: 'Studio Male Voiceover (Authoritative Educator)',
    videoUrl: '/tutorials/htmlo-explainer.mp4',
    posterUrl: '/tutorials/htmlo-explainer-poster.jpg',
    contextHeader: 'The Engineering Behind Dual-Engine Compilation',
    contextProblem:
      'Building emails requires writing two opposing codebases at once: modern web-standards HTML/CSS for Apple Mail and iOS, and legacy nested table markup with conditional comments for Outlook on Windows.',
    contextSolution:
      'This animated flowchart breaks down htmlo\'s deterministic pipeline: Step 1 converts visual blocks into an Abstract Syntax Tree (AST), Step 2 compiles the AST into dual-engine XHTML and VML, and Step 3 verifies the final bundle against the 102 KB Gmail clipping threshold before exporting.',
    keyFeatures: [
      'Visual Node Flowchart illustrating data flow from visual blocks to raw code',
      'Step 1: AST JSON node tree coordination with AI assistance',
      'Step 2: Mathematical EmailCompiler.ts engine injecting zero-width non-joiners',
      'Step 3: Byte-level preflight auditing guaranteeing 0 Oxlint warnings',
    ],
    techStack: 'Deterministic AST Compiler • VML Vector Generator • Preflight Auditor',
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/htmlo-explainer.mp4',
  },
  {
    id: 'vox',
    badge: 'Investigative Essay',
    title: 'The 2007 Word Engine: An Archival Documentary',
    duration: '20 seconds',
    frames: '1,200 frames @ 60fps',
    voice: 'Guy Neural',
    narrator: 'Studio Male Voiceover (Documentary Narrator)',
    videoUrl: '/tutorials/vox-htmlo.mp4',
    posterUrl: '/tutorials/vox-htmlo-poster.jpg',
    contextHeader: 'Historical Investigation: The Decision That Broke Emails',
    contextProblem:
      'In May 2007, Microsoft replaced Internet Explorer with Microsoft Word as Outlook\'s email rendering engine. Overnight, standard web development techniques stopped working, trapping email designers in a 1999-era coding paradigm for nearly two decades.',
    contextSolution:
      'Presented as a Vox-style mixed-media collage featuring archival newspaper clippings, forensic evidence boards linked with red yarn, and darkroom blueprint inversions, this documentary examines how mathematical code compilation permanently solves Outlook\'s legacy constraints.',
    keyFeatures: [
      'Archival 2007 newspaper cutouts with translucent multiplier highlighter sweeps',
      'Forensic case file evidence board showing ⌘J AI Swarm connections with red yarn',
      'Chalkboard slate darkroom inversion highlighting VML vector armor code',
      'Official rubber stamp compliance verification: 41.8 KB payload passed',
    ],
    techStack: 'Mixed-Media Cutout Motion • 12fps Quantized Stop-Motion • 44.1kHz Lo-Fi Foley',
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/blob/main/media/vox-htmlo.mp4',
  },
  {
    id: 'brag',
    badge: 'Engineering Showcase',
    title: 'Kinetic Typography & Performance Redline',
    duration: '18 seconds',
    frames: '1,080 frames @ 60fps',
    voice: 'Brian Neural',
    narrator: 'Studio Male Voiceover (Direct & Approachable)',
    videoUrl: '/tutorials/brag.mp4',
    posterUrl: '/tutorials/brag-poster.jpg',
    contextHeader: 'Zero Flexbox Hacks. Pure Vector Compliance.',
    contextProblem:
      'Traditional email development relies on messy CSS workarounds and fragile nested spacer GIFs that frequently break across client updates and high-DPI displays.',
    contextSolution:
      'A rapid kinetic typography showcase highlighting how htmlo was built from the ground up on React 19, TypeScript 6.0, and Vite 8.3 with zero external CSS frameworks and 0 Oxlint warnings.',
    keyFeatures: [
      'Kinetic strike-through on obsolete email CSS workarounds',
      'Telekinesis laser projection demonstration between floating docks',
      'Instantaneous benchmark odometer redlining to 100% MSO compliance',
      'Immediate code copy and XHTML export ready for deployment',
    ],
    techStack: 'React 19 • TypeScript 6.0 • Vite 8.3 • Pure Vanilla CSS Architecture',
    githubUrl: 'https://github.com/rishabhchobey95-sketch/htmlo/releases/tag/v1.0.0',
  },
];

interface MainPageVideoShowcaseProps {
  onOpenTutorialsTab?: () => void;
}

export const MainPageVideoShowcase: React.FC<MainPageVideoShowcaseProps> = ({ onOpenTutorialsTab }) => {
  const [selectedId, setSelectedId] = useState<string>('launch');
  const active = MAIN_VIDEOS.find((v) => v.id === selectedId) || MAIN_VIDEOS[0];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Motion Graphics & Voiced Guides
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <SpeakerHigh size={14} color="#16A34A" />
              Male AI Voiceover Narrated
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Inside htmlo: Architecture & Motion Video Showcase
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#64748B' }}>
            Watch detailed frame-by-frame demonstrations explaining email client bottlenecks, VML vector compilation, and autonomous AI swarm workflows.
          </p>
        </div>

        {onOpenTutorialsTab && (
          <button
            onClick={onOpenTutorialsTab}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#1E293B',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>Open Cinema Player</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Video Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        {MAIN_VIDEOS.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: isSelected ? '1px solid #16A34A' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                color: isSelected ? '#15803D' : '#475569',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <PlayCircle size={16} weight={isSelected ? 'fill' : 'regular'} color={isSelected ? '#16A34A' : '#64748B'} />
              <span>{item.title.split(':')[0]}</span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? '#DCFCE7' : '#F1F5F9',
                  color: isSelected ? '#166534' : '#64748B',
                }}
              >
                {item.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Video Presentation Grid: Video on Left, Rich Context on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(400px, 1.25fr) minmax(320px, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Video Player */}
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#020617',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
            <video
              key={active.videoUrl}
              controls
              playsInline
              poster={active.posterUrl}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
            >
              <source src={active.videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>

          {/* Quick Player Bar */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#0F172A',
              color: '#94A3B8',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SpeakerHigh size={15} color="#22C55E" />
              <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{active.narrator}</span>
            </div>
            <div>{active.frames}</div>
          </div>
        </div>

        {/* Right: Rich Context & Engineering Background */}
        <div>
          {/* Badge & Title */}
          <div style={{ marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#16A34A',
                backgroundColor: '#DCFCE7',
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '6px',
              }}
            >
              {active.badge}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              {active.title}
            </h3>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
              {active.contextHeader}
            </div>
          </div>

          {/* Problem & Solution Accordion Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {/* The Industry Problem */}
            <div
              style={{
                backgroundColor: '#FFF7ED',
                border: '1px solid #FFEDD5',
                borderRadius: '8px',
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase' }}>
                  The Email Bottleneck
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#9A3412', lineHeight: 1.45 }}>
                {active.contextProblem}
              </p>
            </div>

            {/* The htmlo Solution */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #DCFCE7',
                borderRadius: '8px',
                padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <CheckCircle size={14} color="#16A34A" weight="fill" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
                  How htmlo Solves It
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#166534', lineHeight: 1.45 }}>
                {active.contextSolution}
              </p>
            </div>
          </div>

          {/* Key Engineering Highlights */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              Key System Takeaways
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
              {active.keyFeatures.map((feat, i) => (
                <li key={i} style={{ marginBottom: '3px' }}>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            <a
              href={active.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#052E16',
                textDecoration: 'none',
                backgroundColor: '#F1F5F9',
                padding: '6px 12px',
                borderRadius: '6px',
              }}
            >
              <GithubLogo size={14} />
              <span>Inspect on GitHub</span>
            </a>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{active.techStack}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
