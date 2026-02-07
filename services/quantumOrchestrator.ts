
/**
 * Vayu Quantum Orchestrator (Backbone)
 * Manages system entropy and media lifecycle to prevent device freezing.
 * Implements a "Least Recently Visible" (LRV) eviction policy for GPU memory.
 */

export enum AssetModality {
  ACTIVE = 'active',     // Fully decoded in VRAM
  DORMANT = 'dormant',   // Placeholder visible, video paused
  HIBERNATED = 'hibernated' // Decoded data purged from GPU, only Base64 remains in Heap
}

interface ManagedAsset {
  id: string;
  weight: number;
  modality: AssetModality;
  lastIntersection: number;
  onModalityChange: (m: AssetModality) => void;
}

class QuantumOrchestrator {
  private static instance: QuantumOrchestrator;
  private assets: Map<string, ManagedAsset> = new Map();
  private readonly MAX_ENTROPY = 12; // Max concurrent heavy assets (weighted)
  private readonly MODALITY_WEIGHTS = { image: 1, video: 4 };

  private constructor() {
    console.log("Quantum Backbone Initialized: Monitoring Device Constraints.");
  }

  public static getInstance(): QuantumOrchestrator {
    if (!QuantumOrchestrator.instance) {
      QuantumOrchestrator.instance = new QuantumOrchestrator();
    }
    return QuantumOrchestrator.instance;
  }

  public register(id: string, type: 'image' | 'video', callback: (m: AssetModality) => void) {
    const weight = type === 'video' ? this.MODALITY_WEIGHTS.video : this.MODALITY_WEIGHTS.image;
    this.assets.set(id, {
      id,
      weight,
      modality: AssetModality.HIBERNATED,
      lastIntersection: 0,
      onModalityChange: callback
    });
    this.rebalance();
  }

  public unregister(id: string) {
    this.assets.delete(id);
    this.rebalance();
  }

  public updateVisibility(id: string, isVisible: boolean) {
    const asset = this.assets.get(id);
    if (!asset) return;

    if (isVisible) {
      asset.lastIntersection = Date.now();
      if (asset.modality !== AssetModality.ACTIVE) {
        this.requestActive(id);
      }
    } else {
      // Small delay to prevent flickering on fast scroll
      setTimeout(() => {
        const current = this.assets.get(id);
        if (current && Date.now() - current.lastIntersection > 1000) {
           this.setModality(id, AssetModality.HIBERNATED);
           this.rebalance();
        }
      }, 500);
    }
  }

  private requestActive(id: string) {
    this.setModality(id, AssetModality.ACTIVE);
    this.rebalance();
  }

  private setModality(id: string, modality: AssetModality) {
    const asset = this.assets.get(id);
    if (asset && asset.modality !== modality) {
      asset.modality = modality;
      asset.onModalityChange(modality);
    }
  }

  private rebalance() {
    const activeAssets = Array.from(this.assets.values())
      .filter(a => a.modality === AssetModality.ACTIVE)
      .sort((a, b) => b.lastIntersection - a.lastIntersection);

    let currentEntropy = activeAssets.reduce((sum, a) => sum + a.weight, 0);

    // Quantum Pruning Logic
    while (currentEntropy > this.MAX_ENTROPY && activeAssets.length > 0) {
      const victim = activeAssets.pop();
      if (victim) {
        this.setModality(victim.id, AssetModality.HIBERNATED);
        currentEntropy -= victim.weight;
      }
    }
  }
}

export const orchestrator = QuantumOrchestrator.getInstance();
