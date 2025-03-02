import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LayerCanvas() {
    const layers = useLayerStore((state) => state.layers); // Get all layers
    const generating = useImageStore((state) => state.generating);

    if (!layers.length) return null; // Return null if there are no layers

    // // Sort layers based on the order property
    // const sortedLayers = layers.sort((a, b) => a.order - b.order);

    const renderLayer = (layer: Layer) => {
        if (layer.resourceType === 'image') {
            return (
                <div key={layer.id} className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={layer.url!}
                        alt={layer.name! || "Image description"}
                        fill={true}
                        className={cn(
                            "rounded-lg object-contain",
                            generating ? "animate-pulse" : ""
                        )}
                    />
                </div>
            );
        } else if (layer.resourceType === 'text') {
            return (
                <div key={layer.id} className="absolute"
                    style={{
                        left: layer.position?.x || 0,
                        top: layer.position?.y || 0,
                    }}>
                    <span style={{ fontSize: layer.fontSize, color: layer.color }}>
                        {layer.text}
                    </span>
                </div>
            );
        }
    };

    return (
        <div className="relative w-full h-svh p-24 bg-secondary">
            {layers.map(renderLayer)} {/* Render all layers in order */}
        </div>
    );
}