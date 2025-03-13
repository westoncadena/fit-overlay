import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import { Layer } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import interact from 'interactjs';
import StravaActivityRenderer from './strava-activity-renderer';

interface LayerRendererProps {
    layer: Layer;
    isSelected: boolean;
    generating: boolean;
    onWheel: (e: React.WheelEvent, layer: Layer) => void;
    onTouchStart: (e: React.TouchEvent, layer: Layer) => void;
    onTouchMove: (e: React.TouchEvent, layer: Layer) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onSelect: (id: string) => void;
    onMove: (id: string, position: { x: number, y: number }) => void;
    onResize: (id: string, width: number, height: number) => void;
}

export default function LayerRenderer({
    layer,
    isSelected,
    generating,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onSelect,
    onMove,
    onResize
}: LayerRendererProps) {
    const nodeRef = useRef<HTMLDivElement>(null);

    // Get position from either direct x/y or position object
    const x = layer.position?.x ?? 0;
    const y = layer.position?.y ?? 0;

    // Handle click to select the layer
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();  // Prevent event from bubbling to canvas
        onSelect(layer.id);
    };

    // Apply styles
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${layer.width || 0}px`,
        height: `${layer.height || 0}px`,
        transformOrigin: 'center',
        scale: `${layer.scale || 1}`,
        opacity: 1,
        cursor: layer.locked ? 'not-allowed' : 'move',
        zIndex: layer.order,
        transition: 'box-shadow 0.2s, border 0.2s',
        boxShadow: isSelected ? '0 0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
        border: isSelected ? '2px solid rgba(59, 130, 246, 0.8)' : 'none',
        touchAction: 'none',
    };

    // Set up interact.js
    useEffect(() => {
        if (!nodeRef.current || layer.locked || generating) return;

        const element = nodeRef.current;

        // Initialize position data
        const position = { x: 0, y: 0 };

        const interactable = interact(element)
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: 10, y: 10 })
                        ],
                        range: 10,
                        relativePoints: [{ x: 0, y: 0 }]
                    })
                ],
                listeners: {
                    start: () => {
                        // Store initial position
                        position.x = x;
                        position.y = y;
                    },
                    move: (event) => {
                        // Update position based on drag delta
                        position.x += event.dx;
                        position.y += event.dy;

                        // Apply position to element during drag
                        event.target.style.left = `${position.x}px`;
                        event.target.style.top = `${position.y}px`;
                    },
                    end: () => {
                        // Update layer position in store
                        onMove(layer.id, { x: position.x, y: position.y });
                    }
                }
            });

        // Add resizable if it's not a text or component layer
        if (layer.resourceType === 'image') {
            interactable.resizable({
                // Only enable the bottom-right corner for resizing
                edges: { left: false, right: true, bottom: true, top: false },
                // Restrict resize to only the bottom-right corner
                invert: 'none',
                listeners: {
                    move: (event) => {
                        // Update the element style during resize
                        const target = event.target;

                        // Only apply width and height changes (no position changes)
                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;
                    },
                    end: (event) => {
                        // Update layer size in store
                        onResize(layer.id, event.rect.width, event.rect.height);
                    }
                }
            });
        }

        return () => {
            interactable.unset();
        };
    }, [layer, isSelected, generating, x, y, onMove, onResize]);

    if (layer.resourceType === 'image') {
        return (
            <div
                ref={nodeRef}
                style={style}
                className={`${generating ? 'pointer-events-none' : ''} layer-item`}
                onWheel={(e) => onWheel(e, layer)}
                onTouchStart={(e) => onTouchStart(e, layer)}
                onTouchMove={(e) => onTouchMove(e, layer)}
                onTouchEnd={onTouchEnd}
                onClick={handleClick}
            >
                <div className="relative" style={{
                    width: '100%',
                    height: '100%'
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
                {isSelected && (
                    // Only show the resize handle in the bottom-right corner
                    <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-blue-500 rounded-full cursor-se-resize" />
                )}
            </div>
        );
    } else if (layer.resourceType === 'text') {
        return (
            <div
                ref={nodeRef}
                key={layer.id}
                style={{
                    ...style,
                    scale: undefined,
                }}
                onWheel={(e) => onWheel(e, layer)}
                onTouchStart={(e) => onTouchStart(e, layer)}
                onTouchMove={(e) => onTouchMove(e, layer)}
                onTouchEnd={onTouchEnd}
                onClick={handleClick}
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
                ref={nodeRef}
                style={{
                    ...style,
                    scale: undefined,
                }}
                onClick={handleClick}
                onWheel={(e) => onWheel(e, layer)}
                onTouchStart={(e) => onTouchStart(e, layer)}
                onTouchMove={(e) => onTouchMove(e, layer)}
                onTouchEnd={onTouchEnd}
                className="layer-item"
            >
                <StravaActivityRenderer
                    layer={layer}
                    style={{
                        transform: "none",
                        transformOrigin: 'top left',
                    }}
                />
            </div>
        );
    }

    return null;
} 