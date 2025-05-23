"use client"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Ellipsis, Trash } from "lucide-react"
import { Layer, useLayerStore } from "@/lib/layer-store"

export default function LayerInfo({
    layer,
    // layerIndex,
}: {
    layer: Layer
    layerIndex: number
}) {
    // const layers = useLayerStore((state) => state.layers)
    // const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
    const removeLayer = useLayerStore((state) => state.removeLayer)

    return (
        <Dialog>
            <DialogTitle />
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Ellipsis size={18} />
                </Button>
            </DialogTrigger>
            <DialogContent className="text-xs z-[200]">
                <h3 className="text-lg font-medium text-center mb-2">
                    Layer {layer.id}
                </h3>
                <div className="py-4 space-y-0.5">
                    <p>
                        <span className="font-bold">Filename:</span> {layer.name}
                    </p>
                    <p>
                        <span className="font-bold">Format:</span> {layer.format}
                    </p>
                    <p>
                        <span className="font-bold"> Size:</span> {layer.width}X
                        {layer.height}
                    </p>
                </div>
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        removeLayer(layer.id)
                    }}
                    variant={"destructive"}
                    className="flex items-center gap-2 w-full"
                >
                    <span> Delete Layer</span>
                    <Trash size={14} />
                </Button>
            </DialogContent>
        </Dialog>
    )
}