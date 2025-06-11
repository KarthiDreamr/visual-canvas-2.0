import React, { useRef, useEffect } from 'react';
import { CanvasSettings } from '../types';
import { Preview } from './Preview';

interface CanvasProps {
  settings: CanvasSettings;
  onTextChange: (text: string) => void;
  currentText: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  settings,
  onTextChange,
  currentText,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { widthTokens, heightTokens, pixelSize, fontSize } = settings;
  const canvasWidth = widthTokens * pixelSize;
  const canvasHeight = heightTokens * pixelSize;

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start bg-gray-900 p-4 gap-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={currentText}
          onChange={handleTextareaChange}
          className="bg-white text-black border border-gray-600 outline-none resize-none overflow-auto"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            maxWidth: '600px',
            maxHeight: '600px',
            fontSize: `${fontSize}px`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 'normal',
            lineHeight: 1.1,
            padding: '2px',
            margin: 0,
            zIndex: 10,
            wordBreak: settings.charWrap ? 'break-all' : 'normal',
          }}
          autoFocus
        />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white text-center mb-2">Preview</h2>
        <Preview settings={settings} currentText={currentText} />
      </div>
    </div>
  );
};