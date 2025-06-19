'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/features/Editor/hooks/useEditorStore';

interface ToolPanelProps {
  onClose: () => void;
}

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24];

export const ToolPanel: React.FC<ToolPanelProps> = ({ onClose }) => {
  const {
    fontSize,
    setFontSize,
    resetEditor,
    openFiles,
    activeFileId,
    refreshFileTree,
    isLoading,
    saveFile,
    saveAllFiles,
    loadingFiles,
  } = useEditorStore();

  const activeFile = openFiles.find(file => file.id === activeFileId);
  const dirtyFiles = openFiles.filter(file => file.isDirty);

  return (
    <div className="h-full bg-gray-900 p-4 overflow-auto file-explorer-scroll">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Editor Settings</h3>
        <Button variant="secondary" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            File Operations
          </h4>
          <div className="space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              disabled={!activeFile || !activeFile.isDirty || isLoading}
              onClick={() =>
                activeFile && saveFile(activeFile.id, activeFile.content)
              }
            >
              Save Current File
              {activeFile?.isDirty && ' *'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={dirtyFiles.length === 0 || isLoading}
              onClick={saveAllFiles}
            >
              Save All Files
              {dirtyFiles.length > 0 && ` (${dirtyFiles.length})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={refreshFileTree}
              disabled={loadingFiles}
            >
              {loadingFiles ? 'Refreshing...' : 'Refresh File Tree'}
            </Button>
          </div>
        </div>

        {/* Active File Info */}
        {activeFile && (
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Active File
            </h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>
                <strong>Name:</strong> {activeFile.name}
              </div>
              <div>
                <strong>Path:</strong> {activeFile.path}
              </div>
              <div>
                <strong>Language:</strong> {activeFile.language}
              </div>
              <div>
                <strong>Status:</strong>
                <span
                  className={`ml-1 ${activeFile.isDirty ? 'text-orange-500' : 'text-green-500'}`}
                >
                  {activeFile.isDirty ? 'Modified' : 'Saved'}
                </span>
              </div>
              <div>
                <strong>Lines:</strong> {activeFile.content.split('\n').length}
              </div>
              <div>
                <strong>Characters:</strong> {activeFile.content.length}
              </div>
            </div>
          </div>
        )}

        {/* Open Files */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Open Files ({openFiles.length})
          </h4>
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-h-40 overflow-y-auto">
            {openFiles.length === 0 ? (
              <p className="p-3 text-xs text-gray-400">No files open</p>
            ) : (
              openFiles.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 ${
                    file.id === activeFileId ? 'bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-xs">
                      {file.language === 'java'
                        ? '☕'
                        : file.language === 'python'
                          ? '🐍'
                          : '📄'}
                    </span>
                    <span className="text-xs text-gray-300 truncate">
                      {file.name}
                    </span>
                    {file.isDirty && (
                      <span className="text-orange-500 text-xs">●</span>
                    )}
                  </div>
                  {file.isDirty && (
                    <button
                      onClick={() => saveFile(file.id, file.content)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                      disabled={isLoading}
                      title="Save file"
                    >
                      Save
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dirty Files Summary */}
        {dirtyFiles.length > 0 && (
          <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-800">
            <div className="flex items-center mb-2">
              <span className="text-orange-500 text-sm">⚠️</span>
              <span className="text-sm font-medium text-orange-300 ml-2">
                Unsaved Changes
              </span>
            </div>
            <p className="text-xs text-orange-400">
              {dirtyFiles.length} file{dirtyFiles.length > 1 ? 's' : ''} with
              unsaved changes
            </p>
            <div className="mt-2 space-y-1">
              {dirtyFiles.map(file => (
                <div key={file.id} className="text-xs text-orange-400">
                  • {file.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Font Size
          </label>
          <select
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-gray-800 text-gray-100"
          >
            {FONT_SIZES.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Keyboard Shortcuts
          </h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>
              <kbd className="text-xs bg-gray-700 px-1 rounded">Ctrl+S</kbd>{' '}
              Save current file
            </div>
            <div>
              <kbd className="text-xs bg-gray-700 px-1 rounded">
                Ctrl+Shift+S
              </kbd>{' '}
              Save all files
            </div>
            <div>
              <kbd className="text-xs bg-gray-700 px-1 rounded">Ctrl+W</kbd>{' '}
              Close current file
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            AI Assistant
          </h4>
          <div className="space-y-2">
            <Button variant="primary" size="sm" className="w-full">
              Generate Code
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Explain Code
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              Fix Issues
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Format Code
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Run Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={resetEditor}
            >
              Reset Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
