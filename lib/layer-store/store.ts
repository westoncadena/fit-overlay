import { createStore } from "zustand/vanilla"
import { persist } from "zustand/middleware"
import { Layer, LayerStore } from "./types"

const getStore = (initialState: {
    layers: Layer[]
    layerComparisonMode: boolean
}) => {
    return createStore<LayerStore>()(
        persist(
            (set) => ({
                layers: initialState.layers,
                activeLayer: initialState.layers[0],

                addLayer: (layer: Layer) => {
                    set((state) => {
                        const maxOrder = state.layers.length > 0
                            ? Math.max(...state.layers.map(l => l.order))
                            : 0;

                        const newLayer = {
                            ...layer,
                            order: maxOrder + 1,
                        };

                        return {
                            layers: [...state.layers, newLayer],
                        };
                    });
                },

                removeLayer: (id: string) =>
                    set((state) => ({
                        layers: state.layers.filter((l) => l.id !== id),
                    })),

                setActiveLayer: (id: string) =>
                    set((state) => ({
                        activeLayer:
                            state.layers.find((l) => l.id === id) || state.layers[0],
                    })),

                updateLayer: (layer: Layer) =>
                    set((state) => ({
                        layers: state.layers.map((l) => (l.id === layer.id ? layer : l)),
                    })),

                updateLayerPosition: (id: string, position: { x: number; y: number }) =>
                    set((state) => ({
                        layers: state.layers.map((l) =>
                            l.id === id ? { ...l, position } : l
                        ),
                    })),

                updateLayerScale: (id: string, scale: number) =>
                    set((state) => ({
                        layers: state.layers.map((l) =>
                            l.id === id ? { ...l, scale } : l
                        ),
                    })),

                updateLayerDimensions: (id: string, width: number, height: number) =>
                    set((state) => ({
                        layers: state.layers.map((l) =>
                            l.id === id ? { ...l, width, height } : l
                        ),
                    })),

                reorderLayers: (sourceIndex: number, destinationIndex: number) =>
                    set((state) => {
                        const sortedLayers = [...state.layers].sort((a, b) => a.order - b.order);
                        const [movedLayer] = sortedLayers.splice(sourceIndex, 1);
                        sortedLayers.splice(destinationIndex, 0, movedLayer);

                        // Update order values for all layers
                        const updatedLayers = sortedLayers.map((layer, index) => ({
                            ...layer,
                            order: index + 1
                        }));

                        return { layers: updatedLayers };
                    }),
            }),
            { name: "layer-storage" }
        )
    )
}

export default getStore 