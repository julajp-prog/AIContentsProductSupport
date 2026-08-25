
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
    <div className="fixed bottom-0 left-64 right-0 bg-gray-800 border-t border-gray-700 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left font-semibold text-white flex justify-between items-center hover:bg-gray-700 transition-colors"
      >
        <span>ツールパレット</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>{ICONS.chevronDown}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-800 max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
