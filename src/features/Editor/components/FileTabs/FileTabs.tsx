'use client';

import React from 'react';
import { useEditorStore } from '../../hooks/useEditorStore';

const getFileIcon = (fileName: string, language: string) => {
  // Check language first, then fallback to extension
  switch (language) {
    case 'java':
      return '☕';
    case 'python':
      return '🐍';
    case 'javascript':
    case 'typescript':
      return '⚡';
    case 'json':
      return '📋';
    case 'markdown':
      return '📝';
    default:
      return '📄';
  }
};

export const FileTabs: React.FC = () => {
  const { openFiles, activeFileId, setActiveFile, closeFile } =
    useEditorStore();

  if (openFiles.length === 0) {
    return null;
  }

  const handleTabClick = (fileId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveFile(fileId);
  };

  const handleCloseTab = (fileId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    closeFile(fileId);
  };

  return (
    <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {openFiles.map(file => (
        <div
          key={file.id}
          className={`
            group flex items-center min-w-0 max-w-xs px-3 py-2 cursor-pointer border-r border-gray-700 transition-colors duration-150
            ${
              file.id === activeFileId
                ? 'bg-gray-900 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-750 hover:text-white'
            }
          `}
          onClick={e => handleTabClick(file.id, e)}
          title={file.path}
        >
          {/* File icon */}
          <span className="mr-2 text-sm flex-shrink-0">
            {getFileIcon(file.name, file.language)}
          </span>

          {/* File name */}
          <span className="text-sm truncate flex-1 min-w-0">{file.name}</span>

          {/* File state indicators */}
          <div className="flex items-center ml-2 space-x-1">
            {/* Dirty indicator (read-only) */}
            {file.isDirty && (
              <div
                className="w-3 h-3 rounded-full bg-orange-400 flex items-center justify-center"
                title="Unsaved changes"
              >
                <span className="text-xs text-white font-bold">•</span>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={e => handleCloseTab(file.id, e)}
              className={`
                w-4 h-4 rounded flex items-center justify-center transition-colors
                ${
                  file.id === activeFileId
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-600 opacity-0 group-hover:opacity-100'
                }
              `}
              title="Close tab"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
