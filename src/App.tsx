import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useCanvas } from './hooks/useCanvas';
import { Info } from 'lucide-react';

function App() {
  const {
    settings,
    textElements,
    currentText,
    overflowWarning,
    updateSettings,
    handleTextChange,
    clearCanvas,
    exportAsImage,
    exportAsData,
  } = useCanvas();
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfoPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoRef]);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Vision Model Text Input Generator</h1>
              <p className="text-sm text-gray-300">Generate images for your local LLM vision model</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
                                        <a 
                href="https://github.com/KarthiDreamr/Vision-Model-Text-Input-Generator" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 text-white hover:text-blue-400"
              >
                <span>Made by KarthiDreamr</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        settings={settings}
        onSettingsChange={updateSettings}
        onClearCanvas={clearCanvas}
        onExportImage={exportAsImage}
        onExportData={exportAsData}
      />

      {/* Main Content */}
      <Canvas
        settings={settings}
        onTextChange={handleTextChange}
        currentText={currentText}
      />

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center space-x-4">
            <span>Canvas: {settings.widthTokens * settings.pixelSize}×{settings.heightTokens * settings.pixelSize}px</span>
            <span>•</span>
            <span>1 token = 32×32px</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="char-wrap"
              checked={settings.charWrap}
              onChange={(e) => updateSettings({ charWrap: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="char-wrap" className="text-sm text-gray-300">
              Resolve right side 1 line overflow
            </label>
            <div className="relative" ref={infoRef}>
              <button onClick={() => setShowInfoPopup(!showInfoPopup)}>
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
              {showInfoPopup && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-gray-600 text-white text-xs rounded shadow-lg z-10">
                  Wrap text as character to prevent one words overflow to the right
                </div>
              )}
            </div>
          </div>
          {overflowWarning && (
            <div className="text-amber-400 text-xs font-medium">
              ⚠ {overflowWarning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;