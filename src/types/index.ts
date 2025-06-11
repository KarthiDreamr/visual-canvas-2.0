export interface CanvasSettings {
  widthTokens: number;
  heightTokens: number;
  pixelSize: number; // Always 32px
  fontSize: number;
  charWrap: boolean;
}

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
}