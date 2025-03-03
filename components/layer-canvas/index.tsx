import React, { useRef, useEffect } from 'react';
import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { useCanvasSize } from './use-canvas-size';
import useLayerDrag from './use-layer-drag';
import useLayerScale from './use-layer-scale';
import LayerRenderer from './layer-renderer';
import html2canvas from 'html2canvas';

// Extend the Window interface to include our exportCanvas function
declare global {
    interface Window {
        exportCanvas: () => void;
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

    // Get canvas size
    const canvasSize = useCanvasSize(containerRef);

    // Sort layers by order property (lower order = displayed below)
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

    // Layer dragging functionality
    const { handleMouseDown, handleMouseMove, handleMouseUp } = useLayerDrag(
        activeLayer?.id || '',
        layers,
        updateLayerPosition,
        containerRef
    );

    // Layer scaling functionality
    const { handleWheel } = useLayerScale(
        activeLayer?.id || '',
        layers,
        updateLayerScale
    );

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
                    link.download = `canvas-export-${new Date().toISOString().slice(0, 10)}.png`;
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
    }, []);

    if (!layers.length) return (
        <div className="relative w-full h-svh flex items-center justify-center bg-secondary">
            <p className="text-muted-foreground">No layers added. Create a layer to get started.</p>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="relative w-full h-svh p-4 bg-secondary overflow-hidden"
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            style={{
                backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
        >
            <div
                ref={canvasContentRef}
                className="absolute inset-8 bg-white rounded-lg shadow-lg"
            >
                {sortedLayers.map(layer => (
                    <LayerRenderer
                        key={layer.id}
                        layer={layer}
                        isSelected={layer.id === activeLayer?.id}
                        generating={generating}
                        onMouseDown={handleMouseDown}
                        onWheel={handleWheel}
                    />
                ))}
            </div>
        </div>
    );
} 