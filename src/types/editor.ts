export type StripeType = 'header' | 'content' | 'footer' | 'info';

export type BlockType =
  | 'text'
  | 'image'
  | 'button'
  | 'spacer'
  | 'divider'
  | 'social'
  | 'video'
  | 'html'
  | 'menu'
  | 'timer'
  | 'shape';

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Border {
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'none';
  color: string;
  radius?: number;
}

export interface BaseNode {
  id: string;
  name?: string;
  locked?: boolean;
  hiddenOnDesktop?: boolean;
  hiddenOnMobile?: boolean;
}

export interface BlockNode extends BaseNode {
  type: BlockType;
  padding: Spacing;
  align: 'left' | 'center' | 'right' | 'justify';
  props: {
    // Text props
    content?: string;
    fontSize?: number;
    color?: string;
    lineHeight?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    headingTag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    includeIn?: 'both' | 'html' | 'amp';
    anchorLink?: boolean;
    anchorId?: string;
    // Button props
    text?: string;
    url?: string;
    buttonColor?: string;
    textColor?: string;
    borderRadius?: number;
    width?: number | 'auto' | 'full';
    height?: number;
    // Image props
    src?: string;
    alt?: string;
    linkUrl?: string;
    imageWidth?: number | 'full';
    // Spacer props
    spacerHeight?: number;
    // Divider props
    dividerColor?: string;
    dividerHeight?: number;
    dividerStyle?: 'solid' | 'dashed' | 'dotted';
    // Social props
    networks?: Array<{
      id: string;
      network: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
      url: string;
    }>;
    iconSize?: number;
    iconSpacing?: number;
    // Video props
    videoUrl?: string;
    videoThumbnail?: string;
    videoTitle?: string;
    // HTML props
    htmlCode?: string;
    customHtml?: string;
    // Menu props
    menuItems?: Array<{ id: string; label: string; url: string }>;
    // Timer props
    targetDate?: string;
    timerBackground?: string;
    timerTextColor?: string;
    // Shape props
    shapeType?: 'rectangle' | 'circle' | 'pill' | 'badge' | 'line-ornament' | 'star' | 'diamond' | 'accent-bar';
    shapeWidth?: number | 'full';
    shapeHeight?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    strokeStyle?: 'solid' | 'dashed' | 'dotted';
    shapeText?: string;
    shapeTextColor?: string;
    [key: string]: any;
  };
}

export interface ContainerNode extends BaseNode {
  widthPercent: number; // e.g. 50, 33.33, 100
  backgroundColor?: string;
  border?: Border;
  padding: Spacing;
  blocks: BlockNode[];
}

export interface StructureNode extends BaseNode {
  columns: ContainerNode[];
  backgroundColor?: string;
  padding: Spacing;
  stackOnMobile: boolean;
  reverseStackMobile?: boolean;
}

export interface StripeNode extends BaseNode {
  stripeType: StripeType;
  backgroundColor: string;
  backgroundImageUrl?: string;
  padding: Spacing;
  structures: StructureNode[];
}

export interface GlobalEmailSettings {
  title: string;
  preheader: string;
  contentWidth: number; // default: 600
  backgroundColor: string; // outer canvas background e.g. #f4f5f8
  contentBackgroundColor: string; // inner body content e.g. #ffffff
  fontFamily: string; // 'Arial, Helvetica, sans-serif'
  primaryColor: string; // default CTA color #2563eb
  textColor: string; // default font color #1e293b
  linkColor: string; // default link color #2563eb
  underlineLinks: boolean;
  responsive: boolean;
  customCss?: string;
}

export interface EmailDocument {
  version: string;
  settings: GlobalEmailSettings;
  stripes: StripeNode[];
}

export type ViewMode = 'desktop' | 'mobile' | 'code' | 'preview';
export type ActiveTab = 'blocks' | 'layouts' | 'modules';
