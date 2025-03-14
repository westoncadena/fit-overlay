import React, { useRef, useEffect } from 'react';
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useProjectStore, useScaledCanvasDimensions } from "@/lib/project-store";
import { useCanvasSize } from './use-canvas-size';
import useLayerScale from './use-layer-scale';
import LayerRenderer from './layer-renderer';
import html2canvas from 'html2canvas-pro';

// Extend the Window interface to include our exportCanvas function
declare global {
    interface Window {
        exportCanvas?: () => void;
        exportCanvasForMobile?: boolean;
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
    const updateLayerDimensions = useLayerStore((state) => state.updateLayerDimensions);
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
    const { handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd } = useLayerScale(
        activeLayer?.id || '',
        layers,
        updateLayerScale
    );

    // Handle layer position update
    const handleLayerMove = (layerId: string, position: { x: number, y: number }) => {
        updateLayerPosition(layerId, position);
    };

    // Handle layer resize
    const handleLayerResize = (layerId: string, width: number, height: number) => {
        updateLayerDimensions(layerId, width, height);
    };

    // Add keyboard movement for selected layers (arrow keys)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeLayer || generating) return;

            const layer = layers.find(l => l.id === activeLayer.id);
            if (!layer || layer.locked) return;

            const currentX = layer.position?.x ?? 0;
            const currentY = layer.position?.y ?? 0;
            const newPosition = { x: currentX, y: currentY };

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
                // Create a clone of the canvas content for export
                const exportContainer = canvasContentRef.current.cloneNode(true) as HTMLElement;

                // Temporarily append to document but hide it
                exportContainer.style.position = 'absolute';
                exportContainer.style.left = '-9999px';
                exportContainer.style.transform = 'none'; // Remove scaling
                document.body.appendChild(exportContainer);

                // Process all layers to handle scaling correctly
                const layerElements = exportContainer.querySelectorAll('.layer-item');
                layerElements.forEach(layerEl => {
                    const el = layerEl as HTMLElement;

                    // Get the original scale and apply it directly to dimensions
                    const originalScale = parseFloat(el.style.scale || '1');
                    if (originalScale !== 1) {
                        // Remove scale property
                        el.style.scale = '';

                        // Apply scale to width and height instead
                        const width = parseFloat(el.style.width || '0');
                        const height = parseFloat(el.style.height || '0');
                        el.style.width = `${width * originalScale}px`;
                        el.style.height = `${height * originalScale}px`;

                        // Adjust position to maintain center point
                        const left = parseFloat(el.style.left || '0');
                        const top = parseFloat(el.style.top || '0');
                        const widthDiff = width * originalScale - width;
                        const heightDiff = height * originalScale - height;
                        el.style.left = `${left - widthDiff / 2}px`;
                        el.style.top = `${top - heightDiff / 2}px`;
                    }
                });

                // Use html2canvas on the modified clone
                const canvas = await html2canvas(exportContainer, {
                    backgroundColor: 'white',
                    scale: 2, // Higher scale for better quality
                    useCORS: true, // Allow cross-origin images
                    allowTaint: true,
                    logging: false,
                });

                // Clean up the temporary element
                document.body.removeChild(exportContainer);

                // Convert to blob and download
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Failed to create blob from canvas');
                        return;
                    }

                    // Use project name for the file name, with fallback and sanitization
                    const safeProjectName = projectName
                        ? projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
                        : 'canvas-export';

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `${safeProjectName}.png`;
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
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
        >
            <div
                ref={canvasContentRef}
                className="absolute shadow-lg bg-white overflow-hidden"
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
                {sortedLayers.map((layer) => (
                    <LayerRenderer
                        key={layer.id}
                        layer={layer}
                        isSelected={activeLayer?.id === layer.id}
                        generating={generating}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onSelect={setActiveLayer}
                        onMove={handleLayerMove}
                        onResize={handleLayerResize}
                    />
                ))}
            </div>
        </div>
    );
}


