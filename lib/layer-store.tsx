import { createStore } from "zustand/vanilla"
import { StoreApi, useStore } from "zustand"
import React from "react"
import { persist } from "zustand/middleware"

const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
    getStore: (initial: TInitial) => TStore
) => {
    const Context = React.createContext(null as any as TStore)

    const Provider = (props: {
        children?: React.ReactNode
        initialValue: TInitial
    }) => {
        const [store] = React.useState(getStore(props.initialValue))

        return <Context.Provider value={store}>{props.children}</Context.Provider>
    }

    return {
        useContext: () => React.useContext(Context),
        Context,
        Provider,
    }
}

export type Layer = {
    publicId?: string;
    width?: number;
    height?: number;
    url?: string; // For images
    id: string;
    name?: string;
    format?: string;
    poster?: string;
    resourceType?: 'image' | 'text'; // Specify resource type
    transcriptionURL?: string;
    text?: string; // For text layers
    fontSize?: number; // For text layers
    color?: string; // For text layers
    position?: { x: number; y: number }; // For text layers
    order: number; // Add an order property for rendering order
}

type State = {
    layers: Layer[]
    addLayer: (layer: Layer) => void
    removeLayer: (id: string) => void
    setActiveLayer: (id: string) => void
    activeLayer: Layer
    updateLayer: (layer: Layer) => void
}

const getStore = (initialState: {
    layers: Layer[]
    layerComparisonMode: boolean
}) => {
    return createStore<State>()(
        persist(
            (set) => ({
                layers: initialState.layers,
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
                activeLayer: initialState.layers[0],
                updateLayer: (layer: Layer) =>
                    set((state) => ({
                        layers: state.layers.map((l) => (l.id === layer.id ? layer : l)),
                    })),
            }),
            { name: "layer-storage" }
        )
    )
}

export const LayerStore = createZustandContext(getStore)

export function useLayerStore<T>(selector: (state: State) => T) {
    const store = React.useContext(LayerStore.Context)
    if (!store) {
        throw new Error("Missing LayerStore provider")
    }
    return useStore(store, selector)
}