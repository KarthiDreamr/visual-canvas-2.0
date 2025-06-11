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