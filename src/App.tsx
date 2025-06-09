import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useCanvas } from './hooks/useCanvas';

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
            <span>Canvas: {settings.tokenCount * settings.pixelSize}×{settings.tokenCount * settings.pixelSize}px</span>
            <span>•</span>
            <span>1 token = 32×32px</span>
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