import { EmailDocument, StripeNode, StructureNode, ContainerNode, BlockNode } from '../types/editor';

/**
 * htmlo Bulletproof Email Compiler Engine
 * Generates RFC 5322 & Outlook MSO/VML compliant responsive XHTML tables.
 */
export class EmailCompiler {
  public static compile(doc: EmailDocument): string {
    const { settings, stripes } = doc;
    const contentWidth = settings.contentWidth || 600;

    const renderedStripes = stripes.map((stripe) => this.renderStripe(stripe, contentWidth, settings)).join('\n');

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="generator" content="htmlo Email Studio - Made with love by Rishabh Chobey" />
  <meta name="author" content="Rishabh Chobey" />
  <!-- Made with love by Rishabh Chobey. Only for personal use, not for commercial use. All rights reserved to Rishabh Chobey. -->
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${this.escapeHtml(settings.title || 'Email')}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style type="text/css">
    /* Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${settings.backgroundColor}; }

    /* Responsive Mobile CSS */
    @media only screen and (max-width: 600px) {
      .htmlo-wrapper { width: 100% !important; }
      .htmlo-content { width: 100% !important; max-width: 100% !important; }
      .htmlo-column { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .htmlo-hide-mobile { display: none !important; }
      .htmlo-center-mobile { text-align: center !important; }
      .htmlo-fluid-img { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .htmlo-stack-reverse { display: flex !important; flex-direction: column-reverse !important; }
    }

    @media only screen and (min-width: 601px) {
      .htmlo-hide-desktop { display: none !important; }
    }

    /* Dark Mode Inversion Hooks */
    @media (prefers-color-scheme: dark) {
      .htmlo-dark-bg { background-color: #0f172a !important; }
      .htmlo-dark-text { color: #f8fafc !important; }
    }
    [data-ogsc] .htmlo-dark-bg { background-color: #0f172a !important; }
    [data-ogsc] .htmlo-dark-text { color: #f8fafc !important; }

    ${settings.customCss ? `\n    /* User Custom Email Styles */\n    ${settings.customCss}\n` : ''}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${settings.backgroundColor}; font-family: ${settings.fontFamily}; color: ${settings.textColor}; -webkit-font-smoothing: antialiased;">
  <!-- Zero-width preheader snippet -->
  ${this.renderPreheader(settings.preheader)}

  <!-- Main Canvas Table -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="htmlo-wrapper" style="background-color: ${settings.backgroundColor}; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 0; margin: 0;">
        ${renderedStripes}
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private static renderPreheader(preheader: string): string {
    if (!preheader) return '';
    const safePreheader = this.escapeHtml(preheader);
    // Add zero-width non-breaking spaces so trailing text is not shown in client preview
    const padding = '&zwnj;&nbsp;'.repeat(60);
    return `<div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${safePreheader} ${padding}
  </div>`;
  }

  private static renderStripe(stripe: StripeNode, contentWidth: number, settings: any): string {
    const bg = stripe.backgroundColor || 'transparent';
    const bgImage = stripe.backgroundImageUrl ? `background-image: url('${stripe.backgroundImageUrl}'); background-repeat: no-repeat; background-position: center; background-size: cover;` : '';
    const padding = `${stripe.padding.top}px ${stripe.padding.right}px ${stripe.padding.bottom}px ${stripe.padding.left}px`;

    const renderedStructures = stripe.structures.map((s) => this.renderStructure(s, contentWidth, settings)).join('\n');

    const vmlStripeBgOpen = stripe.backgroundImageUrl
      ? `<!--[if gte mso 9]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:${contentWidth}px;">
        <v:fill type="frame" src="${stripe.backgroundImageUrl}" color="${bg}" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->`
      : '';

    const vmlStripeBgClose = stripe.backgroundImageUrl
      ? `<!--[if gte mso 9]>
        </v:textbox>
      </v:rect>
      <![endif]-->`
      : '';

    return `
    <!-- Stripe: ${stripe.stripeType} -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${bg}; ${bgImage} width: 100%;">
      <tr>
        <td align="center" style="padding: ${padding};">
          ${vmlStripeBgOpen}
          <!--[if (gte mso 9)|(IE)]>
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="${contentWidth}" align="center">
          <tr>
          <td>
          <![endif]-->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${contentWidth}" class="htmlo-content" style="max-width: ${contentWidth}px; width: 100%; margin: 0 auto; background-color: ${settings.contentBackgroundColor};">
            ${renderedStructures}
          </table>
          <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
          ${vmlStripeBgClose}
        </td>
      </tr>
    </table>`;
  }

  private static renderStructure(structure: StructureNode, contentWidth: number, settings: any): string {
    const bg = structure.backgroundColor ? `background-color: ${structure.backgroundColor};` : '';
    const padding = `${structure.padding.top}px ${structure.padding.right}px ${structure.padding.bottom}px ${structure.padding.left}px`;
    const colCount = structure.columns.length || 1;
    const isReverse = Boolean(structure.reverseStackMobile);
    const dirAttr = isReverse ? ' dir="rtl"' : '';
    const reverseClass = isReverse ? ' htmlo-stack-reverse' : '';

    const renderedColumns = structure.columns
      .map((col, idx) => {
        const colWidthPx = Math.floor((contentWidth * (col.widthPercent || 100 / colCount)) / 100);
        return this.renderContainer(col, colWidthPx, settings, idx, colCount, isReverse);
      })
      .join('\n');

    return `
      <!-- Structure -->
      <tr>
        <td style="padding: ${padding}; ${bg}">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"${dirAttr} class="${reverseClass}">
            <tr>
              ${renderedColumns}
            </tr>
          </table>
        </td>
      </tr>`;
  }

  private static renderContainer(col: ContainerNode, widthPx: number, settings: any, colIdx: number, totalCols: number, isReverse: boolean = false): string {
    const bg = col.backgroundColor ? `background-color: ${col.backgroundColor};` : '';
    const padding = `${col.padding.top}px ${col.padding.right}px ${col.padding.bottom}px ${col.padding.left}px`;
    const percent = col.widthPercent || Math.round(100 / totalCols);
    const dirStyle = isReverse ? 'direction: ltr;' : '';

    const renderedBlocks = col.blocks.map((b) => this.renderBlock(b, settings)).join('\n');

    return `
      <!-- Container Col ${colIdx + 1}/${totalCols} -->
      <td class="htmlo-column" width="${percent}%" valign="top" style="width: ${percent}%; padding: ${padding}; ${bg} ${dirStyle}">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          ${renderedBlocks}
        </table>
      </td>`;
  }

  private static renderBlock(block: BlockNode, settings: any): string {
    const padding = `${block.padding.top}px ${block.padding.right}px ${block.padding.bottom}px ${block.padding.left}px`;
    const align = block.align || 'left';

    let contentHtml = '';

    switch (block.type) {
      case 'text': {
        const text = block.props.content || '<p>Text block</p>';
        const color = block.props.color || settings.textColor;
        const fontSize = block.props.fontSize || 16;
        const lineHeight = block.props.lineHeight || 1.5;
        const fontFamily = block.props.fontFamily || settings.fontFamily;
        const fontWeight = block.props.fontWeight || (block.props.headingTag?.startsWith('h') ? 700 : 'normal');
        const fontStyle = block.props.fontStyle || 'normal';
        const anchorAttr = block.props.anchorLink && block.props.anchorId ? ` id="${this.escapeHtml(block.props.anchorId)}"` : '';
        contentHtml = `
          <div${anchorAttr} style="font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: ${fontWeight}; font-style: ${fontStyle}; line-height: ${lineHeight}; color: ${color}; text-align: ${align};">
            ${text}
          </div>`;
        break;
      }

      case 'button': {
        const text = this.escapeHtml(block.props.text || 'Click Here');
        const url = block.props.url || '#';
        const btnBg = block.props.buttonColor || settings.primaryColor;
        const textColor = block.props.textColor || '#ffffff';
        const radius = block.props.borderRadius ?? 4;
        const width = block.props.width === 'full' ? '100%' : typeof block.props.width === 'number' ? `${block.props.width}px` : 'auto';
        const height = block.props.height || 44;
        const arcsize = Math.min(100, Math.max(0, Math.round((radius / height) * 100)));

        contentHtml = `
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}" style="${block.props.width === 'full' ? 'width: 100%;' : ''}">
            <tr>
              <td align="center" style="border-radius: ${radius}px; background-color: ${btnBg};">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:${height}px;v-text-anchor:middle;width:${typeof block.props.width === 'number' ? block.props.width : 200}px;" arcsize="${arcsize}%" stroke="f" fillcolor="${btnBg}">
                  <w:anchorlock/>
                  <center style="color:${textColor};font-family:${settings.fontFamily};font-size:16px;font-weight:bold;">
                    ${text}
                  </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${url}" target="_blank" style="display: inline-block; background-color: ${btnBg}; color: ${textColor}; font-family: ${settings.fontFamily}; font-size: 16px; font-weight: 600; line-height: ${height}px; text-align: center; text-decoration: none; border-radius: ${radius}px; padding: 0 28px; width: ${width}; box-sizing: border-box; -webkit-text-size-adjust: none;">
                  ${text}
                </a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>`;
        break;
      }

      case 'image': {
        const src = block.props.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop';
        const alt = this.escapeHtml(block.props.alt || 'Image');
        const linkUrl = block.props.linkUrl;
        const width = block.props.imageWidth === 'full' ? '100%' : block.props.imageWidth ? `${block.props.imageWidth}px` : '100%';

        const imgTag = `<img src="${src}" alt="${alt}" border="0" class="htmlo-fluid-img" style="display: block; max-width: 100%; width: ${width}; height: auto; outline: none; border: 0; text-align: ${align}; margin: ${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};" />`;

        contentHtml = linkUrl ? `<a href="${linkUrl}" target="_blank" style="text-decoration: none;">${imgTag}</a>` : imgTag;
        break;
      }

      case 'spacer': {
        const h = block.props.spacerHeight || 24;
        contentHtml = `<div style="height: ${h}px; line-height: ${h}px; font-size: 1px;">&nbsp;</div>`;
        break;
      }

      case 'divider': {
        const color = block.props.dividerColor || '#e2e8f0';
        const h = block.props.dividerHeight || 1;
        const style = block.props.dividerStyle || 'solid';
        contentHtml = `<hr style="border: none; border-top: ${h}px ${style} ${color}; margin: 0; padding: 0;" />`;
        break;
      }

      case 'social': {
        const networks = block.props.networks || [
          { id: '1', network: 'facebook', url: 'https://facebook.com' },
          { id: '2', network: 'twitter', url: 'https://twitter.com' },
          { id: '3', network: 'instagram', url: 'https://instagram.com' },
          { id: '4', network: 'linkedin', url: 'https://linkedin.com' },
        ];
        const iconSize = block.props.iconSize || 28;
        const spacing = block.props.iconSpacing || 12;

        const iconsHtml = networks
          .map(
            (net) => `
            <td style="padding: 0 ${spacing / 2}px;">
              <a href="${net.url}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${this.getSocialIconUrl(net.network)}" alt="${net.network}" width="${iconSize}" height="${iconSize}" style="display: block; border: 0;" />
              </a>
            </td>`
          )
          .join('');

        contentHtml = `
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}">
            <tr>
              ${iconsHtml}
            </tr>
          </table>`;
        break;
      }

      case 'video': {
        const videoUrl = block.props.videoUrl || 'https://youtube.com';
        const thumbnail = block.props.videoThumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop';
        const title = this.escapeHtml(block.props.videoTitle || 'Watch Video');

        contentHtml = `
          <div style="position: relative; text-align: ${align};">
            <a href="${videoUrl}" target="_blank" style="display: inline-block; position: relative; text-decoration: none;">
              <img src="${thumbnail}" alt="${title}" class="htmlo-fluid-img" style="display: block; width: 100%; max-width: 600px; border-radius: 4px; border: 0;" />
              <div style="margin-top: 8px; font-family: ${settings.fontFamily}; font-size: 14px; font-weight: 600; color: ${settings.textColor};">${title} ▶</div>
            </a>
          </div>`;
        break;
      }

      case 'menu': {
        const items = block.props.menuItems || [
          { id: '1', label: 'Shop', url: '#' },
          { id: '2', label: 'Features', url: '#' },
          { id: '3', label: 'Pricing', url: '#' },
          { id: '4', label: 'Blog', url: '#' },
        ];

        const linksHtml = items
          .map(
            (item) => `
            <td style="padding: 0 16px;">
              <a href="${item.url}" target="_blank" style="color: ${settings.textColor}; font-family: ${settings.fontFamily}; font-size: 14px; font-weight: 600; text-decoration: none;">
                ${this.escapeHtml(item.label)}
              </a>
            </td>`
          )
          .join('');

        contentHtml = `
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}">
            <tr>
              ${linksHtml}
            </tr>
          </table>`;
        break;
      }

      case 'timer': {
        const targetDate = block.props.targetDate || '24h 00m 00s';
        const bg = block.props.timerBackground || '#1e293b';
        const textCol = block.props.timerTextColor || '#ffffff';

        contentHtml = `
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}">
            <tr>
              <td style="background-color: ${bg}; border-radius: 6px; padding: 12px 24px; text-align: center;">
                <span style="font-family: ${settings.fontFamily}; font-size: 22px; font-weight: bold; letter-spacing: 2px; color: ${textCol};">
                  ${this.escapeHtml(targetDate)}
                </span>
                <div style="font-family: ${settings.fontFamily}; font-size: 11px; text-transform: uppercase; color: ${textCol}; opacity: 0.8; margin-top: 4px;">
                  Limited Time Offer
                </div>
              </td>
            </tr>
          </table>`;
        break;
      }

      case 'shape': {
        const shapeType = block.props.shapeType || 'badge';
        const fill = block.props.fillColor || '#f0fdf4';
        const stroke = block.props.strokeColor || '#22c55e';
        const strokeW = block.props.strokeWidth ?? 2;
        const strokeSt = block.props.strokeStyle || 'solid';
        const radius = block.props.borderRadius ?? 8;
        const text = block.props.shapeText ? this.escapeHtml(block.props.shapeText) : '';
        const textColor = block.props.shapeTextColor || '#15803d';
        const height = block.props.shapeHeight || 52;
        const width = block.props.shapeWidth === 'full' ? '100%' : typeof block.props.shapeWidth === 'number' ? `${block.props.shapeWidth}px` : '100%';

        if (shapeType === 'circle') {
          const size = Math.min(height, 80);
          contentHtml = `
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}">
              <tr>
                <td align="center" style="width: ${size}px; height: ${size}px; border-radius: 50%; background-color: ${fill}; border: ${strokeW}px ${strokeSt} ${stroke}; text-align: center; vertical-align: middle;">
                  <span style="font-family: ${settings.fontFamily}; font-size: 13px; font-weight: 700; color: ${textColor};">${text}</span>
                </td>
              </tr>
            </table>`;
        } else if (shapeType === 'pill') {
          contentHtml = `
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}" style="width: ${width};">
              <tr>
                <td align="center" style="border-radius: 9999px; background-color: ${fill}; border: ${strokeW}px ${strokeSt} ${stroke}; padding: 10px 24px;">
                  <span style="font-family: ${settings.fontFamily}; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; color: ${textColor}; text-transform: uppercase;">
                    ${text || 'PILL BADGE'}
                  </span>
                </td>
              </tr>
            </table>`;
        } else if (shapeType === 'accent-bar') {
          contentHtml = `
            <div style="height: ${height || 6}px; background-color: ${fill}; border-radius: ${radius}px; width: ${width}; border: ${strokeW ? `${strokeW}px ${strokeSt} ${stroke}` : 'none'};">&nbsp;</div>`;
        } else if (shapeType === 'line-ornament') {
          contentHtml = `
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="${align}">
              <tr>
                <td style="border-bottom: ${strokeW}px ${strokeSt} ${stroke}; width: 40%;">&nbsp;</td>
                <td align="center" style="padding: 0 12px; font-family: ${settings.fontFamily}; font-size: 14px; font-weight: 700; color: ${textColor}; white-space: nowrap;">
                  ${text || '✦ ✦ ✦'}
                </td>
                <td style="border-bottom: ${strokeW}px ${strokeSt} ${stroke}; width: 40%;">&nbsp;</td>
              </tr>
            </table>`;
        } else {
          // Default: rectangle / badge
          contentHtml = `
            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${align}" style="width: ${width};">
              <tr>
                <td align="center" style="border-radius: ${radius}px; background-color: ${fill}; border: ${strokeW}px ${strokeSt} ${stroke}; padding: 14px 20px;">
                  <span style="font-family: ${settings.fontFamily}; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; color: ${textColor};">
                    ${text || 'HIGHLIGHT BADGE'}
                  </span>
                </td>
              </tr>
            </table>`;
        }
        break;
      }

      case 'html': {
        contentHtml = block.props.customHtml || block.props.htmlCode || '<div>Custom HTML Snippet</div>';
        break;
      }

      default:
        contentHtml = `<div>Unsupported block: ${block.type}</div>`;
    }

    return `
      <!-- Block: ${block.type} -->
      <tr>
        <td align="${align}" style="padding: ${padding};">
          ${contentHtml}
        </td>
      </tr>`;
  }

  private static getSocialIconUrl(network: string): string {
    const icons: Record<string, string> = {
      facebook: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png',
      twitter: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-48.png',
      instagram: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-instagram-48.png',
      linkedin: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-linkedin-48.png',
      youtube: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-youtube-48.png',
      github: 'https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png',
    };
    return icons[network] || icons.facebook;
  }

  public static formatHtml(html: string): string {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    const lines = html.replace(/>\s*</g, '>\n<').split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.match(/^<\/\w/)) {
        indent = Math.max(0, indent - 1);
      }

      formatted += tab.repeat(indent) + line + '\n';

      if (line.match(/^<\w[^>]*[^/]>$/) && !line.startsWith('<!') && !line.startsWith('<!--') && !line.includes('</')) {
        indent++;
      }
    }
    return formatted.trim();
  }

  public static parseHtml(html: string): EmailDocument | null {
    if (typeof window === 'undefined') return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('title')?.textContent || 'Imported Email Template';
      const body = doc.body;
      if (!body) return null;

      // 1. Extract all <style> contents from head and body into customCss
      const styles = Array.from(doc.querySelectorAll('style'));
      const extractedCss = styles
        .map((s) => s.textContent || '')
        .filter((t) => t.trim().length > 0)
        .join('\n\n');

      // 2. Extract background colors and typography
      const bodyBg =
        body.style.backgroundColor ||
        body.getAttribute('bgcolor') ||
        doc.querySelector('table[bgcolor]')?.getAttribute('bgcolor') ||
        '#f8fafc';

      const bodyTextColor = body.style.color || '#1e293b';
      const bodyFontFamily =
        body.style.fontFamily ||
        "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

      // 3. Detect container width
      let detectedWidth = 600;
      const allTables = Array.from(body.querySelectorAll('table'));
      for (const tbl of allTables) {
        const wAttr = tbl.getAttribute('width');
        const styleW = tbl.style.width || tbl.style.maxWidth;
        const val = parseInt(wAttr || styleW || '', 10);
        if (val >= 480 && val <= 850) {
          detectedWidth = val;
          break;
        }
      }

      const stripes: StripeNode[] = [];
      const visitedElements = new Set<Element>();

      // 4. Identify the non-duplicating top sections
      // Check for explicit stripe markers first (e.g. htmlo or Stripo native)
      const explicitStripes = Array.from(body.querySelectorAll('.htmlo-stripe, .esd-stripe'));

      if (explicitStripes.length > 0) {
        explicitStripes.forEach((stripeEl, sIdx) => {
          if (visitedElements.has(stripeEl)) return;
          visitedElements.add(stripeEl);

          const bg =
            (stripeEl as HTMLElement).style.backgroundColor ||
            stripeEl.getAttribute('bgcolor') ||
            '#ffffff';

          const structures = this.parseSectionIntoStructures(stripeEl, visitedElements, sIdx);
          if (structures.length > 0) {
            stripes.push({
              id: `stripe-import-${sIdx}-${Date.now()}`,
              stripeType: sIdx === 0 ? 'header' : sIdx === explicitStripes.length - 1 ? 'footer' : 'content',
              backgroundColor: bg,
              padding: { top: 16, right: 16, bottom: 16, left: 16 },
              structures,
            });
          }
        });
      } else {
        // Standard / Arbitrary Email (Mailchimp, Figma, Canva, custom HTML)
        // Find the main email content table to prevent duplicating outer 100% wrapper and inner container!
        let mainContentContainer: Element | null = null;
        for (const tbl of allTables) {
          const w = parseInt(tbl.getAttribute('width') || tbl.style.width || tbl.style.maxWidth || '', 10);
          if (w >= 480 && w <= 850) {
            mainContentContainer = tbl;
            break;
          }
        }

        const topSections: Element[] = [];

        if (mainContentContainer) {
          // Inside the main container, the direct <tr> rows represent each section of the email
          const directRows = Array.from(
            mainContentContainer.querySelectorAll(':scope > tbody > tr, :scope > tr')
          );
          if (directRows.length > 0) {
            topSections.push(...directRows);
          } else {
            topSections.push(mainContentContainer);
          }
        } else if (allTables.length > 0) {
          // If no specific 600px table found, collect only outermost tables that do not have any ancestor table
          const rootTables = allTables.filter((tbl) => {
            let curr = tbl.parentElement;
            while (curr && curr !== body) {
              if (curr.tagName.toLowerCase() === 'table') return false;
              curr = curr.parentElement;
            }
            return true;
          });

          // For each root table, if it contains rows, use rows; otherwise use the table itself
          rootTables.forEach((tbl) => {
            const rows = Array.from(tbl.querySelectorAll(':scope > tbody > tr, :scope > tr'));
            if (rows.length > 0) {
              topSections.push(...rows);
            } else {
              topSections.push(tbl);
            }
          });
        } else {
          // Div-based email or plain HTML
          topSections.push(
            ...Array.from(body.children).filter(
              (el) => !['script', 'style', 'svg'].includes(el.tagName.toLowerCase())
            )
          );
        }

        topSections.forEach((sectionEl, sIdx) => {
          if (visitedElements.has(sectionEl)) return;
          visitedElements.add(sectionEl);

          const bg =
            (sectionEl as HTMLElement).style.backgroundColor ||
            sectionEl.getAttribute('bgcolor') ||
            'transparent';

          const structures = this.parseSectionIntoStructures(sectionEl, visitedElements, sIdx);
          if (structures.length > 0) {
            stripes.push({
              id: `stripe-imported-${sIdx}-${Date.now()}`,
              stripeType: sIdx === 0 ? 'header' : sIdx === topSections.length - 1 ? 'footer' : 'content',
              backgroundColor: bg === 'transparent' ? '#ffffff' : bg,
              padding: { top: 10, right: 16, bottom: 10, left: 16 },
              structures,
            });
          }
        });
      }

      // Fallback: If nothing was parsed, wrap body as an editable HTML block
      if (stripes.length === 0 && body.innerHTML.trim()) {
        stripes.push({
          id: `stripe-fallback-${Date.now()}`,
          stripeType: 'content',
          backgroundColor: '#ffffff',
          padding: { top: 20, right: 20, bottom: 20, left: 20 },
          structures: [
            {
              id: `struct-fallback-${Date.now()}`,
              stackOnMobile: true,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              columns: [
                {
                  id: `col-fallback-${Date.now()}`,
                  widthPercent: 100,
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  blocks: [
                    {
                      id: `block-html-fallback-${Date.now()}`,
                      type: 'html',
                      align: 'left',
                      padding: { top: 12, right: 12, bottom: 12, left: 12 },
                      props: {
                        htmlCode: body.innerHTML.trim(),
                        customHtml: body.innerHTML.trim(),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });
      }

      return {
        version: '1.0.0',
        settings: {
          title,
          preheader: '',
          contentWidth: detectedWidth,
          backgroundColor: bodyBg,
          contentBackgroundColor: '#ffffff',
          fontFamily: bodyFontFamily,
          primaryColor: '#22c55e',
          textColor: bodyTextColor,
          linkColor: '#2563eb',
          underlineLinks: false,
          responsive: true,
          customCss: extractedCss || undefined,
        },
        stripes: stripes.length > 0 ? stripes : [
          {
            id: `stripe-empty-${Date.now()}`,
            stripeType: 'content',
            backgroundColor: '#ffffff',
            padding: { top: 20, right: 20, bottom: 20, left: 20 },
            structures: [],
          },
        ],
      };
    } catch (err) {
      console.error('Failed to parse HTML:', err);
      return null;
    }
  }

  /**
   * Parses a section (<tr>, <table>, or <div>) into multi-column structures
   */
  private static parseSectionIntoStructures(
    sectionEl: Element,
    visitedElements: Set<Element>,
    sIdx: number
  ): StructureNode[] {
    const structures: StructureNode[] = [];

    // Check for direct columns / cells
    const cells = Array.from(sectionEl.querySelectorAll(':scope > td, :scope > th'));

    if (cells.length > 1) {
      // Multi-column row (e.g. 2 columns or 3 columns)
      const colWidthPercent = Math.round(100 / cells.length);
      const columns = cells.map((cell, cIdx) => {
        visitedElements.add(cell);
        const wAttr = cell.getAttribute('width');
        const parsedW = wAttr ? parseInt(wAttr, 10) : colWidthPercent;
        const widthPercent = parsedW > 0 && parsedW <= 100 ? parsedW : colWidthPercent;
        const bg = (cell as HTMLElement).style.backgroundColor || cell.getAttribute('bgcolor') || 'transparent';

        const blocks = this.extractBlocksFromContainer(cell, visitedElements, `${sIdx}-${cIdx}`);
        return {
          id: `col-import-${sIdx}-${cIdx}`,
          widthPercent,
          backgroundColor: bg !== 'transparent' ? bg : undefined,
          padding: { top: 8, right: 8, bottom: 8, left: 8 },
          blocks,
        };
      });

      structures.push({
        id: `struct-import-${sIdx}`,
        stackOnMobile: true,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        columns,
      });
    } else {
      // Single container / cell or plain element
      const targetContainer = cells.length === 1 ? cells[0] : sectionEl;
      visitedElements.add(targetContainer);
      const blocks = this.extractBlocksFromContainer(targetContainer, visitedElements, `${sIdx}-0`);

      if (blocks.length > 0) {
        structures.push({
          id: `struct-import-${sIdx}`,
          stackOnMobile: true,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          columns: [
            {
              id: `col-import-${sIdx}-0`,
              widthPercent: 100,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              blocks,
            },
          ],
        });
      }
    }

    return structures;
  }

  /**
   * Extracts clean, editable BlockNodes from any container element
   */
  private static extractBlocksFromContainer(
    container: Element,
    visited: Set<Element>,
    prefix: string
  ): BlockNode[] {
    const blocks: BlockNode[] = [];
    let bIdx = 0;

    // Traverse direct or meaningful children
    // If container has text directly or simple elements:
    const elementsToProcess: Element[] = [];

    // Check if container has direct child elements
    const children = Array.from(container.children);
    if (children.length > 0) {
      elementsToProcess.push(...children);
    } else if (container.textContent?.trim()) {
      elementsToProcess.push(container);
    }

    for (const el of elementsToProcess) {
      if (visited.has(el)) continue;
      const tag = el.tagName.toLowerCase();

      // Skip scripts, styles, metadata
      if (['script', 'style', 'noscript', 'meta', 'title'].includes(tag)) continue;

      // 1. Image Block
      if (tag === 'img') {
        visited.add(el);
        const img = el as HTMLImageElement;
        const align = (img.style.textAlign as any) || img.getAttribute('align') || 'center';
        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'image',
          align: ['left', 'center', 'right'].includes(align) ? align : 'center',
          padding: { top: 10, right: 0, bottom: 10, left: 0 },
          props: {
            src: img.getAttribute('src') || img.src || '',
            alt: img.getAttribute('alt') || 'Email poster',
            imageWidth: 'full',
          },
        });
        continue;
      }

      // Check if element contains an image alone (e.g. <a><img></a> or <div><img></div>)
      const childImgs = Array.from(el.querySelectorAll('img'));
      if (childImgs.length === 1 && el.textContent?.trim() === '') {
        const img = childImgs[0];
        visited.add(el);
        visited.add(img);
        const link = el.tagName.toLowerCase() === 'a' ? (el as HTMLAnchorElement).href : undefined;
        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'image',
          align: 'center',
          padding: { top: 10, right: 0, bottom: 10, left: 0 },
          props: {
            src: img.getAttribute('src') || img.src || '',
            alt: img.getAttribute('alt') || 'Email poster',
            linkUrl: link,
            imageWidth: 'full',
          },
        });
        continue;
      }

      // 2. Button Block (anchor with button styles or table button)
      const isButton =
        tag === 'a' &&
        (el.classList.contains('button') ||
          el.classList.contains('btn') ||
          (el as HTMLElement).style.backgroundColor ||
          (el as HTMLElement).style.borderRadius);

      if (isButton) {
        visited.add(el);
        const btn = el as HTMLAnchorElement;
        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'button',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: {
            text: btn.textContent?.trim() || 'Button',
            url: btn.getAttribute('href') || '#',
            buttonColor: btn.style.backgroundColor || '#22c55e',
            textColor: btn.style.color || '#ffffff',
            borderRadius: parseInt(btn.style.borderRadius || '6', 10) || 6,
          },
        });
        continue;
      }

      // 3. Divider
      if (tag === 'hr') {
        visited.add(el);
        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'divider',
          align: 'center',
          padding: { top: 12, right: 16, bottom: 12, left: 16 },
          props: { dividerHeight: 1, dividerStyle: 'solid', dividerColor: '#e2e8f0' },
        });
        continue;
      }

      // 4. Spacer
      if (tag === 'div' && (el as HTMLElement).style.height && !el.textContent?.trim()) {
        visited.add(el);
        const h = parseInt((el as HTMLElement).style.height, 10) || 24;
        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'spacer',
          align: 'center',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          props: { spacerHeight: h },
        });
        continue;
      }

      // 5. Headings & Paragraphs & Styled Text
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote'].includes(tag)) {
        visited.add(el);
        const htmlEl = el as HTMLElement;
        const align = (htmlEl.style.textAlign as any) || el.getAttribute('align') || 'left';
        const color = htmlEl.style.color || undefined;
        const fontSize = parseInt(htmlEl.style.fontSize || '', 10) || undefined;
        const lineHeight = parseFloat(htmlEl.style.lineHeight) || undefined;

        blocks.push({
          id: `blk-${prefix}-${bIdx++}`,
          type: 'text',
          align: ['left', 'center', 'right', 'justify'].includes(align) ? align : 'left',
          padding: { top: 6, right: 8, bottom: 6, left: 8 },
          props: {
            content: el.outerHTML,
            color,
            fontSize,
            lineHeight,
          },
        });
        continue;
      }

      // 6. Generic Styled DIV / Card / Table Snippet
      if (el.textContent?.trim() || el.querySelectorAll('img, a, table').length > 0) {
        visited.add(el);
        // If it's a simple text div without inner complex tables:
        if (el.querySelectorAll('table, img').length === 0) {
          const htmlEl = el as HTMLElement;
          const align = (htmlEl.style.textAlign as any) || el.getAttribute('align') || 'left';
          blocks.push({
            id: `blk-${prefix}-${bIdx++}`,
            type: 'text',
            align: ['left', 'center', 'right', 'justify'].includes(align) ? align : 'left',
            padding: { top: 6, right: 8, bottom: 6, left: 8 },
            props: {
              content: el.outerHTML,
              color: htmlEl.style.color || undefined,
              fontSize: parseInt(htmlEl.style.fontSize || '', 10) || undefined,
            },
          });
        } else {
          // Complex HTML card or nested layout preserved with 100% fidelity as an HTML block!
          blocks.push({
            id: `blk-${prefix}-${bIdx++}`,
            type: 'html',
            align: 'left',
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
            props: {
              htmlCode: el.outerHTML,
              customHtml: el.outerHTML,
            },
          });
        }
      }
    }

    return blocks;
  }

  private static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
