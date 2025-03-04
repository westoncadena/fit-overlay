import { createStore } from "zustand/vanilla"
import { StoreApi, useStore } from "zustand"
import React from "react"
import { persist, createJSONStorage } from "zustand/middleware"

// Define aspect ratios for Instagram with ratio values
export const INSTAGRAM_ASPECT_RATIOS = {
    SQUARE: { ratio: 1 / 1, name: "Square (1:1)" },
    PORTRAIT: { ratio: 4 / 5, name: "Portrait (4:5)" },
    LANDSCAPE: { ratio: 1.91 / 1, name: "Landscape (1.91:1)" },
    STORY: { ratio: 9 / 16, name: "Story (9:16)" }
}

// Quality presets (multiplier for base dimensions)
export const QUALITY_PRESETS = {
    LOW: { multiplier: 1, name: "Low (1080px)" },
    MEDIUM: { multiplier: 1.5, name: "Medium (1620px)" },
    HIGH: { multiplier: 2, name: "High (2160px)" },
    ULTRA: { multiplier: 3, name: "Ultra (3240px)" }
}

// Base width for calculations
const BASE_WIDTH = 1080;

type AspectRatioPreset = {
    ratio: number;
    name: string;
}

type QualityPreset = {
    multiplier: number;
    name: string;
}

type State = {
    projectName: string;
    setProjectName: (name: string) => void;
    canvasWidth: number;
    canvasHeight: number;
    aspectRatioPreset: AspectRatioPreset;
    qualityPreset: QualityPreset;
    setAspectRatio: (preset: AspectRatioPreset) => void;
    setQuality: (preset: QualityPreset) => void;
    updateCanvasDimensions: () => void;
}

const getStore = (initialState: {
    projectName: string;
    aspectRatioPreset: AspectRatioPreset;
    qualityPreset: QualityPreset;
}) => {
    return createStore<State>()(
        persist(
            (set, get) => ({
                projectName: initialState.projectName,
                setProjectName: (name) => set({ projectName: name }),

                // Initial dimensions calculation
                canvasWidth: Math.round(BASE_WIDTH * initialState.qualityPreset.multiplier),
                canvasHeight: Math.round(BASE_WIDTH * initialState.qualityPreset.multiplier / initialState.aspectRatioPreset.ratio),

                aspectRatioPreset: initialState.aspectRatioPreset,
                qualityPreset: initialState.qualityPreset,

                setAspectRatio: (preset) => {
                    set({ aspectRatioPreset: preset });
                    get().updateCanvasDimensions();
                },

                setQuality: (preset) => {
                    set({ qualityPreset: preset });
                    get().updateCanvasDimensions();
                },

                updateCanvasDimensions: () => {
                    const { aspectRatioPreset, qualityPreset } = get();
                    const width = Math.round(BASE_WIDTH * qualityPreset.multiplier);
                    const height = Math.round(width / aspectRatioPreset.ratio);
                    set({ canvasWidth: width, canvasHeight: height });
                }
            }),
            {
                name: "project-storage",
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
}

const createZustandContext = <TInitial, TStore extends StoreApi<State>>(
    getStore: (initial: TInitial) => TStore
) => {
    const Context = React.createContext<TStore | null>(null)

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

export const ProjectStore = createZustandContext(getStore)

export function useProjectStore<T>(selector: (state: State) => T) {
    const store = React.useContext(ProjectStore.Context)
    if (!store) {
        throw new Error("Missing ProjectStore provider")
    }
    return useStore(store, selector)
}

// Add this new hook to get canvas dimensions with proper scaling
export function useScaledCanvasDimensions() {
    const canvasWidth = useProjectStore(state => state.canvasWidth);
    const canvasHeight = useProjectStore(state => state.canvasHeight);

    // Calculate scale to fit within container while maintaining aspect ratio
    const calculateScale = (containerWidth: number, containerHeight: number) => {
        if (!containerWidth || !containerHeight) return 1;

        const scaleX = (containerWidth * 0.9) / canvasWidth;
        const scaleY = (containerHeight * 0.9) / canvasHeight;
        return Math.min(scaleX, scaleY, 1); // Never scale up beyond 1
    };

    return { canvasWidth, canvasHeight, calculateScale };
} 