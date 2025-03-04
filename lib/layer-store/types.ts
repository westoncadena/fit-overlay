// Define all types related to layers
export type Layer = {
    publicId?: string;
    width?: number;
    height?: number;
    url?: string;
    id: string;
    name?: string;
    format?: string;
    poster?: string;
    resourceType?: 'image' | 'text';
    transcriptionURL?: string;
    text?: string;
    fontSize?: number;
    color?: string;
    position?: { x: number; y: number };
    scale?: number;
    locked?: boolean;
    order: number;
    stravaActivityId?: number;
}

export type LayerState = {
    layers: Layer[]
    activeLayer: Layer
}

export type LayerActions = {
    addLayer: (layer: Layer) => void
    removeLayer: (id: string) => void
    setActiveLayer: (id: string) => void
    updateLayer: (layer: Layer) => void
    updateLayerPosition: (id: string, position: { x: number; y: number }) => void
    updateLayerScale: (id: string, scale: number) => void
    reorderLayers: (sourceIndex: number, destinationIndex: number) => void
}

export type LayerStore = LayerState & LayerActions 