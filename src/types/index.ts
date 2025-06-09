export interface CanvasSettings {
  tokenCount: number;
  pixelSize: number; // Always 32px
  fontSize: number;
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