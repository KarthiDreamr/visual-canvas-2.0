import { useState, useCallback, useEffect } from 'react';
import { CanvasSettings, TextElement } from '../types';
import pako from 'pako';
import CRC32 from 'crc-32';

function createChunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const chunkData = new Uint8Array(typeBytes.length + data.length);
  chunkData.set(typeBytes);
  chunkData.set(data, typeBytes.length);

  const crc = CRC32.buf(chunkData) >>> 0;
  const crcBytes = new Uint8Array(4);
  new DataView(crcBytes.buffer).setUint32(0, crc);

  const length = data.length;
  const lengthBytes = new Uint8Array(4);
  new DataView(lengthBytes.buffer).setUint32(0, length);

  const chunk = new Uint8Array(12 + data.length);
  chunk.set(lengthBytes);
  chunk.set(chunkData, 4);
  chunk.set(crcBytes, 8 + data.length);

  return chunk;
}

export const useCanvas = () => {
  const [settings, setSettings] = useState<CanvasSettings>({
    widthTokens: 4,
    heightTokens: 4,
    pixelSize: 32,
    fontSize: 8,
    charWrap: false,
  });
  
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [overflowWarning, setOverflowWarning] = useState<string | null>(null);

  // Auto-dismiss warning after 5 seconds
  useEffect(() => {
    if (overflowWarning) {
      const timer = setTimeout(() => {
        setOverflowWarning(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [overflowWarning]);

  // Check if text will overflow when canvas size changes or text is added
  const checkTextOverflow = useCallback((widthTokens: number, heightTokens: number, text: string, fontSize: number, charWrap: boolean) => {
    if (!text.trim()) return false;

    // Create a temporary canvas to measure text
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return false;

    const canvasWidth = widthTokens * settings.pixelSize;
    const canvasHeight = heightTokens * settings.pixelSize;
    ctx.font = `normal ${fontSize}px system-ui, -apple-system, sans-serif`;
    
    let line = '';
    let lineCount = 1;
    const lineHeight = fontSize * 1.1;
    const maxWidth = canvasWidth - 4; // 2px padding on each side

    if (charWrap) {
      for (const char of text) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line.length > 0) {
          lineCount++;
          line = char;
        } else {
          line = testLine;
        }
      }
    } else {
      const words = text.split(' ');
      for (const word of words) {
        const testLine = line.length > 0 ? `${line} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line.length > 0) {
          lineCount++;
          line = word;
        } else {
          line = testLine;
        }
      }
    }

    const totalTextHeight = lineCount * lineHeight + 4; // 2px padding top/bottom
    return totalTextHeight > canvasHeight;
  }, [settings.pixelSize]);

  const updateSettings = useCallback((newSettings: Partial<CanvasSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    const textToCheck = currentText || (textElements[0]?.text || '');

    if (textToCheck.trim()) {
      const willOverflow = checkTextOverflow(updatedSettings.widthTokens, updatedSettings.heightTokens, textToCheck, updatedSettings.fontSize, updatedSettings.charWrap);
      if (willOverflow) {
        setOverflowWarning('Warning: Text will overflow vertically and may be cropped.');
      } else {
        setOverflowWarning(null);
      }
    } else {
      setOverflowWarning(null);
    }
    
    setSettings(updatedSettings);
  }, [settings, currentText, textElements, checkTextOverflow]);

  const handleTextChange = useCallback((text: string) => {
    if (text.trim()) {
      const willOverflow = checkTextOverflow(settings.widthTokens, settings.heightTokens, text, settings.fontSize, settings.charWrap);
      if (willOverflow) {
        setOverflowWarning('Warning: Text will overflow vertically and may be cropped.');
      } else {
        setOverflowWarning(null);
      }
    } else {
      setOverflowWarning(null);
    }
    
    setCurrentText(text);
  }, [settings.widthTokens, settings.heightTokens, settings.fontSize, settings.charWrap, checkTextOverflow]);

  // Auto-save text when currentText changes and is not empty
  useEffect(() => {
    if (currentText.trim()) {
      const newElement: TextElement = {
        id: 'main-text',
        text: currentText,
        x: 2, // Minimal padding
        y: 2, // Minimal padding
        fontSize: settings.fontSize,
        color: '#000000',
        fontWeight: 'normal',
      };
      
      setTextElements([newElement]);
    } else {
      setTextElements([]);
    }
  }, [currentText, settings.fontSize]);

  const clearCanvas = useCallback(() => {
    setTextElements([]);
    setCurrentText('');
    setOverflowWarning(null);
  }, []);

  const exportAsImageWithData = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = settings.widthTokens * settings.pixelSize;
    const canvasHeight = settings.heightTokens * settings.pixelSize;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw text if exists
    if (currentText.trim()) {
      ctx.fillStyle = '#000000';
      ctx.font = `normal ${settings.fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // Character wrap with minimal padding
      let line = '';
      let y = 2;
      const lineHeight = settings.fontSize * 1.1; // Tighter line spacing
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

    // Get JSON data
    const data = {
      settings,
      textElements,
      currentText,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = function(event) {
          if (event.target && event.target.result) {
            const arrayBuffer = event.target.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Embed data into PNG
            const keyword = 'vision-canvas-data';
            const keywordBytes = new TextEncoder().encode(keyword);
            const compressedData = pako.deflate(dataStr, { level: 9 });
            
            const zTXtData = new Uint8Array(keywordBytes.length + 2 + compressedData.length);
            zTXtData.set(keywordBytes);
            zTXtData.set([0, 0], keywordBytes.length); // Null separator and compression method
            zTXtData.set(compressedData, keywordBytes.length + 2);

            const textChunk = createChunk('zTXt', zTXtData);
            
            // Find the position of the IEND chunk
            let iendPos = -1;
            for (let i = uint8Array.length - 12; i >= 0; i--) {
              if (
                uint8Array[i+4] === 73 && // I
                uint8Array[i+5] === 69 && // E
                uint8Array[i+6] === 78 && // N
                uint8Array[i+7] === 68    // D
              ) {
                iendPos = i;
                break;
              }
            }
            
            if (iendPos !== -1) {
              const newPng = new Uint8Array(uint8Array.length + textChunk.length);
              newPng.set(uint8Array.slice(0, iendPos));
              newPng.set(textChunk, iendPos);
              newPng.set(uint8Array.slice(iendPos), iendPos + textChunk.length);

              const newBlob = new Blob([newPng], { type: 'image/png' });
              const url = URL.createObjectURL(newBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `vision-canvas-${settings.widthTokens}x${settings.heightTokens}-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }
        };
        reader.readAsArrayBuffer(blob);
      }
    });
  }, [settings, currentText, textElements]);

  const exportAsData = useCallback(() => {
    const data = {
      settings,
      textElements,
      currentText,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vision-canvas-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [settings, textElements, currentText]);

  return {
    settings,
    textElements,
    currentText,
    overflowWarning,
    updateSettings,
    handleTextChange,
    clearCanvas,
    exportAsImage: exportAsImageWithData,
    exportAsData,
  };
};