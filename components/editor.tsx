"use client"

import Layers from "./layers/layers"
// import { useLayerStore } from "@/lib/layer-store"
import ImageTools from "./toolbar/image-toolbar"
import LayerCanvas from "./layer-canvas"
import Loading from "./loading"
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
                <div className="py-6 px-4  min-w-48 ">
                    {/* <div className="flex flex-col gap-4 ">
                        {activeLayer.resourceType === "image" ? <ImageTools /> : null}
                    </div>
                    <div className="flex flex-col gap-4 ">
                        {activeLayer.resourceType === "text" ? <ImageTools /> : null}
                    </div> */}
                    <ImageTools />
                </div>
                <Loading />
                <LayerCanvas />
                <Layers />
            </div>
        </ProjectStore.Provider>
    )
}