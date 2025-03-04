import { useState, useEffect, RefObject } from 'react';
import { Layer } from "@/lib/layer-store";

export default function useLayerDrag(
    activeLayerId: string,
    layers: Layer[],
    updateLayerPosition: (id: string, position: { x: number; y: number }) => void,
    containerRef: RefObject<HTMLDivElement>
) {
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent, layer: Layer) => {
        if (layer.locked) return;

        e.stopPropagation();
        setDragging(true);

        // Calculate offset between mouse position and layer position
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    // Change the event listener to use native MouseEvent
    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || !activeLayerId || !containerRef.current) return;

        const selectedLayer = layers.find(layer => layer.id === activeLayerId);
        if (!selectedLayer || selectedLayer.locked) return;

        // Use the containerRef instead of e.currentTarget
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate new position relative to the container
        const newX = e.clientX - containerRect.left - dragOffset.x;
        const newY = e.clientY - containerRect.top - dragOffset.y;

        // Update layer position
        updateLayerPosition(activeLayerId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove as EventListener);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove as EventListener);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, dragOffset, activeLayerId, containerRef]);

    return {
        dragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp
    };
}
