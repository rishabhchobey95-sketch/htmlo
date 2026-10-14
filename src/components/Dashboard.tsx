import React, { useState } from 'react';
import {
  House,
  EnvelopeSimple,
  FolderSimple,
  Browsers,
  Sparkle,
  Palette,
  Database,
  Trash,
  Gear,
  MagnifyingGlass,
  Plus,
  Bell,
  Question,
  CaretDown,
  Lightning,
  PencilSimple,
  Copy,
  Image as ImageIcon,
  Check,
  ShieldCheck,
  CrownSimple,
  SlidersHorizontal,
} from '@phosphor-icons/react';
import { EmailDocument } from '../types/editor';
import { initialEmailDoc } from '../data/defaultTemplate';
import { premadeEmailTemplates } from '../data/premadeTemplates';

export interface DashboardTemplate {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'saved' | 'basic' | 'prebuilt';
  thumbnailUrl?: string;
  isPlaceholder?: boolean;
  document: EmailDocument;
}

export interface EmailMessageItem {
  id: string;
  title: string;
  subject: string;
  status: 'draft' | 'ready' | 'exported';
  lastEdited: string;
  document: EmailDocument;
}

interface DashboardProps {
  onOpenTemplate: (doc: EmailDocument) => void;
  onNewTemplate: () => void;
  onOpenAiAssistant?: () => void;
}

// Initial Email Messages
const initialMessages: EmailMessageItem[] = [
  {
    id: 'msg-1',
    title: 'Core Member Recruitment Campaign',
    subject: 'Pandora Rebels Esports Club — Core Member Recruitment 2026',
    status: 'ready',
    lastEdited: 'Today, 21:32',
    document: initialEmailDoc,
  },
  {
    id: 'msg-2',
    title: 'Weekly Tech & Design Digest #14',
    subject: 'Inside htmlo: The modern open-source email studio',
    status: 'draft',
    lastEdited: 'Today, 20:26',
    document: initialEmailDoc,
  },
  {
    id: 'msg-3',
    title: 'Welcome & Onboarding Journey',
    subject: 'Welcome to the team! Here is what to expect.',
    status: 'ready',
    lastEdited: 'Oct 01, 2026',
    document: initialEmailDoc,
  },
];

// Initial Templates matching reference
const initialTemplates: DashboardTemplate[] = [
  {
    id: 'tpl-1',
    title: 'New email template',
    date: '2026-10-13',
    time: '20:26',
    category: 'saved',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop',
    document: initialEmailDoc,
  },
  {
    id: 'tpl-2',
    title: 'New email template',
    date: '2026-10-13',
    time: '21:32',
    category: 'saved',
    isPlaceholder: true,
    document: {
      version: '1.0.0',
      settings: {
        title: 'Blank Email Starter',
        preheader: 'Clean starter ready for your design',
        contentWidth: 600,
        backgroundColor: '#f1f5f9',
        contentBackgroundColor: '#ffffff',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        primaryColor: '#22c55e',
        textColor: '#1e293b',
        linkColor: '#2563eb',
        underlineLinks: false,
        responsive: true,
      },
      stripes: [
        {
          id: 'stripe-empty-1',
          stripeType: 'content',
          backgroundColor: '#ffffff',
          padding: { top: 40, right: 30, bottom: 40, left: 30 },
          structures: [
            {
              id: 'struct-empty-1',
              stackOnMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: 'col-empty-1',
                  widthPercent: 100,
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  blocks: [
                    {
                      id: 'block-empty-txt',
                      type: 'text',
                      align: 'center',
                      padding: { top: 20, right: 20, bottom: 20, left: 20 },
                      props: {
                        content: '<h2 style="margin:0;font-size:22px;color:#1e293b;">Start Designing Here</h2><p style="margin:8px 0 0 0;color:#64748b;font-size:15px;">Drag blocks from the left dock to build your custom email.</p>',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'tpl-3',
    title: 'New email template',
    date: '2026-10-01',
    time: '20:29',
    category: 'saved',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: 'Pandora Rebels Event Announcement',
        backgroundColor: '#090d16',
        contentBackgroundColor: '#0f172a',
        textColor: '#f8fafc',
      },
    },
  },
  // Basic Structural Layouts
  {
    id: 'basic-1',
    title: '1-Column Clean Letter',
    date: '2026-10-10',
    time: '12:00',
    category: 'basic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: '1-Column Clean Letter',
        backgroundColor: '#f8fafc',
        contentBackgroundColor: '#ffffff',
      },
    },
  },
  {
    id: 'basic-2',
    title: '2-Column Product Showcase',
    date: '2026-10-10',
    time: '12:15',
    category: 'basic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: '2-Column Product Showcase',
        backgroundColor: '#f1f5f9',
        contentBackgroundColor: '#ffffff',
      },
    },
  },
  {
    id: 'basic-3',
    title: '3-Column Feature Cards',
    date: '2026-10-10',
    time: '12:30',
    category: 'basic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: '3-Column Feature Cards',
        backgroundColor: '#f8fafc',
        contentBackgroundColor: '#ffffff',
      },
    },
  },
  {
    id: 'basic-4',
    title: 'Hero Announcement Starter',
    date: '2026-10-10',
    time: '12:45',
    category: 'basic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: 'Hero Announcement Starter',
        backgroundColor: '#0f172a',
        contentBackgroundColor: '#ffffff',
      },
    },
  },
  {
    id: 'basic-5',
    title: 'Order Receipt & Summary',
    date: '2026-10-10',
    time: '13:00',
    category: 'basic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop',
    document: {
      ...initialEmailDoc,
      settings: {
        ...initialEmailDoc.settings,
        title: 'Order Receipt & Summary',
        backgroundColor: '#f1f5f9',
        contentBackgroundColor: '#ffffff',
      },
    },
  },
  // 50 High-Fidelity Creative Premade Templates
  ...premadeEmailTemplates,
];

