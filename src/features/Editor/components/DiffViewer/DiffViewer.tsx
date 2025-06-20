import React from 'react';

interface DiffViewerProps {
  originalContent: string;
  modifiedContent: string;
  fileName: string;
  language: string;
}

type DiffType = 'added' | 'removed' | 'modified' | 'unchanged';

interface DiffLineProps {
  lineNumber: number | undefined;
  content: string;
  diffType: DiffType;
  side: 'original' | 'modified';
}

const DiffLine: React.FC<DiffLineProps> = ({
  lineNumber,
  content,
  diffType,
  side,
}) => {
  const getBgColor = () => {
    if (diffType === 'removed' && side === 'original') return 'bg-red-900/50';
    if (diffType === 'added' && side === 'modified') return 'bg-green-900/50';
    if (diffType === 'modified') return 'bg-yellow-900/30';
    return 'bg-gray-900';
  };

  const getTextColor = () => {
    if (diffType === 'removed' && side === 'original') return 'text-red-200';
    if (diffType === 'added' && side === 'modified') return 'text-green-200';
    if (diffType === 'modified') return 'text-yellow-200';
    return 'text-gray-100';
  };

  return (
    <div className={`flex ${getBgColor()}`}>
      <div className="w-12 px-2 py-1 text-xs text-gray-500 border-r border-gray-700 flex-shrink-0">
        {lineNumber || ''}
      </div>
      <div className={`px-3 py-1 flex-1 ${getTextColor()}`}>
        {content || ''}
      </div>
    </div>
  );
};

const DiffPanel: React.FC<{
  title: string;
  lines: string[];
  maxLines: number;
  side: 'original' | 'modified';
  getDiffType: (
    originalLine: string | undefined,
    modifiedLine: string | undefined
  ) => DiffType;
  otherLines: string[];
}> = ({ title, lines, maxLines, side, getDiffType, otherLines }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gray-800 px-4 py-2 text-xs font-medium text-gray-300 border-b border-gray-700 flex-shrink-0">
        {title}
      </div>
      <div className="overflow-auto flex-1">
        <div className="font-mono text-sm">
          {Array.from({ length: maxLines }, (_, i) => {
            const currentLine = lines[i];
            const otherLine = otherLines[i];
            const diffType = getDiffType(
              side === 'original' ? currentLine : otherLine,
              side === 'modified' ? currentLine : otherLine
            );

            return (
              <DiffLine
                key={`${side}-${i}`}
                lineNumber={currentLine !== undefined ? i + 1 : undefined}
                content={currentLine || ''}
                diffType={diffType}
                side={side}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalContent,
  modifiedContent,
  fileName,
  language,
}) => {
  const originalLines = originalContent.split('\n');
  const modifiedLines = modifiedContent.split('\n');
  const maxLines = Math.max(originalLines.length, modifiedLines.length);

  const getDiffType = (
    originalLine: string | undefined,
    modifiedLine: string | undefined
  ): DiffType => {
    if (originalLine === undefined) return 'added';
    if (modifiedLine === undefined) return 'removed';
    if (originalLine !== modifiedLine) return 'modified';
    return 'unchanged';
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-medium">{fileName} - Diff View</h3>
        <p className="text-xs text-gray-400 mt-1">
          Comparing original with current changes
        </p>
      </div>

      {/* Diff Content */}
      <div className="flex-1 flex overflow-hidden">
        <DiffPanel
          title="Original"
          lines={originalLines}
          maxLines={maxLines}
          side="original"
          getDiffType={getDiffType}
          otherLines={modifiedLines}
        />

        <div className="border-r border-gray-700" />

        <DiffPanel
          title="Modified"
          lines={modifiedLines}
          maxLines={maxLines}
          side="modified"
          getDiffType={getDiffType}
          otherLines={originalLines}
        />
      </div>
    </div>
  );
};
