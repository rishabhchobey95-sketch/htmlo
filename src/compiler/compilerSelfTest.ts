import { EmailCompiler } from './EmailCompiler';
import { EmailDocument, StripeNode, StructureNode, ContainerNode, BlockNode } from '../types/editor';

export interface CompilerTestResult {
  passed: boolean;
  totalChecks: number;
  passedChecks: number;
  errors: string[];
  warnings: string[];
  stats: {
    htmlSize: number;
    stripeCount: number;
    structureCount: number;
    blockCount: number;
    msoCommentCount: number;
  };
}

/**
 * Builds an exhaustive stress-test AST covering all 4 Stripe types,
 * 1-4 column Structures with mobile stacking options, and all 11 Block types.
 */
export function createStressTestDocument(): EmailDocument {
  const textBlock: BlockNode = {
    id: 'block_text_1',
    type: 'text',
    align: 'center',
    padding: { top: 12, right: 16, bottom: 12, left: 16 },
    props: {
      content: '<h1>Special Announcement</h1><p>Welcome to our bulletproof newsletter.</p>',
      fontSize: 20,
      color: '#0f172a',
      lineHeight: 1.4,
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 'bold',
      headingTag: 'h1',
      anchorLink: true,
      anchorId: 'announcement-head',
    },
  };

  const buttonBlock: BlockNode = {
    id: 'block_btn_1',
    type: 'button',
    align: 'center',
    padding: { top: 16, right: 20, bottom: 16, left: 20 },
    props: {
      text: 'Explore Launchpad',
      url: 'https://example.com/launch',
      buttonColor: '#4f46e5',
      textColor: '#ffffff',
      borderRadius: 8,
      width: 220,
      height: 48,
    },
  };

  const imageBlock: BlockNode = {
    id: 'block_img_1',
    type: 'image',
    align: 'center',
    padding: { top: 10, right: 10, bottom: 10, left: 10 },
    props: {
      src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop',
      alt: 'Atmospheric hero image',
      linkUrl: 'https://example.com/hero',
      imageWidth: 560,
    },
  };

  const spacerBlock: BlockNode = {
    id: 'block_spacer_1',
    type: 'spacer',
    align: 'center',
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    props: {
      spacerHeight: 32,
    },
  };

  const dividerBlock: BlockNode = {
    id: 'block_div_1',
    type: 'divider',
    align: 'center',
    padding: { top: 8, right: 0, bottom: 8, left: 0 },
    props: {
      dividerColor: '#cbd5e1',
      dividerHeight: 2,
      dividerStyle: 'solid',
    },
  };

  const socialBlock: BlockNode = {
    id: 'block_soc_1',
    type: 'social',
    align: 'center',
    padding: { top: 12, right: 0, bottom: 12, left: 0 },
    props: {
      networks: [
        { id: '1', network: 'twitter', url: 'https://x.com/htmlo' },
        { id: '2', network: 'github', url: 'https://github.com/htmlo' },
        { id: '3', network: 'linkedin', url: 'https://linkedin.com/company/htmlo' },
      ],
      iconSize: 24,
      iconSpacing: 14,
    },
  };

  const videoBlock: BlockNode = {
    id: 'block_vid_1',
    type: 'video',
    align: 'center',
    padding: { top: 10, right: 0, bottom: 10, left: 0 },
    props: {
      videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      videoThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      videoTitle: 'Product Keynote & Architecture Demo',
    },
  };

  const htmlBlock: BlockNode = {
    id: 'block_html_1',
    type: 'html',
    align: 'left',
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    props: {
      htmlCode: '<div style="background:#e0e7ff;padding:12px;border-left:4px solid #4f46e5;"><p style="margin:0;font-size:13px;color:#3730a3;"><strong>Pro-Tip:</strong> High deliverability guaranteed.</p></div>',
    },
  };

  const menuBlock: BlockNode = {
    id: 'block_menu_1',
    type: 'menu',
    align: 'center',
    padding: { top: 10, right: 0, bottom: 10, left: 0 },
    props: {
      menuItems: [
        { id: 'm1', label: 'Overview', url: 'https://example.com/overview' },
        { id: 'm2', label: 'Docs', url: 'https://example.com/docs' },
        { id: 'm3', label: 'Changelog', url: 'https://example.com/changelog' },
      ],
    },
  };

  const timerBlock: BlockNode = {
    id: 'block_timer_1',
    type: 'timer',
    align: 'center',
    padding: { top: 14, right: 14, bottom: 14, left: 14 },
    props: {
      targetDate: '48h 15m 30s',
      timerBackground: '#0f172a',
      timerTextColor: '#38bdf8',
    },
  };

  const shapeBlock: BlockNode = {
    id: 'block_shape_1',
    type: 'shape',
    align: 'center',
    padding: { top: 10, right: 0, bottom: 10, left: 0 },
    props: {
      shapeType: 'badge',
      shapeWidth: 'full',
      shapeHeight: 46,
      fillColor: '#f0fdf4',
      strokeColor: '#16a34a',
      strokeWidth: 2,
      strokeStyle: 'solid',
      shapeText: 'LIMITED EDITION // 2026 RELEASE',
      shapeTextColor: '#15803d',
    },
  };

  // Structures
  const singleColContainer: ContainerNode = {
    id: 'cnt_single',
    widthPercent: 100,
    backgroundColor: '#ffffff',
    padding: { top: 16, right: 24, bottom: 16, left: 24 },
    blocks: [textBlock, imageBlock, buttonBlock],
  };

  const headerStructure: StructureNode = {
    id: 'struct_header',
    columns: [
      {
        id: 'cnt_header',
        widthPercent: 100,
        padding: { top: 12, right: 16, bottom: 12, left: 16 },
        blocks: [menuBlock],
      },
    ],
    stackOnMobile: false,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  };

  const mainStructure: StructureNode = {
    id: 'struct_main',
    columns: [singleColContainer],
    stackOnMobile: true,
    padding: { top: 8, right: 0, bottom: 8, left: 0 },
  };

  const twoColStructureReverse: StructureNode = {
    id: 'struct_2col_rev',
    columns: [
      {
        id: 'cnt_col_left',
        widthPercent: 50,
        padding: { top: 12, right: 12, bottom: 12, left: 12 },
        blocks: [videoBlock, timerBlock],
      },
      {
        id: 'cnt_col_right',
        widthPercent: 50,
        padding: { top: 12, right: 12, bottom: 12, left: 12 },
        blocks: [shapeBlock, htmlBlock],
      },
    ],
    stackOnMobile: true,
    reverseStackMobile: true,
    padding: { top: 12, right: 0, bottom: 12, left: 0 },
  };

  const threeColStructure: StructureNode = {
    id: 'struct_3col',
    columns: [
      {
        id: 'cnt_3col_1',
        widthPercent: 33.33,
        padding: { top: 8, right: 8, bottom: 8, left: 8 },
        blocks: [spacerBlock],
      },
      {
        id: 'cnt_3col_2',
        widthPercent: 33.33,
        padding: { top: 8, right: 8, bottom: 8, left: 8 },
        blocks: [dividerBlock],
      },
      {
        id: 'cnt_3col_3',
        widthPercent: 33.34,
        padding: { top: 8, right: 8, bottom: 8, left: 8 },
        blocks: [socialBlock],
      },
    ],
    stackOnMobile: true,
    padding: { top: 8, right: 0, bottom: 8, left: 0 },
  };

  const stripes: StripeNode[] = [
    {
      id: 'stripe_header',
      stripeType: 'header',
      backgroundColor: '#f8fafc',
      padding: { top: 16, right: 0, bottom: 16, left: 0 },
      structures: [headerStructure],
    },
    {
      id: 'stripe_hero',
      stripeType: 'content',
      backgroundColor: '#0f172a',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop',
      padding: { top: 24, right: 0, bottom: 24, left: 0 },
      structures: [mainStructure],
    },
    {
      id: 'stripe_features',
      stripeType: 'content',
      backgroundColor: '#ffffff',
      padding: { top: 20, right: 0, bottom: 20, left: 0 },
      structures: [twoColStructureReverse, threeColStructure],
    },
    {
      id: 'stripe_footer',
      stripeType: 'footer',
      backgroundColor: '#f1f5f9',
      padding: { top: 20, right: 0, bottom: 20, left: 0 },
      structures: [
        {
          id: 'struct_footer',
          columns: [
            {
              id: 'cnt_footer',
              widthPercent: 100,
              padding: { top: 12, right: 12, bottom: 12, left: 12 },
              blocks: [dividerBlock, socialBlock],
            },
          ],
          stackOnMobile: true,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        },
      ],
    },
  ];

  return {
    version: '2.0.0',
    settings: {
      title: 'htmlo Comprehensive Compiler Stress Test',
      preheader: 'Exhaustive verification of MSO VML, zero-width preheader, and 11 block types.',
      contentWidth: 600,
      backgroundColor: '#e2e8f0',
      contentBackgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      primaryColor: '#4f46e5',
      textColor: '#0f172a',
      linkColor: '#4f46e5',
      underlineLinks: true,
      responsive: true,
      customCss: '.custom-accent { font-weight: 700; color: #4f46e5; }',
    },
    stripes,
  };
}

