import { useEffect } from 'react';
import { Layer } from "@/lib/layer-store";

export default function useLayerScale(
    activeLayerId: string,
    layers: Layer[],
    updateLayerScale: (id: string, scale: number) => void
) {
    const handleWheel = (e: React.WheelEvent, layer: Layer) => {
        if (layer.locked || layer.id !== activeLayerId) return;

        e.preventDefault();

        // Get current scale or default to 1
        const currentScale = layer.scale || 1;

        // Calculate new scale (decrease on scroll up, increase on scroll down)
        const scaleFactor = 0.05;
        const newScale = e.deltaY > 0
            ? Math.max(0.1, currentScale - scaleFactor)
            : Math.min(5, currentScale + scaleFactor);

        // Update the layer scale
        updateLayerScale(layer.id, newScale);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeLayerId) return;

            const layer = layers.find(l => l.id === activeLayerId);
            if (!layer || layer.locked) return;

            const currentScale = layer.scale || 1;
            const scaleFactor = e.shiftKey ? 0.1 : 0.01;

            if (e.key === '+' || (e.key === '=' && e.ctrlKey)) {
                e.preventDefault();
                updateLayerScale(layer.id, Math.min(5, currentScale + scaleFactor));
            } else if (e.key === '-' && e.ctrlKey) {
                e.preventDefault();
                updateLayerScale(layer.id, Math.max(0.1, currentScale - scaleFactor));
            } else if (e.key === '0' && e.ctrlKey) {
                e.preventDefault();
                updateLayerScale(layer.id, 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLayerId, layers, updateLayerScale]);

    return { handleWheel };
} 