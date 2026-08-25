import { SystemInstruction } from '../types';
import { SAMPLE_SYSTEM_INSTRUCTIONS } from '../constants';

const STORAGE_KEY = 'ai_orchestrator_system_instructions';

export const loadSystemInstructions = (): SystemInstruction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return SAMPLE_SYSTEM_INSTRUCTIONS;
    }
    const parsed: SystemInstruction[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return SAMPLE_SYSTEM_INSTRUCTIONS;
    }

    // Ensure built-in sample IDs exist or merge cleanly
    const existingIds = new Set(parsed.map(i => i.id));
    const missingPresets = SAMPLE_SYSTEM_INSTRUCTIONS.filter(sample => !existingIds.has(sample.id));
    
    return [...parsed, ...missingPresets];
  } catch (err) {
    console.error('Failed to load system instructions from localStorage:', err);
    return SAMPLE_SYSTEM_INSTRUCTIONS;
  }
};

export const saveSystemInstructions = (instructions: SystemInstruction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructions));
  } catch (err) {
    console.error('Failed to save system instructions to localStorage:', err);
  }
};

export const createSystemInstruction = (
  instruction: Omit<SystemInstruction, 'id' | 'createdAt' | 'updatedAt'>
): SystemInstruction => {
  const newInstruction: SystemInstruction = {
    ...instruction,
    id: `si-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    isCustom: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return newInstruction;
};

export const duplicateSystemInstruction = (original: SystemInstruction): SystemInstruction => {
  const copy: SystemInstruction = {
    ...original,
    id: `si-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${original.title} (コピー)`,
    isCustom: true,
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return copy;
};

export const resetSystemInstructionsToDefault = (): SystemInstruction[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset system instructions:', err);
  }
  return SAMPLE_SYSTEM_INSTRUCTIONS;
};

export const exportSystemInstructionsToJson = (instructions: SystemInstruction[]): string => {
  return JSON.stringify(instructions, null, 2);
};

export const importSystemInstructionsFromJson = (jsonStr: string): SystemInstruction[] => {
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) {
    throw new Error('インポートデータが配列ではありません。');
  }
  // Validate basic shape
  for (const item of parsed) {
    if (!item.title || typeof item.content !== 'string') {
      throw new Error('無効なシステムインストラクション形式が含まれています。');
    }
  }
  return parsed.map(item => ({
    ...item,
    id: item.id || `si-imported-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    isCustom: true,
    updatedAt: Date.now(),
  }));
};
