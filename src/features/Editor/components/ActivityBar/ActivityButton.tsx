import React from 'react';

interface ActivityButtonProps {
  isActive: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export const ActivityButton: React.FC<ActivityButtonProps> = ({
  isActive,
  onClick,
  title,
  icon,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 hover:bg-gray-700 relative ${
        isActive ? 'bg-gray-700' : ''
      }`}
      title={title}
    >
      {icon}
      {children}
    </button>
  );
};
