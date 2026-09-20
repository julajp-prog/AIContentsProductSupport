
import React, { useState } from 'react';
import { Tool } from '../types';
import { ICONS, PRE_BUILT_TOOLS } from '../constants';

interface ToolsAccordionProps {
  onSelectTool: (prompt: Tool) => void;
}

export const ToolsAccordion: React.FC<ToolsAccordionProps> = ({ onSelectTool }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [...new Set(PRE_BUILT_TOOLS.map(tool => tool.category))];

  return (
    <div className="relative flex-shrink-0 bg-gray-850 border-t border-gray-750 z-10 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left font-semibold text-xs text-gray-300 flex justify-between items-center hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <span>🛠️</span>
          <span>プリセット・ツールパレット</span>
        </span>
        <span className={`transform transition-transform text-xs ${isOpen ? 'rotate-180' : ''}`}>{ICONS.chevronDown}</span>
      </button>
      {isOpen && (
        <div className="p-3 bg-gray-900 max-h-52 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 border-t border-gray-750">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-semibold uppercase text-gray-400 mb-2">{category}</h3>
              <ul>
                {PRE_BUILT_TOOLS.filter(tool => tool.category === category).map(tool => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onSelectTool(tool)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {tool.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
