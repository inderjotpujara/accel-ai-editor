'use client';

import React, { useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { useEditorStore } from '../../hooks/useEditorStore';

// Map language names to CodeMirror language extensions
const getLanguageExtension = (language: string) => {
  const languageMap: Record<string, any> = {
    python: python(),
    java: java(),
    javascript: javascript({ jsx: false }),
    jsx: javascript({ jsx: true }),
    typescript: javascript({ typescript: true }),
    tsx: javascript({ jsx: true, typescript: true }),
    json: json(),
    markdown: markdown(),
    html: html(),
    css: css(),
    scss: css(),
    sql: sql(),
    xml: xml(),
    yaml: yaml(),
    yml: yaml(),
  };

  return languageMap[language] || [];
};

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
    case 'html':
      return '🌐';
    case 'css':
    case 'scss':
      return '🎨';
    case 'xml':
      return '📄';
    case 'yaml':
      return '⚙️';
    case 'shell':
      return '💻';
    case 'sql':
      return '🗃️';
    default:
      return '📄';
  }
};

export const CodeEditor: React.FC = () => {
  const {
    openFiles,
    activeFileId,
    updateFileContent,
    saveFile,
    savingFiles,
    fontSize,
  } = useEditorStore();

  const activeFile = openFiles.find(file => file.id === activeFileId);
  const isFileSaving = activeFileId
    ? savingFiles[activeFileId] || false
    : false;

  const handleEditorChange = useCallback(
    (value: string) => {
      if (activeFileId) {
        updateFileContent(activeFileId, value);
      }
    },
    [activeFileId, updateFileContent]
  );

  const handleSave = useCallback(() => {
    if (activeFileId && activeFile) {
      saveFile(activeFileId, activeFile.content);
    }
  }, [activeFileId, activeFile, saveFile]);

  // Create CodeMirror extensions
  const extensions = useMemo(() => {
    const exts = [
      EditorView.theme({
        '&': {
          fontSize: `${fontSize}px`,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100%',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        },
      }),
      EditorView.lineWrapping,
    ];

    if (activeFile) {
      const langExtension = getLanguageExtension(activeFile.language);
      if (langExtension) {
        exts.push(langExtension);
      }
    }

    return exts;
  }, [activeFile, fontSize]);

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-xl font-medium text-gray-300 mb-2">
            No File Open
          </h2>
          <p className="text-gray-400">
            Select a file from the explorer to start editing
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Or use Ctrl+O to open a file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* File header with path and actions */}
      <div className="px-4 py-2 border-b bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              {getFileIcon(activeFile.name, activeFile.language)}
            </span>
            <span className="text-sm font-medium text-gray-200">
              {activeFile.name}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                activeFile.language === 'java'
                  ? 'bg-orange-900 text-orange-200'
                  : activeFile.language === 'python'
                    ? 'bg-blue-900 text-blue-200'
                    : activeFile.language === 'javascript' ||
                        activeFile.language === 'typescript'
                      ? 'bg-yellow-900 text-yellow-200'
                      : activeFile.language === 'html'
                        ? 'bg-red-900 text-red-200'
                        : activeFile.language === 'css' ||
                            activeFile.language === 'scss'
                          ? 'bg-pink-900 text-pink-200'
                          : 'bg-gray-700 text-gray-200'
              }`}
            >
              {activeFile.language.toUpperCase()}
            </span>

            {/* Saving indicator */}
            {isFileSaving && (
              <div className="flex items-center space-x-1">
                <svg
                  className="animate-spin w-3 h-3 text-blue-400"
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
                <span className="text-blue-400 text-xs">Saving...</span>
              </div>
            )}

            {/* Dirty state indicator */}
            {activeFile.isDirty && !isFileSaving && (
              <div className="flex items-center space-x-1">
                <span className="text-orange-400 text-xs">● (unsaved)</span>
                <button
                  onClick={handleSave}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  title="Save file (Ctrl+S)"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-400">{activeFile.path}</div>
            {!activeFile.isDirty && !isFileSaving && (
              <div className="text-xs text-green-400 flex items-center space-x-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CodeMirror Editor */}
      <div className="h-[calc(100%-3rem)]">
        <CodeMirror
          value={activeFile.content}
          onChange={handleEditorChange}
          theme={oneDark}
          extensions={extensions}
          editable={!isFileSaving}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
          style={{
            height: '100%',
            fontSize: `${fontSize}px`,
          }}
        />
      </div>
    </div>
  );
};
