"use client"

import Toolbar from "./toolbar/toolbar"
import ToolbarMobile from "./toolbar/toolbar-mobile"
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
                <Toolbar />
                <Loading />
                <LayerCanvas />
                <LayersMenu />
                <ToolbarMobile />
            </div>
        </ProjectStore.Provider>
    )
}