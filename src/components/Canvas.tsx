import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasSettings, TextElement } from '../types';

interface CanvasProps {
  settings: CanvasSettings;
  textElements: TextElement[];
  onTextChange: (text: string) => void;
  currentText: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  settings,
  textElements,
  onTextChange,
  currentText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState('');
  
  const { tokenCount, pixelSize, fontSize } = settings;
  const canvasSize = tokenCount * pixelSize;

  // Sync local text with current text when not editing
  useEffect(() => {
    if (!isEditing) {
      setLocalText(currentText);
    }
  }, [currentText, isEditing]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const renderTextOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background (keep white for AI readability)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Set up text rendering - plain black text for AI readability
    ctx.fillStyle = '#000000';
    ctx.font = `normal ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const textToRender = currentText || (textElements[0]?.text || '');
    
    if (textToRender) {
      // Word wrap within the canvas bounds with minimal padding (2px)
      const words = textToRender.split(' ');
      let line = '';
      let y = 2;
      const lineHeight = fontSize * 1.1; // Tighter line spacing
      const maxWidth = canvasSize - 4; // Only 2px padding on each side

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, 2, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 2, y);
    }
  }, [settings, textElements, currentText, canvasSize, fontSize]);

  useEffect(() => {
    renderTextOnCanvas();
  }, [renderTextOnCanvas]);

  const handleCanvasClick = () => {
    setIsEditing(true);
    // If there's existing text, load it for editing
    if (textElements.length > 0 && !currentText) {
      setLocalText(textElements[0].text);
    } else {
      setLocalText(currentText);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    
    // Try to update the text - if it would overflow, the change will be rejected
    onTextChange(newText);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      // Revert to current text if user cancels
      setLocalText(currentText);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleTextareaBlur = () => {
    setIsEditing(false);
    // Final attempt to save the text
    onTextChange(localText);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className={`border border-gray-600 ${isEditing ? 'opacity-30' : 'cursor-text'}`}
          onClick={handleCanvasClick}
          style={{
            maxWidth: '600px',
            maxHeight: '600px',
            width: 'auto',
            height: 'auto',
          }}
        />
        
        {/* Clean white textarea overlay for text editing */}
        {isEditing && (
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            onBlur={handleTextareaBlur}
            className="absolute top-0 left-0 bg-white text-black border-none outline-none resize-none overflow-hidden"
            style={{
              width: `${canvasSize}px`,
              height: `${canvasSize}px`,
              fontSize: `${fontSize}px`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 'normal',
              lineHeight: 1.1,
              padding: '2px',
              margin: 0,
              zIndex: 10,
              textShadow: 'none',
              boxShadow: 'none',
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
};