// Pre-built Reusable Modules
const initialModules = [
  {
    id: 'mod-1',
    name: 'Header & Brand Nav',
    category: 'header',
    description: 'Clean top navigation bar with brand logo and customizable action link.',
    previewImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop',
  },
  {
    id: 'mod-2',
    name: 'Hero Promo with CTA',
    category: 'hero',
    description: 'High-impact announcement card with bold headline, subtitle, and action button.',
    previewImg: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&auto=format&fit=crop',
  },
  {
    id: 'mod-3',
    name: '3-Column Features Grid',
    category: 'content',
    description: 'Side-by-side three column responsive section with icons and text.',
    previewImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop',
  },
  {
    id: 'mod-4',
    name: 'Event Date & Details Card',
    category: 'content',
    description: 'Compact 3-box details strip for Date, Time, and Venue with pill tags.',
    previewImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop',
  },
  {
    id: 'mod-5',
    name: 'Social Footer & Legal',
    category: 'footer',
    description: 'Bulletproof footer with social media circular icons and unsubscribe notice.',
    previewImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenTemplate,
  onNewTemplate,
  onOpenAiAssistant,
}) => {
  const [templates, setTemplates] = useState<DashboardTemplate[]>(initialTemplates);
  const [trashList, setTrashList] = useState<DashboardTemplate[]>([]);
  const [messages, _setMessages] = useState<EmailMessageItem[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'saved' | 'basic' | 'prebuilt'>('prebuilt');
  const [prebuiltSubFilter, setPrebuiltSubFilter] = useState<'all' | 'premium' | 'free'>('all');
  const [creativeCategory, setCreativeCategory] = useState<string>('all');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [_viewStyle, _setViewStyle] = useState<'grid' | 'list'>('grid');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState(['My Project', 'Marketing Campaigns', 'Esports Recruitment']);
  const [activeProject, setActiveProject] = useState('My Project');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [newProjectInput, setNewProjectInput] = useState('');

  // Brand Guidelines state
  const [brandKit, setBrandKit] = useState({
    primaryColor: '#22c55e',
    secondaryColor: '#2563eb',
    backgroundColor: '#f1f5f9',
    textColor: '#1e293b',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
    companyName: 'Pandora Rebels Esports',
    logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop',
    twitter: 'https://twitter.com/pandorarebels',
    discord: 'https://discord.gg/esports',
  });
  const [brandSaved, setBrandSaved] = useState(false);

  // Merge tags state
  const [mergeTags, setMergeTags] = useState([
    { id: '1', key: '{{firstName}}', desc: "Recipient's first name", fallback: 'Friend' },
    { id: '2', key: '{{lastName}}', desc: "Recipient's last name", fallback: '' },
    { id: '3', key: '{{email}}', desc: "Recipient's email address", fallback: 'subscriber@domain.com' },
    { id: '4', key: '{{company}}', desc: 'Company or organization name', fallback: 'Our Community' },
    { id: '5', key: '{{unsubscribeUrl}}', desc: 'One-click unsubscribe URL', fallback: '#' },
    { id: '6', key: '{{eventDate}}', desc: 'Campaign event date', fallback: '17 October' },
  ]);
  const [newTagKey, setNewTagKey] = useState('');
  const [newTagDesc, setNewTagDesc] = useState('');

  // Settings state
  const [defaultWidth, setDefaultWidth] = useState(600);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = tpl.category === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tpl.title.toLowerCase().includes(q) ||
      tpl.date.includes(q) ||
      tpl.id.includes(q) ||
      (tpl.document?.settings?.title && tpl.document.settings.title.toLowerCase().includes(q));

    const matchesCreativeCategory =
      creativeCategory === 'all' ||
      tpl.title.toLowerCase().includes(creativeCategory.toLowerCase()) ||
      (tpl.document?.settings?.title && tpl.document.settings.title.toLowerCase().includes(creativeCategory.toLowerCase()));

    return matchesCategory && matchesSearch && matchesCreativeCategory;
  });

  const handleDuplicate = (e: React.MouseEvent, tpl: DashboardTemplate) => {
    e.stopPropagation();
    const clone: DashboardTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      title: `${tpl.title} (Copy)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTemplates([clone, ...templates]);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const itemToDelete = templates.find((t) => t.id === id);
    if (itemToDelete) {
      setTrashList([itemToDelete, ...trashList]);
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleRestoreFromTrash = (item: DashboardTemplate) => {
    setTrashList(trashList.filter((t) => t.id !== item.id));
    setTemplates([item, ...templates]);
  };

  const handleAddProject = () => {
    if (newProjectInput.trim() && !projects.includes(newProjectInput.trim())) {
      setProjects([...projects, newProjectInput.trim()]);
      setActiveProject(newProjectInput.trim());
      setNewProjectInput('');
      setIsProjectDropdownOpen(false);
    }
  };

  const handleAddMergeTag = () => {
    if (newTagKey.trim()) {
      const formattedKey = newTagKey.startsWith('{{') ? newTagKey : `{{${newTagKey}}}`;
      setMergeTags([
        ...mergeTags,
        {
          id: `tag-${Date.now()}`,
          key: formattedKey,
          desc: newTagDesc.trim() || 'Custom variable',
          fallback: 'N/A',
        },
      ]);
      setNewTagKey('');
      setNewTagDesc('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        color: '#1e293b',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Bar: Open Source & Free Forever */}
      <header
        style={{
          height: '60px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 50,
        }}
      >
        {/* Left: Brand + Open Source Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            onClick={() => setActiveNav('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#22c55e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lightning size={18} weight="fill" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', letterSpacing: '-0.4px' }}>
              htmlo
            </span>
            <span
              style={{
                fontSize: '11px',
                color: '#15803d',
                backgroundColor: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              Open Source &bull; Free Forever
            </span>
          </div>
        </div>

        {/* Center: Search & Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* New Template CTA */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onNewTemplate}
              style={{
                backgroundColor: '#22c55e',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 1px 3px rgba(34, 197, 94, 0.3)',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
            >
              <PencilSimple size={15} weight="bold" />
              <span>New Template</span>
            </button>
          </div>

          {/* Search Input Box */}
          <div
            style={{
              position: 'relative',
              width: '320px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <MagnifyingGlass
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search templates, modules, messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '13px',
                outline: 'none',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {/* Right Header Status: 100% Free - No Account Required */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
            <span>No Account Needed &bull; 100% Free</span>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Body (Left Sidebar + Center Workable Content) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar Menu with Workable Tabs */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 12px',
            gap: '6px',
            overflowY: 'auto',
          }}
        >
          {/* Workable Workspace Project Dropdown */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <div
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {activeProject[0]}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{activeProject}</span>
              </div>
              <CaretDown size={14} color="#64748b" />
            </div>

            {/* Dropdown Menu */}
            {isProjectDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  zIndex: 60,
                  padding: '6px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, padding: '4px 8px' }}>
                  ACTIVE WORKSPACES
                </div>
                {projects.map((proj) => (
                  <div
                    key={proj}
                    onClick={() => {
                      setActiveProject(proj);
                      setIsProjectDropdownOpen(false);
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: activeProject === proj ? '#f1f5f9' : 'transparent',
                      color: activeProject === proj ? '#16a34a' : '#334155',
                      fontWeight: activeProject === proj ? 600 : 400,
                    }}
                  >
                    <span>{proj}</span>
                    {activeProject === proj && <Check size={13} color="#22c55e" />}
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0', paddingTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', padding: '4px' }}>
                    <input
                      type="text"
                      placeholder="New project name"
                      value={newProjectInput}
                      onChange={(e) => setNewProjectInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                      style={{
                        flex: 1,
                        padding: '4px 6px',
                        fontSize: '11.5px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleAddProject}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#22c55e',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Workable Sidebar Nav Items */}
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <House size={18} /> },
            { id: 'messages', label: 'Email Messages', icon: <EnvelopeSimple size={18} />, count: messages.length },
            { id: 'templates', label: 'Templates', icon: <FolderSimple size={18} />, count: templates.length },
            { id: 'modules', label: 'Modules', icon: <Browsers size={18} />, count: initialModules.length },
            { id: 'ai', label: 'AI Assistant', icon: <Sparkle size={18} />, badge: 'beta' },
            { id: 'brand', label: 'Brand Guidelines', icon: <Palette size={18} /> },
            { id: 'data', label: 'Data', icon: <Database size={18} /> },
            { id: 'trash', label: 'Trash', icon: <Trash size={18} />, count: trashList.length },
            { id: 'settings', label: 'Settings', icon: <Gear size={18} /> },
          ].map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  if (item.id === 'ai' && onOpenAiAssistant) {
                    onOpenAiAssistant();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#15803d' : '#475569',
                  backgroundColor: isActive ? '#dcfce7' : 'transparent',
                  border: isActive ? '1px solid #bbf7d0' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#bbf7d0' : '#f1f5f9',
                      color: isActive ? '#166534' : '#64748b',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Center Main Dashboard Content - Dynamically Renders Active Tab */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '28px 36px',
            position: 'relative',
            backgroundColor: '#f8fafc',
          }}
        >
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeNav === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                  Welcome to htmlo Studio
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  Your fully open-source, unrestricted HTML email creation suite.
                </p>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: 'Saved Templates', val: templates.length, icon: <FolderSimple size={22} color="#22c55e" />, link: 'templates' },
                  { label: 'Active Messages', val: messages.length, icon: <EnvelopeSimple size={22} color="#3b82f6" />, link: 'messages' },
                  { label: 'Reusable Modules', val: initialModules.length, icon: <Browsers size={22} color="#a855f7" />, link: 'modules' },
                  { label: 'Open Source Cost', val: '$0 / Free', icon: <ShieldCheck size={22} color="#10b981" />, sub: '100% Free Forever' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    onClick={() => stat.link && setActiveNav(stat.link)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '18px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      cursor: stat.link ? 'pointer' : 'default',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>{stat.label}</span>
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{stat.val}</div>
                    {stat.sub && <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>{stat.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Quick Actions Strip */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                  Quick Launch Shortcuts
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={onNewTemplate}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} weight="bold" />
                    Create Blank Template
                  </button>
                  <button
                    onClick={() => onOpenAiAssistant && onOpenAiAssistant()}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#f5f3ff',
                      color: '#7c3aed',
                      border: '1px solid #ddd6fe',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkle size={16} weight="fill" />
                    AI Floating Generator
                  </button>
                  <button
                    onClick={() => setActiveNav('templates')}
                    style={{
                      padding: '10px 18px',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <FolderSimple size={16} />
                    Browse Template Library
                  </button>
                </div>
              </div>

              {/* Recent Templates Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Recent Drafts</h3>
                  <button
                    onClick={() => setActiveNav('templates')}
                    style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    View All &rarr;
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {templates.slice(0, 3).map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => onOpenTemplate(tpl.document)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ height: '120px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tpl.thumbnailUrl ? (
                          <img src={tpl.thumbnailUrl} alt={tpl.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={32} color="#94a3b8" />
                        )}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#1e293b' }}>{tpl.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Edited {tpl.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL MESSAGES */}
          {activeNav === 'messages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                    Email Messages
                  </h1>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    Manage campaigns, drafts, and announcements ready for sending or export.
                  </p>
                </div>
                <button
                  onClick={onNewTemplate}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} weight="bold" />
                  New Message
                </button>
              </div>

              {/* Messages Table */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Message Title</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Subject Line</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600 }}>Last Edited</th>
                      <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>
                          {msg.title}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>
                          {msg.subject}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: msg.status === 'ready' ? '#dcfce7' : '#fef3c7',
                              color: msg.status === 'ready' ? '#15803d' : '#d97706',
                            }}
                          >
                            {msg.status === 'ready' ? 'Ready to Send' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '12px' }}>
                          {msg.lastEdited}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => onOpenTemplate(msg.document)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#22c55e',
                              color: '#ffffff',
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '12px',
                              marginRight: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            Open in Editor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES GALLERY */}
          {activeNav === 'templates' && (
            <div>
              {/* Top Stripo-accurate Controls Bar matching screenshot */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Left Tabs & Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Category Tabs: Saved / Basic / Pre-built */}
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: '#f1f5f9',
                      padding: '3px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {(['saved', 'basic', 'prebuilt'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setCreativeCategory('all');
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: activeTab === tab ? 600 : 500,
                          backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                          color: activeTab === tab ? '#0f172a' : '#64748b',
                          boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {tab === 'saved' ? 'Saved' : tab === 'basic' ? 'Basic' : 'Pre-built'}
                      </button>
                    ))}
                  </div>

                  {/* Sub-Filter Pills: All / Premium / Free */}
                  {activeTab === 'prebuilt' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                      <button
                        onClick={() => setPrebuiltSubFilter('all')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          border: prebuiltSubFilter === 'all' ? '1.5px solid #22c55e' : '1px solid #cbd5e1',
                          backgroundColor: prebuiltSubFilter === 'all' ? '#f0fdf4' : '#ffffff',
                          color: prebuiltSubFilter === 'all' ? '#15803d' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setPrebuiltSubFilter('premium')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          border: prebuiltSubFilter === 'premium' ? '1.5px solid #9333ea' : '1px solid #cbd5e1',
                          backgroundColor: prebuiltSubFilter === 'premium' ? '#faf5ff' : '#ffffff',
                          color: '#9333ea',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <CrownSimple size={14} weight="bold" color="#9333ea" />
                        Premium
                      </button>
                      <button
                        onClick={() => setPrebuiltSubFilter('free')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          border: prebuiltSubFilter === 'free' ? '1.5px solid #22c55e' : '1px solid #cbd5e1',
                          backgroundColor: prebuiltSubFilter === 'free' ? '#f0fdf4' : '#ffffff',
                          color: prebuiltSubFilter === 'free' ? '#15803d' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        Free
                      </button>

                      {/* Filter Icon */}
                      <button
                        title="Filter options"
                        style={{
                          padding: '7px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SlidersHorizontal size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Search by name with vivid green border + action icons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end', maxWidth: '520px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 14px 8px 34px',
                        fontSize: '13px',
                        borderRadius: '8px',
                        border: '2px solid #22c55e',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        color: '#0f172a',
                        boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.1)',
                      }}
                    />
                    <MagnifyingGlass
                      size={16}
                      color="#22c55e"
                      style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>

                  <button
                    title="Help & Guide"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Question size={18} />
                  </button>

                  <button
                    title="Notifications"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Bell size={18} />
                  </button>
                </div>
              </div>

              {/* Subheading + Count Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                    {activeTab === 'saved' ? 'Saved Templates' : activeTab === 'basic' ? 'Basic Templates' : 'Pre-built Templates'}
                  </h2>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {filteredTemplates.length}
                  </span>
                </div>

                {/* Creative category pills when Pre-built is active */}
                {activeTab === 'prebuilt' && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'All 50' },
                      { key: 'community', label: 'Community & Charity' },
                      { key: 'ecommerce', label: 'E-Commerce' },
                      { key: 'saas', label: 'SaaS & Tech' },
                      { key: 'events', label: 'Events & Shows' },
                      { key: 'newsletter', label: 'Newsletters' },
                      { key: 'creative', label: 'Editorial & Design' },
                    ].map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setCreativeCategory(cat.key)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: creativeCategory === cat.key ? 600 : 400,
                          backgroundColor: creativeCategory === cat.key ? '#22c55e' : '#ffffff',
                          color: creativeCategory === cat.key ? '#ffffff' : '#64748b',
                          border: creativeCategory === cat.key ? '1px solid #22c55e' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5-Column Template Cards Grid matching reference screenshot */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '16px',
                }}
              >
                {filteredTemplates.map((tpl) => {
                  const isHovered = hoveredCardId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onMouseEnter={() => setHoveredCardId(tpl.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      onClick={() => onOpenTemplate(tpl.document)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: isHovered ? '1.5px solid #22c55e' : '1px solid #e2e8f0',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: isHovered ? '0 12px 28px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.03)',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '340px',
                      }}
                    >
                      {/* Thumbnail Container */}
                      <div
                        style={{
                          flex: 1,
                          minHeight: '260px',
                          backgroundColor: '#f8fafc',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {tpl.thumbnailUrl ? (
                          <img
                            src={tpl.thumbnailUrl}
                            alt={tpl.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#94a3b8',
                            }}
                          >
                            <ImageIcon size={44} color="#22c55e" />
                            <span style={{ fontSize: '12px' }}>Blank Canvas</span>
                          </div>
                        )}

                        {/* Hover Overlay with Action Buttons */}
                        {isHovered && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(15, 23, 42, 0.55)',
                              backdropFilter: 'blur(2px)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px',
                              padding: '16px',
                              zIndex: 10,
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTemplate(tpl.document);
                              }}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                backgroundColor: '#22c55e',
                                color: '#ffffff',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                              }}
                            >
                              <PencilSimple size={15} weight="bold" />
                              Edit in Studio
                            </button>

                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                              <button
                                onClick={(e) => handleDuplicate(e, tpl)}
                                title="Duplicate Template"
                                style={{
                                  flex: 1,
                                  padding: '7px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  color: '#334155',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Copy size={13} />
                                Duplicate
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, tpl.id)}
                                title="Move to Trash"
                                style={{
                                  padding: '7px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                  color: '#ffffff',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Floating bottom label pill matching screenshot */}
                      <div
                        style={{
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ffffff',
                          borderTop: '1px solid #f1f5f9',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#1e293b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%',
                          }}
                          title={tpl.title}
                        >
                          {tpl.title}
                        </div>
                        {/* Purple Crown Icon underneath title matching screenshot */}
                        <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CrownSimple size={15} weight="bold" color="#9333ea" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MODULES LIBRARY */}
          {activeNav === 'modules' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Reusable Email Modules
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                  Pre-designed structural blocks ready to drop into any email design.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                {initialModules.map((mod) => (
                  <div
                    key={mod.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ height: '140px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                      <img src={mod.previewImg} alt={mod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{mod.name}</span>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '2px 6px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px', fontWeight: 700 }}>
                          {mod.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 14px 0', lineHeight: 1.5 }}>
                        {mod.description}
                      </p>
                      <button
                        onClick={onNewTemplate}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Use Module in Studio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI ASSISTANT PORTAL */}
          {activeNav === 'ai' && (
            <div style={{ maxWidth: '720px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                  AI Email Studio Assistant
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                  Generate complete responsive HTML email designs in seconds with live floating cursors.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkle size={20} color="#7c3aed" weight="fill" />
                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>Interactive AI Generator</span>
                </div>

                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                  Click below to launch the full AI Assistant. Watch animated floating AI cursors build headers, hero banners, product grids, and action buttons live in front of you.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {[
                    'Core Member Recruitment Email',
                    'Black Friday 50% Off Flash Sale',
                    'Weekly Engineering & Design Digest',
                    'Conference Keynote Invitation',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenAiAssistant && onOpenAiAssistant()}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        color: '#334155',
                        cursor: 'pointer',
                      }}
                    >
                      &bull; {preset}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onOpenAiAssistant && onOpenAiAssistant()}
                  style={{
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkle size={16} weight="fill" />
                  Launch AI Assistant Window
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: BRAND GUIDELINES */}
          {activeNav === 'brand' && (
            <div style={{ maxWidth: '680px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Brand Design System
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                  Configure your brand colors, typography, and default logos for new emails.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                {/* Brand Colors */}
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Brand Colors</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                  {[
                    { label: 'Primary Accent', key: 'primaryColor' },
                    { label: 'Secondary Action', key: 'secondaryColor' },
                    { label: 'Email Background', key: 'backgroundColor' },
                  ].map((col) => (
                    <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{col.label}</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '6px' }}>
                        <input
                          type="color"
                          value={(brandKit as any)[col.key]}
                          onChange={(e) => setBrandKit({ ...brandKit, [col.key]: e.target.value })}
                          style={{ border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{(brandKit as any)[col.key]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Company Name & Logo */}
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>Company & Logo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Brand Name</label>
                    <input
                      type="text"
                      value={brandKit.companyName}
                      onChange={(e) => setBrandKit({ ...brandKit, companyName: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Logo Image URL</label>
                    <input
                      type="text"
                      value={brandKit.logoUrl}
                      onChange={(e) => setBrandKit({ ...brandKit, logoUrl: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBrandSaved(true);
                    setTimeout(() => setBrandSaved(false), 2500);
                  }}
                  style={{
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {brandSaved ? 'Saved to Brand System!' : 'Save Brand Guidelines'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: DATA & MERGE TAGS */}
          {activeNav === 'data' && (
            <div style={{ maxWidth: '750px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Data & Merge Tags
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                  Manage personalization variables like names, companies, and custom tokens.
                </p>
              </div>

              {/* Tags Table */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '10px 16px' }}>Tag Variable</th>
                      <th style={{ padding: '10px 16px' }}>Description</th>
                      <th style={{ padding: '10px 16px' }}>Fallback Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergeTags.map((tag) => (
                      <tr key={tag.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                          {tag.key}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                          {tag.desc}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {tag.fallback}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Custom Tag Form */}
              <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600 }}>Add Custom Merge Variable</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. {{accountTier}}"
                    value={newTagKey}
                    onChange={(e) => setNewTagKey(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTagDesc}
                    onChange={(e) => setNewTagDesc(e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  />
                  <button
                    onClick={handleAddMergeTag}
                    style={{
                      padding: '7px 16px',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: TRASH */}
          {activeNav === 'trash' && (
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                    Trash
                  </h1>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                    Items moved to trash can be restored back to your saved templates.
                  </p>
                </div>
                {trashList.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Permanently delete all items in trash?')) setTrashList([]);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Empty Trash
                  </button>
                )}
              </div>

              {trashList.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <Trash size={40} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#64748b' }}>Trash is empty</div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Deleted templates will appear here until permanently cleared.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trashList.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#1e293b' }}>{item.title}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Deleted draft &bull; {item.date}</div>
                      </div>
                      <button
                        onClick={() => handleRestoreFromTrash(item)}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeNav === 'settings' && (
            <div style={{ maxWidth: '680px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                  Studio Settings & Preferences
                </h1>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                  Customize your canvas defaults, viewports, and local storage rules.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Default Content Width */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                    Default Canvas Content Width
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[600, 640, 700].map((w) => (
                      <button
                        key={w}
                        onClick={() => setDefaultWidth(w)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: defaultWidth === w ? 600 : 500,
                          backgroundColor: defaultWidth === w ? '#22c55e' : '#f1f5f9',
                          color: defaultWidth === w ? '#ffffff' : '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        {w}px {w === 600 ? '(Standard Email)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-save */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Auto-Save Drafts to LocalStorage</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Saves changes automatically without hitting save button</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#22c55e', cursor: 'pointer' }}
                  />
                </div>

                {/* Open Source Status */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <ShieldCheck size={18} color="#16a34a" weight="fill" />
                    <span style={{ fontWeight: 600, fontSize: '13.5px', color: '#1e293b' }}>
                      htmlo Open Source Core &bull; MIT Licensed
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    This software is 100% free and open source. There are no paid tiers, no login gates, no subscriptions, and all features are permanently unrestricted for all creators.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
