'use client'

import { useLayerStore } from "@/lib/layer-store"
import { useState } from "react"
import UploadImage from "./upload-image"

export default function uploadFrom() {
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const [selecedType] = useState('image')

    if (!activeLayer.url)
        return (
            <div className="w-full p-24 flex flex-col justify-center h-full">
                {selecedType === "image" ? <UploadImage /> : null}
            </div>
        )
}