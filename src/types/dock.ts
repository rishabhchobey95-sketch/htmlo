export type DockSide = 'left' | 'right';
export type DockPosition = 'left' | 'right' | 'hidden' | 'floating';
export type CodeDockPosition = 'bottom' | 'right' | 'hidden' | 'floating';

export interface FloatingWindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized?: boolean;
}

export interface DockLayoutState {
  palettePosition: DockPosition;
  paletteWidth: number;
  inspectorPosition: DockPosition;
  inspectorWidth: number;
  codePosition: CodeDockPosition;
  codeHeight: number;
  codeWidth: number;
  floatingPalette: FloatingWindowState;
  floatingInspector: FloatingWindowState;
  floatingCode: FloatingWindowState;
}

export const DEFAULT_DOCK_LAYOUT: DockLayoutState = {
  palettePosition: 'left',
  paletteWidth: 318, // 58px rail + 260px drawer
  inspectorPosition: 'right',
  inspectorWidth: 330,
  codePosition: 'bottom',
  codeHeight: 290,
  codeWidth: 480,
  floatingPalette: {
    x: 80,
    y: 80,
    width: 320,
    height: 600,
    isMinimized: false,
  },
  floatingInspector: {
    x: 750,
    y: 80,
    width: 340,
    height: 650,
    isMinimized: false,
  },
  floatingCode: {
    x: 250,
    y: 200,
    width: 720,
    height: 480,
    isMinimized: false,
  },
};
