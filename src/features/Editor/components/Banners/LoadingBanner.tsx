import React from 'react';

interface LoadingBannerProps {
  message?: string;
}

export const LoadingBanner: React.FC<LoadingBannerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="bg-blue-900 border-l-4 border-blue-500 text-blue-200 p-2">
      <div className="flex items-center">
        <svg
          className="animate-spin w-4 h-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-sm" role="status" aria-live="polite">
          {message}
        </span>
      </div>
    </div>
  );
};
