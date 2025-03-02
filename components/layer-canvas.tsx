import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ActiveImage() {
    const layers = useLayerStore((state) => state.layers); // Get all layers
    const generating = useImageStore((state) => state.generating);

    if (!layers.length) return null; // Return null if there are no layers

    const renderLayer = (layer: Layer) => (
        <div key={layer.id} className="absolute inset-0 flex items-center justify-center">
            {layer.resourceType === "image" && (
                <Image
                    src={layer.url!}
                    alt={layer.name! || "Image description"}
                    fill={true}
                    className={cn(
                        "rounded-lg object-contain",
                        generating ? "animate-pulse" : ""
                    )}
                />
            )}
        </div>
    );

    return (
        <div className="relative w-full h-svh p-24 bg-secondary">
            {layers.map(renderLayer)} {/* Render all layers on top of each other */}
        </div>
    );
}