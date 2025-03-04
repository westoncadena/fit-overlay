import React, { useRef, useEffect } from 'react';
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useProjectStore, useScaledCanvasDimensions } from "@/lib/project-store";
import { useCanvasSize } from './use-canvas-size';
import useLayerScale from './use-layer-scale';
import LayerRenderer from './layer-renderer';
import html2canvas from 'html2canvas';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor, DragMoveEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';

// Extend the Window interface to include our exportCanvas function
declare global {
    interface Window {
        exportCanvas?: () => void;
    }
}

export default function LayerCanvas() {
    const containerRef = useRef<HTMLDivElement>(null!);
    const canvasContentRef = useRef<HTMLDivElement>(null!);
    const layers = useLayerStore((state) => state.layers);
    const activeLayer = useLayerStore((state) => state.activeLayer);
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
    const updateLayerPosition = useLayerStore((state) => state.updateLayerPosition);
    const updateLayerScale = useLayerStore((state) => state.updateLayerScale);
    const generating = useImageStore((state) => state.generating);

    // Get canvas dimensions from project store
    const { canvasWidth, canvasHeight, calculateScale } = useScaledCanvasDimensions();

    console.log("canvasWidth", canvasWidth, "canvasHeight", canvasHeight);

    // Get the container size
    const containerSize = useCanvasSize(containerRef);

    // Calculate the scale based on container size
    const scale = calculateScale(containerSize.width, containerSize.height);

    console.log("Container size:", containerSize, "Scale:", scale);

    const projectName = useProjectStore((state) => state.projectName);

    // Sort layers by order property (lower order = displayed below)
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

    // Layer scaling functionality
    const { handleWheel } = useLayerScale(
        activeLayer?.id || '',
        layers,
        updateLayerScale
    );

    // Configure DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start dragging after moving 5px
            }
        })
    );

    // Handle drag start - set active layer
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveLayer(active.id as string);
    };

    const handleDragMove = (event: DragMoveEvent) => {
    }

    // Handle drag end - update layer position with improved positioning
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const layerId = active.id as string;

        // Find the layer
        const layer = layers.find(l => l.id === layerId);
        if (!layer || layer.locked) return;

        // Get current position (handle both formats)
        const currentX = layer.position?.x ?? 0;
        const currentY = layer.position?.y ?? 0;

        // Calculate new position based on delta and scale
        // Divide by scale to ensure movement is consistent regardless of zoom level
        const newPosition = {
            x: currentX + delta.x / scale,
            y: currentY + delta.y / scale
        };

        // Ensure the layer stays within canvas boundaries (optional)
        const boundedPosition = {
            x: Math.max(0, Math.min(newPosition.x, canvasWidth - (layer.width || 0))),
            y: Math.max(0, Math.min(newPosition.y, canvasHeight - (layer.height || 0)))
        };

        // Update layer position
        updateLayerPosition(layerId, boundedPosition);
    };

    // Add keyboard movement for selected layers (arrow keys)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeLayer || generating) return;

            const layer = layers.find(l => l.id === activeLayer.id);
            if (!layer || layer.locked) return;

            const currentX = layer.position?.x ?? 0;
            const currentY = layer.position?.y ?? 0;
            let newPosition = { x: currentX, y: currentY };

            // Move by 1px normally, 10px with shift key
            const moveAmount = e.shiftKey ? 10 : 1;

            switch (e.key) {
                case 'ArrowLeft':
                    newPosition.x -= moveAmount;
                    break;
                case 'ArrowRight':
                    newPosition.x += moveAmount;
                    break;
                case 'ArrowUp':
                    newPosition.y -= moveAmount;
                    break;
                case 'ArrowDown':
                    newPosition.y += moveAmount;
                    break;
                default:
                    return; // Exit if not an arrow key
            }

            e.preventDefault();
            updateLayerPosition(activeLayer.id, newPosition);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLayer, layers, generating, updateLayerPosition]);

    // Clear selection when clicking on the canvas background
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            setActiveLayer("");
        }
    };

    // Set up the canvas export function
    useEffect(() => {
        window.exportCanvas = async () => {
            if (!canvasContentRef.current) return;

            try {
                // Use html2canvas to capture the canvas content
                const canvas = await html2canvas(canvasContentRef.current, {
                    backgroundColor: 'white',
                    scale: 2, // Higher scale for better quality
                    useCORS: true, // Allow cross-origin images
                    allowTaint: true,
                    logging: false
                });

                // Convert to blob and download
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Failed to create blob from canvas');
                        return;
                    }

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `${projectName || 'canvas-export'}-${new Date().toISOString().slice(0, 10)}.png`;
                    link.href = url;
                    link.click();

                    // Clean up
                    URL.revokeObjectURL(url);
                }, 'image/png');
            } catch (error) {
                console.error('Error exporting canvas:', error);
            }
        };

        // Clean up
        return () => {
            delete window.exportCanvas;
        };
    }, [projectName]);

    if (!layers.length) return (
        <div className="relative w-full h-svh flex items-center justify-center bg-secondary">
            <p className="text-muted-foreground">No layers added. Create a layer to get started.</p>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="relative w-full h-svh p-4 bg-secondary overflow-hidden"
            onClick={handleCanvasClick}
            style={{
                backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
        >
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
            >
                <div
                    ref={canvasContentRef}
                    className="absolute shadow-lg bg-white"
                    style={{
                        width: `${canvasWidth}px`,
                        height: `${canvasHeight}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'center',
                        left: '50%',
                        top: '50%',
                        marginLeft: `-${canvasWidth / 2}px`,
                        marginTop: `-${canvasHeight / 2}px`,
                        border: '1px solid #ddd'
                    }}
                >
                    {sortedLayers.map(layer => (
                        <LayerRenderer
                            key={layer.id}
                            layer={layer}
                            isSelected={layer.id === activeLayer?.id}
                            generating={generating}
                            onWheel={handleWheel}
                            onSelect={setActiveLayer}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
} 