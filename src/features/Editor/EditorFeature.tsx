'use client';

import React, { useState, useEffect } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { ToolPanel } from './components/ToolPanel';
import { ActivityBar } from './components/ActivityBar';
import { MainEditorArea } from './components/MainEditorArea';
import { useEditorStore } from './hooks/useEditorStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export const EditorFeature: React.FC = () => {
  const {
    loadingFiles,
    errorFiles,
    loadFiles,
    clearError,
    activeFileId,
    openFiles,
    isDiffViewOpen,
    toggleDiffView,
    getDirtyFiles,
  } = useEditorStore();

  const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true);
  const [isToolPanelOpen, setIsToolPanelOpen] = useState(false);

  // Load file tree on component mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts();

  const handleToggleFileExplorer = () => {
    setIsFileExplorerOpen(prev => !prev);
  };

  const handleToggleToolPanel = () => {
    setIsToolPanelOpen(prev => !prev);
  };

  const handleRefresh = () => {
    loadFiles();
  };

  const handleClearError = () => {
    clearError();
  };

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      {/* Activity Bar */}
      <ActivityBar
        isFileExplorerOpen={isFileExplorerOpen}
        isToolPanelOpen={isToolPanelOpen}
        isDiffViewOpen={isDiffViewOpen}
        onToggleFileExplorer={handleToggleFileExplorer}
        onToggleToolPanel={handleToggleToolPanel}
        onToggleDiffView={toggleDiffView}
        onRefresh={handleRefresh}
        isLoading={loadingFiles}
        dirtyFilesCount={getDirtyFiles().length}
      />

      {/* File Explorer */}
      {isFileExplorerOpen && (
        <div className="w-64 flex-shrink-0">
          <FileExplorer />
        </div>
      )}

      {/* Main Editor Area */}
      <MainEditorArea
        isDiffViewOpen={isDiffViewOpen}
        activeFileId={activeFileId}
        openFiles={openFiles}
        loadingFiles={loadingFiles}
        errorFiles={errorFiles}
        onClearError={handleClearError}
      />

      {/* Tool Panel */}
      {isToolPanelOpen && (
        <div className="w-80 flex-shrink-0 border-l border-gray-700">
          <ToolPanel onClose={handleToggleToolPanel} />
        </div>
      )}
    </div>
  );
};
