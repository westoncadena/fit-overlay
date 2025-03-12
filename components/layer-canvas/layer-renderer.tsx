import React from 'react';
import Image from "next/image";
import { Layer } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import StravaActivityRenderer from './strava-activity-renderer';

interface LayerRendererProps {
    layer: Layer;
    isSelected: boolean;
    generating: boolean;
    onWheel: (e: React.WheelEvent, layer: Layer) => void;
    onSelect: (id: string) => void;
}

export default function LayerRenderer({ layer, isSelected, generating, onWheel, onSelect }: LayerRendererProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: layer.id,
        disabled: layer.locked || generating,
        data: {
            layer,
            type: 'layer'
        }
    });

    // Get position from either direct x/y or position object
    const x = layer.position?.x ?? 0;
    const y = layer.position?.y ?? 0;

    // Handle click to select the layer
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();  // Prevent event from bubbling to canvas
        onSelect(layer.id);
    };

    // Apply the transform from DnD Kit
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${layer.width || 0}px`,
        height: `${layer.height || 0}px`,
        transformOrigin: 'center',
        scale: `${layer.scale || 1}`,
        opacity: isDragging ? 0.8 : 1,
        cursor: layer.locked ? 'not-allowed' : 'move',
        zIndex: layer.order,
        transition: isDragging ? 'none' : 'box-shadow 0.2s, border 0.2s',
        boxShadow: isSelected ? '0 0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
        border: isSelected ? '2px solid rgba(59, 130, 246, 0.8)' : 'none',
        // Apply transform only during drag
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        touchAction: 'none',
    };

    if (layer.resourceType === 'image') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`${generating ? 'pointer-events-none' : ''}`}
                onWheel={(e) => onWheel(e, layer)}
                onClick={handleClick}
                {...attributes}
                {...listeners}
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
                            "object-contain",
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
                ref={setNodeRef}
                key={layer.id}
                style={{
                    ...style,
                    scale: undefined,
                    transform: transform ? CSS.Transform.toString(transform) : undefined,
                }}
                onWheel={(e) => onWheel(e, layer)}
                onClick={handleClick}
                {...attributes}
                {...listeners}
                className="layer-item"
            >
                <span
                    style={{
                        fontSize: `${(layer.fontSize || 16) * (layer.scale || 1)}px`,
                        color: layer.color || '#000000',
                        whiteSpace: 'pre-wrap',
                        userSelect: 'none',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.2,
                    }}
                >
                    {layer.text || 'Text'}
                </span>
            </div>
        );
    } else if (layer.resourceType === 'component') {
        return (
            <div
                ref={setNodeRef}
                style={{
                    ...style,
                    scale: undefined,
                    transform: transform ? CSS.Transform.toString(transform) : undefined,
                }}
                onClick={handleClick}
                onWheel={(e) => onWheel(e, layer)}
                {...attributes}
                {...listeners}
                className="layer-item"
            >
                <StravaActivityRenderer
                    layer={layer}
                    style={{
                        transform: `scale(${layer.scale || 1})`,
                        transformOrigin: 'top left',
                    }}
                />
            </div>
        );
    }

    return null;
} 