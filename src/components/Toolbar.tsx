import React from 'react';
import { Plus, Minus, Download, Trash2, Image, Type } from 'lucide-react';
import { CanvasSettings } from '../types';

interface ToolbarProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: Partial<CanvasSettings>) => void;
  onClearCanvas: () => void;
  onExportImage: () => void;
  onExportData: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onSettingsChange,
  onClearCanvas,
  onExportImage,
  onExportData,
}) => {
  const handleWidthTokenChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(32, settings.widthTokens + delta));
    onSettingsChange({ widthTokens: newCount });
  };

  const handleWidthTokenInputChange = (value: string) => {
    const newCount = Math.max(1, Math.min(32, parseInt(value) || 1));
    onSettingsChange({ widthTokens: newCount });
  };

  const handleHeightTokenChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(32, settings.heightTokens + delta));
    onSettingsChange({ heightTokens: newCount });
  };

  const handleHeightTokenInputChange = (value: string) => {
    const newCount = Math.max(1, Math.min(32, parseInt(value) || 1));
    onSettingsChange({ heightTokens: newCount });
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(1, Math.min(72, settings.fontSize + delta));
    onSettingsChange({ fontSize: newSize });
  };

  const handleFontSizeInputChange = (value: string) => {
    const newSize = Math.max(1, Math.min(72, parseFloat(value) || 16));
    onSettingsChange({ fontSize: newSize });
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Token Count Control */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-200">Width Tokens:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleWidthTokenChange(-1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.widthTokens <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="32"
                value={settings.widthTokens}
                onChange={(e) => handleWidthTokenInputChange(e.target.value)}
                className="w-16 px-2 py-1 text-center text-sm bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleWidthTokenChange(1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.widthTokens >= 32}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-200">Height Tokens:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleHeightTokenChange(-1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.heightTokens <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max="32"
                value={settings.heightTokens}
                onChange={(e) => handleHeightTokenInputChange(e.target.value)}
                className="w-16 px-2 py-1 text-center text-sm bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleHeightTokenChange(1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.heightTokens >= 32}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-200">Total Tokens:</label>
            <div className="flex items-center space-x-2">
                <div className="px-3 py-2 text-sm bg-gray-700 border border-gray-600 text-white rounded">
                    {settings.widthTokens * settings.heightTokens}
                </div>
            </div>
          </div>

          {/* Font Size Control */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-200 flex items-center space-x-1">
              <Type className="w-4 h-4" />
              <span>Font:</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFontSizeChange(-1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.fontSize <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="0.1"
                min="1"
                max="72"
                value={settings.fontSize}
                onChange={(e) => handleFontSizeInputChange(e.target.value)}
                className="w-16 px-2 py-1 text-center text-sm bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleFontSizeChange(1)}
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                disabled={settings.fontSize >= 72}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClearCanvas}
            className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Clear</span>
          </button>

          <div className="w-px h-6 bg-gray-600"></div>

          <button
            onClick={onExportImage}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
          >
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">Export PNG</span>
          </button>

          <button
            onClick={onExportData}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};