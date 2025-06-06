"use client"

import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogContent,
    DialogTitle,
} from "./ui/dialog"
import { useImageStore } from "@/lib/image-store"
import { useLayerStore } from "@/lib/layer-store"
import loadingAnimation from "@/public/animations/loading.json"
import Lottie from "lottie-react"

export default function Loading() {
    const generating = useImageStore((state) => state.generating)
    const setGenerating = useImageStore((state) => state.setGenerating)
    const activeLayer = useLayerStore((state) => state.activeLayer)
    return (
        <Dialog open={generating} onOpenChange={setGenerating}>
            <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle>Editing {activeLayer.name}</DialogTitle>
                    <DialogDescription>
                        Please note that this operation might take up to a couple of
                        seconds.
                    </DialogDescription>
                </DialogHeader>
                <Lottie className="w-36 lottie-animation" animationData={loadingAnimation} />
            </DialogContent>
        </Dialog>
    )
}