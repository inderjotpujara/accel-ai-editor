import React from 'react';
import { ActivityButton } from './ActivityButton';
import { RefreshButton } from './RefreshButton';
import { DiffButton } from './DiffButton';

interface ActivityBarProps {
  isFileExplorerOpen: boolean;
  isToolPanelOpen: boolean;
  isDiffViewOpen: boolean;
  onToggleFileExplorer: () => void;
  onToggleToolPanel: () => void;
  onToggleDiffView: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  dirtyFilesCount: number;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  isFileExplorerOpen,
  isToolPanelOpen,
  isDiffViewOpen,
  onToggleFileExplorer,
  onToggleToolPanel,
  onToggleDiffView,
  onRefresh,
  isLoading,
  dirtyFilesCount,
}) => {
  return (
    <div className="w-12 flex flex-col bg-gray-800 border-gray-700 border-r">
      <ActivityButton
        isActive={isFileExplorerOpen}
        onClick={onToggleFileExplorer}
        title="Explorer"
        icon={
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
        }
      />

      <ActivityButton
        isActive={isToolPanelOpen}
        onClick={onToggleToolPanel}
        title="Settings"
        icon={
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
        }
      />

      <DiffButton
        isActive={isDiffViewOpen}
        onClick={onToggleDiffView}
        dirtyFilesCount={dirtyFilesCount}
      />

      <RefreshButton onClick={onRefresh} isLoading={isLoading} />
    </div>
  );
};
