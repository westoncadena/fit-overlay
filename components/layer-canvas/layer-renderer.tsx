import React from 'react';
import Image from "next/image";
import { Layer } from "@/lib/layer-store";
import { cn } from "@/lib/utils";

type LayerRendererProps = {
    layer: Layer;
    isSelected: boolean;
    generating: boolean;
    onMouseDown: (e: React.MouseEvent, layer: Layer) => void;
    onWheel: (e: React.WheelEvent, layer: Layer) => void;
};

export default function LayerRenderer({
    layer,
    isSelected,
    generating,
    onMouseDown,
    onWheel
}: LayerRendererProps) {
    const layerScale = layer.scale || 1;

    const layerStyles = {
        position: 'absolute' as const,
        left: layer.position?.x || 0,
        top: layer.position?.y || 0,
        transform: `scale(${layerScale})`,
        transformOrigin: 'top left',
        border: isSelected ? '2px solid #3b82f6' : 'none',
    };

    if (layer.resourceType === 'image') {
        return (
            <div
                key={layer.id}
                style={layerStyles}
                className={cn(
                    "flex items-center justify-center",
                    isSelected ? "ring-2 ring-blue-500" : ""
                )}
                onMouseDown={(e) => onMouseDown(e, layer)}
                onWheel={(e) => onWheel(e, layer)}
            >
                <div className="relative" style={{
                    width: layer.width || 200,
                    height: layer.height || 200
                }}>
                    <Image
                        src={layer.url!}
                        alt={layer.name || "Image"}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn(
                            "rounded-lg object-contain",
                            generating && isSelected ? "animate-pulse" : ""
                        )}
                        draggable={false}
                    />
                </div>
            </div>
        );
    } else if (layer.resourceType === 'text') {
        return (
            <div
                key={layer.id}
                style={layerStyles}
                onMouseDown={(e) => onMouseDown(e, layer)}
                onWheel={(e) => onWheel(e, layer)}
            >
                <span
                    style={{
                        fontSize: `${layer.fontSize || 16}px`,
                        color: layer.color || '#000000',
                        whiteSpace: 'pre-wrap',
                        userSelect: 'none'
                    }}
                >
                    {layer.text || 'Text'}
                </span>
            </div>
        );
    }

    return null;
} 