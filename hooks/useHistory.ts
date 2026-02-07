
import { useState, useCallback, useRef } from 'react';

const MAX_HISTORY = 30;

interface HistoryState<T> {
  history: T[];
  pointer: number;
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    history: [initialState],
    pointer: 0
  });

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback((newState: T, immediate = true) => {
    const performPush = () => {
      setState(prev => {
        const current = prev.history[prev.pointer];
        // Skip if new state is identical to current
        if (JSON.stringify(current) === JSON.stringify(newState)) return prev;

        // Slice history up to current pointer and add new state
        const sliced = prev.history.slice(0, prev.pointer + 1);
        const nextHistory = [...sliced, JSON.parse(JSON.stringify(newState))];
        
        // Handle max history limit
        let nextPointer = nextHistory.length - 1;
        if (nextHistory.length > MAX_HISTORY) {
          nextHistory.shift();
          nextPointer = MAX_HISTORY - 1;
        }

        return {
          history: nextHistory,
          pointer: nextPointer
        };
      });
    };

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (immediate) {
      performPush();
    } else {
      debounceTimerRef.current = setTimeout(performPush, 500);
    }
  }, []);

  const undo = useCallback(() => {
    setState(prev => ({
      ...prev,
      pointer: Math.max(0, prev.pointer - 1)
    }));
  }, []);

  const redo = useCallback(() => {
    setState(prev => ({
      ...prev,
      pointer: Math.min(prev.history.length - 1, prev.pointer + 1)
    }));
  }, []);

  const reset = useCallback((newState: T) => {
    setState({
      history: [JSON.parse(JSON.stringify(newState))],
      pointer: 0
    });
  }, []);

  return {
    state: state.history[state.pointer],
    push,
    undo,
    redo,
    reset,
    canUndo: state.pointer > 0,
    canRedo: state.pointer < state.history.length - 1
  };
}
