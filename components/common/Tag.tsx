
import React from 'react';

interface TagProps {
  label: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, className }) => {
  const baseClasses = "text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full";
  const colorClasses = "bg-blue-900 text-blue-300";

  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {label}
    </span>
  );
};
