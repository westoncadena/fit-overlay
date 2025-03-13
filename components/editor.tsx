"use client"

import ImageTools from "./toolbar/image-toolbar"
import LayerCanvas from "./layer-canvas"
import Loading from "./loading"
import LayersMenu from "./layers/layers-menu"
import { ProjectStore, INSTAGRAM_ASPECT_RATIOS, QUALITY_PRESETS } from "@/lib/project-store";

export default function Editor() {
    // const activeLayer = useLayerStore((state) => state.activeLayer)

    return (
        <ProjectStore.Provider initialValue={{
            projectName: "Instagram Post",
            aspectRatioPreset: INSTAGRAM_ASPECT_RATIOS.SQUARE,
            qualityPreset: QUALITY_PRESETS.MEDIUM
        }}>
            <div className="flex h-full">
                <ImageTools />
                <Loading />
                <LayerCanvas />
                <LayersMenu />
            </div>
        </ProjectStore.Provider>
    )
}