import React, { useRef, useEffect } from 'react';
import { CanvasSettings } from '../types';

interface PreviewProps {
  settings: CanvasSettings;
  currentText: string;
}

export const Preview: React.FC<PreviewProps> = ({ settings, currentText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { widthTokens, heightTokens, pixelSize, fontSize } = settings;
  const canvasWidth = widthTokens * pixelSize;
  const canvasHeight = heightTokens * pixelSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw text if exists
    if (currentText.trim()) {
      ctx.fillStyle = '#000000';
      ctx.font = `normal ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // Character wrap with minimal padding
      let line = '';
      let y = 2;
      const lineHeight = fontSize * 1.1; // Tighter line spacing
      const maxWidth = canvasWidth - 4; // Only 2px padding total

      if (settings.charWrap) {
        for (const char of currentText) {
          const testLine = line + char;
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && line.length > 0) {
            ctx.fillText(line, 2, y);
            line = char;
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
      } else {
        const words = currentText.split(' ');
        for (const word of words) {
            const testLine = line.length > 0 ? `${line} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && line.length > 0) {
                ctx.fillText(line, 2, y);
                line = word;
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
      }
      ctx.fillText(line, 2, y);
    }
  }, [settings, currentText, canvasWidth, canvasHeight, fontSize]);

  return (
    <div className="flex items-center justify-center p-4">
        <canvas ref={canvasRef} className="border border-gray-600" />
    </div>
  );
}; 