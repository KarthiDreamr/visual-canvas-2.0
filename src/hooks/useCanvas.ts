import { useState, useCallback, useEffect } from 'react';
import { CanvasSettings, TextElement } from '../types';

export const useCanvas = () => {
  const [settings, setSettings] = useState<CanvasSettings>({
    tokenCount: 1,
    pixelSize: 32,
    fontSize: 8,
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
  const checkTextOverflow = useCallback((tokenCount: number, text: string, fontSize: number) => {
    if (!text.trim()) return false;

    // Create a temporary canvas to measure text
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return false;

    const canvasSize = tokenCount * settings.pixelSize;
    ctx.font = `normal ${fontSize}px system-ui, -apple-system, sans-serif`;
    
    let line = '';
    let lineCount = 1;
    const lineHeight = fontSize * 1.1;
    const maxWidth = canvasSize - 4; // 2px padding on each side

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

    const totalTextHeight = lineCount * lineHeight + 4; // 2px padding top/bottom
    return totalTextHeight > canvasSize;
  }, [settings.pixelSize]);

  const updateSettings = useCallback((newSettings: Partial<CanvasSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    const textToCheck = currentText || (textElements[0]?.text || '');

    if (textToCheck.trim()) {
      const willOverflow = checkTextOverflow(updatedSettings.tokenCount, textToCheck, updatedSettings.fontSize);
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
      const willOverflow = checkTextOverflow(settings.tokenCount, text, settings.fontSize);
      if (willOverflow) {
        setOverflowWarning('Warning: Text will overflow vertically and may be cropped.');
      } else {
        setOverflowWarning(null);
      }
    } else {
      setOverflowWarning(null);
    }
    
    setCurrentText(text);
  }, [settings.tokenCount, settings.fontSize, checkTextOverflow]);

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

  const exportAsImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasSize = settings.tokenCount * settings.pixelSize;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

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
      const maxWidth = canvasSize - 4; // Only 2px padding total

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
      ctx.fillText(line, 2, y);
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vision-canvas-${settings.tokenCount}x${settings.tokenCount}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  }, [settings, currentText]);

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
    exportAsImage,
    exportAsData,
  };
};