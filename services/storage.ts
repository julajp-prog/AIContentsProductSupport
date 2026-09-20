/**
 * Robust LocalStorage Wrapper with Circular Reference & DOM Node Filtering
 * Prevents "Converting circular structure to JSON" crashes caused by MouseEvent/HTMLSpanElement.
 */

export const createSafeReplacer = () => {
  const seen = new WeakSet();

  return (key: string, value: any) => {
    // Drop functions, symbols
    if (typeof value === 'function' || typeof value === 'symbol') {
      return undefined;
    }

    // Drop DOM elements, Events, React Synthetic Events, Fiber nodes
    if (
      value !== null &&
      typeof value === 'object' &&
      (
        value instanceof Event ||
        (typeof Element !== 'undefined' && value instanceof Element) ||
        value.nodeType !== undefined ||
        value.nativeEvent !== undefined ||
        value._reactFiber !== undefined ||
        value._reactInternalFiber !== undefined ||
        key === 'target' ||
        key === 'currentTarget' ||
        key === 'view'
      )
    ) {
      return undefined;
    }

    // Detect circular references
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined; // Drop circular reference safely
      }
      seen.add(value);
    }

    return value;
  };
};

/**
 * Safely serialize and store item in localStorage
 */
export const safeSetItem = (key: string, value: any): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value, createSafeReplacer());
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[storage] Failed to save key "${key}" to localStorage:`, err);
    return false;
  }
};

/**
 * Safely read and parse item from localStorage
 */
export const safeGetItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] Failed to parse key "${key}" from localStorage:`, err);
    return fallback;
  }
};
