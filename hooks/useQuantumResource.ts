
import { useState, useEffect, useCallback } from 'react';
import { orchestrator, AssetModality } from '../services/quantumOrchestrator';

export function useQuantumResource(id: string, type: 'image' | 'video') {
  const [modality, setModality] = useState<AssetModality>(AssetModality.HIBERNATED);

  useEffect(() => {
    orchestrator.register(id, type, (newModality) => {
      setModality(newModality);
    });

    return () => orchestrator.unregister(id);
  }, [id, type]);

  const setVisibility = useCallback((isVisible: boolean) => {
    orchestrator.updateVisibility(id, isVisible);
  }, [id]);

  return { modality, setVisibility };
}
