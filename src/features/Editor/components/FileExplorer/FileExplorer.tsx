'use client';

import React, { useState } from 'react';
import { FileNode } from '../../../../lib/types';
import { useEditorStore } from '../../hooks/useEditorStore';

interface FileNodeProps {
  node: FileNode;
  level: number;
}

const FileNodeComponent: React.FC<FileNodeProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const { openFile } = useEditorStore();

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      openFile(node);
    }
  };

  const getFileIcon = (
    fileName: string,
    type: 'file' | 'folder',
    language?: string
  ) => {
    if (type === 'folder') {
      return isExpanded ? '📂' : '📁';
    }

    // Use language if available, otherwise fallback to extension
    if (language) {
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
    }

    // Fallback to extension-based icons
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'java':
        return '☕';
      case 'py':
      case 'pyw':
        return '🐍';
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return '⚡';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      case 'xml':
        return '🔧';
      case 'txt':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div>
      <div
        className={`
          flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800 transition-colors duration-150
          ${level === 0 ? 'font-medium' : ''}
        `}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
        title={node.path}
      >
        <span className="mr-2 text-sm">
          {getFileIcon(node.name, node.type, node.language)}
        </span>
        <span className="text-sm text-gray-300 truncate flex-1">
          {node.name}
        </span>
        {node.language && (
          <span
            className={`text-xs px-1 py-0.5 rounded ml-2 ${
              node.language === 'java'
                ? 'bg-orange-900 text-orange-200'
                : node.language === 'python'
                  ? 'bg-blue-900 text-blue-200'
                  : node.language === 'javascript' ||
                      node.language === 'typescript'
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-gray-700 text-gray-300'
            }`}
          >
            {node.language.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <FileNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const { fileTree, toggleFileExplorer, isLoading, error } = useEditorStore();

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">
          Explorer
        </h2>
        <button
          onClick={toggleFileExplorer}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 transition-colors"
          title="Hide Explorer"
        >
          <svg
            className="w-4 h-4"
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

      <div className="flex-1 overflow-auto file-explorer-scroll">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <svg
                className="animate-spin w-4 h-4"
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
              <span className="text-sm">Loading files...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 text-red-400 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Failed to load files</span>
            </div>
          </div>
        )}

        {!isLoading && !error && fileTree.length === 0 && (
          <div className="flex items-center justify-center p-8 text-center">
            <div className="text-gray-500">
              <div className="text-2xl mb-2">📁</div>
              <div className="text-sm">No files found</div>
            </div>
          </div>
        )}

        {!isLoading &&
          !error &&
          fileTree.map(node => (
            <FileNodeComponent key={node.id} node={node} level={0} />
          ))}
      </div>
    </div>
  );
};
