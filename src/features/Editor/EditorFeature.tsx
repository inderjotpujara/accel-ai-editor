'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { FileExplorer } from './components/FileExplorer';
import { FileTabs } from './components/FileTabs';
import { ToolPanel } from './components/ToolPanel';
import { useEditorStore } from './hooks/useEditorStore';

export const EditorFeature: React.FC = () => {
  const {
    loadingFiles,
    errorFiles,
    loadFiles,
    clearError,
    activeFileId,
    openFiles,
    saveFile,
    saveAllFiles,
  } = useEditorStore();

  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isToolPanelOpen, setIsToolPanelOpen] = useState(false);

  // Load file tree on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + S to save current file
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (activeFileId) {
          const activeFile = openFiles.find(f => f.id === activeFileId);
          if (activeFile) {
            saveFile(activeFileId, activeFile.content);
          }
        }
      }

      // Ctrl/Cmd + Shift + S to save all files
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === 's'
      ) {
        event.preventDefault();
        saveAllFiles();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, openFiles, saveFile, saveAllFiles]);

  const toggleFileExplorer = () => {
    setIsFileExplorerOpen(prev => !prev);
  };

  const toggleToolPanel = () => {
    setIsToolPanelOpen(prev => !prev);
  };

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      {/* Activity Bar */}
      <div className="w-12 flex flex-col bg-gray-800 border-gray-700 border-r">
        <button
          onClick={toggleFileExplorer}
          className={`p-3 hover:bg-gray-700 ${
            isFileExplorerOpen ? 'bg-gray-700' : ''
          }`}
          title="Explorer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0M8 5a2 2 0 000h8a2 2 0 000v0v0a2 2 0 000"
            />
          </svg>
        </button>

        <button
          onClick={toggleToolPanel}
          className={`p-3 hover:bg-gray-700 ${
            isToolPanelOpen ? 'bg-gray-700' : ''
          }`}
          title="Settings"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Refresh button */}
        <button
          onClick={() => loadFiles()}
          className="p-3 hover:bg-gray-700"
          title="Refresh File Tree"
          disabled={loadingFiles}
        >
          <svg
            className={`w-5 h-5 ${loadingFiles ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* File Explorer */}
      {isFileExplorerOpen && (
        <div className="w-64 flex-shrink-0">
          <FileExplorer />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Error Banner */}
        {errorFiles && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Error: </span>
                <span>{errorFiles}</span>
              </div>
              <button
                onClick={() => clearError()}
                className="text-red-300 hover:text-red-100"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loadingFiles && (
          <div className="bg-blue-900 border-l-4 border-blue-500 text-blue-200 p-2">
            <div className="flex items-center">
              <svg
                className="animate-spin w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}

        {/* File Tabs */}
        <FileTabs />

        {/* Editor */}
        <div className="flex-1">
          <CodeEditor />
        </div>
      </div>

      {/* Tool Panel */}
      {isToolPanelOpen && (
        <div className="w-80 flex-shrink-0 border-l border-gray-700">
          <ToolPanel onClose={toggleToolPanel} />
        </div>
      )}
    </div>
  );
};
