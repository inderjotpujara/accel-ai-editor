import React from 'react';
import { CodeEditor } from '../CodeEditor';
import { DiffViewer } from '../DiffViewer';
import { FileTabs } from '../FileTabs';
import { ErrorBanner } from '../Banners';
import { LoadingBanner } from '../Banners';
import { OpenFile } from '../../../../lib/types';

interface MainEditorAreaProps {
  isDiffViewOpen: boolean;
  activeFileId: string | null;
  openFiles: OpenFile[];
  loadingFiles: boolean;
  errorFiles: string | null;
  onClearError: () => void;
}

const EmptyDiffState: React.FC = () => (
  <div className="h-full flex items-center justify-center text-gray-400">
    <div className="text-center">
      <svg
        className="w-16 h-16 mx-auto mb-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-lg font-medium">No Changes to Show</p>
      <p className="text-sm mt-2">
        Make some edits to see the differences here
      </p>
    </div>
  </div>
);

export const MainEditorArea: React.FC<MainEditorAreaProps> = ({
  isDiffViewOpen,
  activeFileId,
  openFiles,
  loadingFiles,
  errorFiles,
  onClearError,
}) => {
  const renderEditorContent = () => {
    if (isDiffViewOpen && activeFileId) {
      const activeFile = openFiles.find(f => f.id === activeFileId);

      if (activeFile && activeFile.isDirty && activeFile.originalContent) {
        return (
          <DiffViewer
            originalContent={activeFile.originalContent}
            modifiedContent={activeFile.content}
            fileName={activeFile.name}
            language={activeFile.language}
          />
        );
      } else {
        return <EmptyDiffState />;
      }
    }

    return <CodeEditor />;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      {/* Error Banner */}
      {errorFiles && (
        <ErrorBanner message={errorFiles} onDismiss={onClearError} />
      )}

      {/* Loading Banner */}
      {loadingFiles && <LoadingBanner />}

      {/* File Tabs */}
      <FileTabs />

      {/* Editor Content */}
      <div className="flex-1">{renderEditorContent()}</div>
    </div>
  );
};
