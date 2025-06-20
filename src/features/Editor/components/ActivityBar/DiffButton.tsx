import React from 'react';
import { ActivityButton } from './ActivityButton';

interface DiffButtonProps {
  isActive: boolean;
  onClick: () => void;
  dirtyFilesCount: number;
}

export const DiffButton: React.FC<DiffButtonProps> = ({
  isActive,
  onClick,
  dirtyFilesCount,
}) => {
  return (
    <ActivityButton
      isActive={isActive}
      onClick={onClick}
      title="Show Changes"
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
            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
          />
        </svg>
      }
    >
      {dirtyFilesCount > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-black font-bold">
            {dirtyFilesCount}
          </span>
        </div>
      )}
    </ActivityButton>
  );
};