/**
 * Runs programmatic assertions against compiled output.
 */
export function runCompilerSelfTest(): CompilerTestResult {
  const doc = createStressTestDocument();
  const errors: string[] = [];
  const warnings: string[] = [];

  let html = '';
  try {
    html = EmailCompiler.compile(doc);
  } catch (err: any) {
    return {
      passed: false,
      totalChecks: 1,
      passedChecks: 0,
      errors: [`Compilation exception thrown: ${err?.message || err}`],
      warnings: [],
      stats: { htmlSize: 0, stripeCount: 0, structureCount: 0, blockCount: 0, msoCommentCount: 0 },
    };
  }

  const checks: Array<{ name: string; test: () => boolean; errorMsg: string }> = [
    {
      name: 'Valid XHTML Transitional DOCTYPE',
      test: () => html.includes('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"'),
      errorMsg: 'Missing or malformed XHTML Transitional DOCTYPE.',
    },
    {
      name: 'VML and MSO XML Namespaces',
      test: () =>
        html.includes('xmlns:v="urn:schemas-microsoft-com:vml"') &&
        html.includes('xmlns:o="urn:schemas-microsoft-com:office:office"'),
      errorMsg: 'Missing VML or Office namespaces in <html> tag.',
    },
    {
      name: 'Zero NaN, undefined, null or [object Object]',
      test: () => {
        const invalidTokens = ['NaN', 'undefined', 'null', '[object Object]'];
        for (const token of invalidTokens) {
          if (html.includes(token)) {
            // Check if token is just part of legitimate text (e.g. "announcement")
            const rx = new RegExp(`\\b${token}\\b`);
            if (rx.test(html)) return false;
          }
        }
        return true;
      },
      errorMsg: 'Compiled HTML contains corrupt literal tokens (NaN, undefined, null, [object Object]).',
    },
    {
      name: 'Balanced MSO Conditionals',
      test: () => {
        const msoOpens = (html.match(/<!--\[if/g) || []).length;
        const msoCloses = (html.match(/<!\[endif\]-->/g) || []).length;
        return msoOpens === msoCloses && msoOpens > 0;
      },
      errorMsg: 'Mismatched MSO conditional tags: count of <!--[if does not match <![endif]-->.',
    },
    {
      name: 'Zero-Width Preheader Hack with &zwnj;&nbsp; padding',
      test: () =>
        html.includes('mso-hide: all;') &&
        html.includes('&zwnj;&nbsp;') &&
        html.includes('Exhaustive verification of MSO VML'),
      errorMsg: 'Zero-width preheader hack missing or not properly padded with non-breaking zero-width entities.',
    },
    {
      name: 'VML Roundrect for Buttons',
      test: () => html.includes('<v:roundrect') && html.includes('arcsize='),
      errorMsg: 'VML <v:roundrect> missing for bulletproof Outlook CTA button support.',
    },
    {
      name: 'Mobile Breakpoint Media Query',
      test: () => html.includes('@media only screen and (max-width: 600px)'),
      errorMsg: 'Missing 600px mobile responsive CSS media query.',
    },
    {
      name: 'All 11 Block Types Rendered',
      test: () =>
        html.includes('Special Announcement') && // text
        html.includes('Atmospheric hero image') && // image
        html.includes('Explore Launchpad') && // button
        html.includes('height: 32px') && // spacer
        html.includes('border-top: 2px solid') && // divider
        html.includes('x.com/htmlo') && // social
        html.includes('Product Keynote') && // video
        html.includes('Pro-Tip:') && // html
        html.includes('Changelog') && // menu
        html.includes('48h 15m 30s') && // timer
        html.includes('LIMITED EDITION') // shape
      ,
      errorMsg: 'One or more of the 11 block types failed to render into the compiled HTML.',
    },
    {
      name: 'Outlook OfficeDocumentSettings Pixel Ratio',
      test: () => html.includes('<o:PixelsPerInch>96</o:PixelsPerInch>'),
      errorMsg: 'Missing OfficeDocumentSettings 96 DPI override for Windows high-DPI scaling.',
    },
  ];

  let passedChecks = 0;
  for (const check of checks) {
    if (check.test()) {
      passedChecks++;
    } else {
      errors.push(`${check.name}: ${check.errorMsg}`);
    }
  }

  // Count stats
  let totalBlocks = 0;
  let totalStructures = 0;
  doc.stripes.forEach((s) => {
    totalStructures += s.structures.length;
    s.structures.forEach((st) => {
      st.columns.forEach((c) => {
        totalBlocks += c.blocks.length;
      });
    });
  });

  const msoCount = (html.match(/<!--\[if/g) || []).length;

  return {
    passed: errors.length === 0,
    totalChecks: checks.length,
    passedChecks,
    errors,
    warnings,
    stats: {
      htmlSize: html.length,
      stripeCount: doc.stripes.length,
      structureCount: totalStructures,
      blockCount: totalBlocks,
      msoCommentCount: msoCount,
    },
  };
}

const proc = (globalThis as unknown as { process?: { argv?: string[]; exit?: (code: number) => void } }).process;
if (typeof proc !== 'undefined' && proc.argv && proc.argv[1] && proc.argv[1].includes('compilerSelfTest')) {
  const result = runCompilerSelfTest();
  console.log(`[COMPILER SELF-TEST] Passed: ${result.passed} (${result.passedChecks}/${result.totalChecks} checks)`);
  console.log(`[STATS] HTML Size: ${result.stats.htmlSize} bytes, Stripes: ${result.stats.stripeCount}, Structures: ${result.stats.structureCount}, Blocks: ${result.stats.blockCount}, MSO comments: ${result.stats.msoCommentCount}`);
  if (result.errors.length > 0 && proc.exit) {
    console.error('[ERRORS]', result.errors);
    proc.exit(1);
  }
}
