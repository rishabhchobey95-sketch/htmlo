import { EmailDocument } from '../types/editor';

export const initialEmailDoc: EmailDocument = {
  version: '1.0.0',
  settings: {
    title: 'Welcome to htmlo Mail Studio',
    preheader: 'Your free, modern HTML email editor with bulletproof Outlook and mobile support.',
    contentWidth: 600,
    backgroundColor: '#f1f5f9',
    contentBackgroundColor: '#ffffff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    primaryColor: '#2563eb',
    textColor: '#1e293b',
    linkColor: '#2563eb',
    underlineLinks: false,
    responsive: true,
  },
  stripes: [
    // Header Stripe (Clean White with subtle border like Stripo)
    {
      id: 'stripe-header',
      stripeType: 'header',
      backgroundColor: '#ffffff',
      padding: { top: 18, right: 28, bottom: 18, left: 28 },
      structures: [
        {
          id: 'struct-header-nav',
          stackOnMobile: true,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          columns: [
            {
              id: 'col-logo',
              widthPercent: 40,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              blocks: [
                {
                  id: 'block-brand',
                  type: 'text',
                  align: 'left',
                  padding: { top: 4, right: 0, bottom: 4, left: 0 },
                  props: {
                    content: '<h2 style="margin:0;font-size:20px;color:#1e293b;font-weight:700;letter-spacing:-0.4px;">⚡ htmlo</h2>',
                    color: '#1e293b',
                    fontSize: 20,
                  },
                },
              ],
            },
            {
              id: 'col-nav-links',
              widthPercent: 60,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              blocks: [
                {
                  id: 'block-menu',
                  type: 'menu',
                  align: 'right',
                  padding: { top: 6, right: 0, bottom: 6, left: 0 },
                  props: {
                    menuItems: [
                      { id: '1', label: 'Templates', url: '#' },
                      { id: '2', label: 'Docs', url: '#' },
                      { id: '3', label: 'Export', url: '#' },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Hero Banner Stripe
    {
      id: 'stripe-hero',
      stripeType: 'content',
      backgroundColor: '#ffffff',
      padding: { top: 36, right: 32, bottom: 32, left: 32 },
      structures: [
        {
          id: 'struct-hero',
          stackOnMobile: true,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          columns: [
            {
              id: 'col-hero-main',
              widthPercent: 100,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              blocks: [
                {
                  id: 'block-hero-pill',
                  type: 'text',
                  align: 'center',
                  padding: { top: 0, right: 0, bottom: 14, left: 0 },
                  props: {
                    content: '<span style="display:inline-block;padding:5px 14px;background-color:#eff6ff;color:#2563eb;font-weight:600;font-size:11px;border-radius:9999px;letter-spacing:0.8px;text-transform:uppercase;">Made with ❤️ by Rishabh Chobey • Personal Use Only</span>',
                  },
                },
                {
                  id: 'block-hero-title',
                  type: 'text',
                  align: 'center',
                  padding: { top: 0, right: 0, bottom: 14, left: 0 },
                  props: {
                    content: '<h1 style="margin:0;font-size:28px;font-weight:700;color:#1e293b;line-height:1.25;letter-spacing:-0.5px;">Design Flawless Emails Without The Code Headaches</h1>',
                    fontSize: 28,
                    color: '#1e293b',
                  },
                },
                {
                  id: 'block-hero-subtitle',
                  type: 'text',
                  align: 'center',
                  padding: { top: 0, right: 20, bottom: 20, left: 20 },
                  props: {
                    content: '<p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">Build responsive emails visually with drag-and-drop ease, full Outlook MSO support, live split code preview, and zero paywalls.</p>',
                    fontSize: 15,
                    color: '#64748b',
                  },
                },
                {
                  id: 'block-hero-cta',
                  type: 'button',
                  align: 'center',
                  padding: { top: 8, right: 0, bottom: 20, left: 0 },
                  props: {
                    text: 'Start Building Template →',
                    url: '#',
                    buttonColor: '#2563eb',
                    textColor: '#ffffff',
                    borderRadius: 6,
                    height: 44,
                  },
                },
                {
                  id: 'block-hero-img',
                  type: 'image',
                  align: 'center',
                  padding: { top: 12, right: 0, bottom: 12, left: 0 },
                  props: {
                    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80',
                    alt: 'htmlo email studio mockup',
                    imageWidth: 'full',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // 2-Column Feature Stripe
    {
      id: 'stripe-features',
      stripeType: 'content',
      backgroundColor: '#f8fafc',
      padding: { top: 28, right: 24, bottom: 28, left: 24 },
      structures: [
        {
          id: 'struct-features-grid',
          stackOnMobile: true,
          padding: { top: 8, right: 0, bottom: 8, left: 0 },
          columns: [
            {
              id: 'col-feat-1',
              widthPercent: 50,
              backgroundColor: '#ffffff',
              padding: { top: 20, right: 18, bottom: 20, left: 18 },
              blocks: [
                {
                  id: 'block-feat-1-title',
                  type: 'text',
                  align: 'left',
                  padding: { top: 0, right: 0, bottom: 6, left: 0 },
                  props: {
                    content: '<h3 style="margin:0;font-size:16px;color:#1e293b;font-weight:600;">⚡ Dual-Mode Editing</h3>',
                  },
                },
                {
                  id: 'block-feat-1-desc',
                  type: 'text',
                  align: 'left',
                  padding: { top: 0, right: 0, bottom: 8, left: 0 },
                  props: {
                    content: '<p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Switch between our visual canvas and raw HTML code instantly with live 2-way synchronization.</p>',
                  },
                },
              ],
            },
            {
              id: 'col-feat-2',
              widthPercent: 50,
              backgroundColor: '#ffffff',
              padding: { top: 20, right: 18, bottom: 20, left: 18 },
              blocks: [
                {
                  id: 'block-feat-2-title',
                  type: 'text',
                  align: 'left',
                  padding: { top: 0, right: 0, bottom: 6, left: 0 },
                  props: {
                    content: '<h3 style="margin:0;font-size:16px;color:#1e293b;font-weight:600;">🛡️ Bulletproof Outlook</h3>',
                  },
                },
                {
                  id: 'block-feat-2-desc',
                  type: 'text',
                  align: 'left',
                  padding: { top: 0, right: 0, bottom: 8, left: 0 },
                  props: {
                    content: '<p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">VML-backed buttons, 96 DPI Office document tags, and ghost tables that never break in Outlook 2013-2021.</p>',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Footer Stripe
    {
      id: 'stripe-footer',
      stripeType: 'footer',
      backgroundColor: '#f1f5f9',
      padding: { top: 28, right: 24, bottom: 28, left: 24 },
      structures: [
        {
          id: 'struct-footer',
          stackOnMobile: true,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          columns: [
            {
              id: 'col-footer-content',
              widthPercent: 100,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              blocks: [
                {
                  id: 'block-footer-social',
                  type: 'social',
                  align: 'center',
                  padding: { top: 4, right: 0, bottom: 12, left: 0 },
                  props: {
                    iconSize: 24,
                    iconSpacing: 14,
                  },
                },
                {
                  id: 'block-footer-text',
                  type: 'text',
                  align: 'center',
                  padding: { top: 0, right: 0, bottom: 6, left: 0 },
                  props: {
                    content: '<p style="margin:0;font-size:12px;color:#64748b;">© 2026 htmlo. Made with ❤️ by Rishabh Chobey • Personal Use Only (All Rights Reserved).</p>',
                  },
                },
                {
                  id: 'block-footer-unsubscribe',
                  type: 'text',
                  align: 'center',
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  props: {
                    content: '<p style="margin:0;font-size:11px;color:#94a3b8;"><a href="#" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> · <a href="#" style="color:#64748b;text-decoration:underline;">View in Browser</a></p>',
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
