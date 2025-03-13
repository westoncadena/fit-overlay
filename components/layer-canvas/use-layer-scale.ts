import { useEffect, useRef } from 'react';
import { Layer } from "@/lib/layer-store";

export default function useLayerScale(
    activeLayerId: string,
    layers: Layer[],
    updateLayerScale: (id: string, scale: number) => void
) {
    // Track touch points for pinch gesture
    const touchPointsRef = useRef<{ x: number, y: number }[]>([]);
    const initialDistanceRef = useRef<number | null>(null);
    const initialScaleRef = useRef<number>(1);

    // Calculate distance between two touch points
    const getDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

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

    // Handle touch events for pinch-to-zoom
    const handleTouchStart = (e: React.TouchEvent, layer: Layer) => {
        if (layer.locked || layer.id !== activeLayerId) return;

        // Only track pinch gesture with exactly 2 touch points
        if (e.touches.length === 2) {
            e.preventDefault();

            // Store the initial touch points
            touchPointsRef.current = [
                { x: e.touches[0].clientX, y: e.touches[0].clientY },
                { x: e.touches[1].clientX, y: e.touches[1].clientY }
            ];

            // Calculate initial distance between touch points
            initialDistanceRef.current = getDistance(
                touchPointsRef.current[0],
                touchPointsRef.current[1]
            );

            // Store the initial scale
            initialScaleRef.current = layer.scale || 1;
        }
    };

    const handleTouchMove = (e: React.TouchEvent, layer: Layer) => {
        if (layer.locked || layer.id !== activeLayerId || !initialDistanceRef.current) return;

        // Only handle pinch gesture with exactly 2 touch points
        if (e.touches.length === 2) {
            e.preventDefault();

            // Get current touch points
            const currentPoints = [
                { x: e.touches[0].clientX, y: e.touches[0].clientY },
                { x: e.touches[1].clientX, y: e.touches[1].clientY }
            ];

            // Calculate current distance
            const currentDistance = getDistance(currentPoints[0], currentPoints[1]);

            // Calculate scale ratio
            const scaleRatio = currentDistance / initialDistanceRef.current;

            // Apply scale ratio to initial scale
            const newScale = Math.min(5, Math.max(0.1, initialScaleRef.current * scaleRatio));

            // Update the layer scale
            updateLayerScale(layer.id, newScale);
        }
    };

    const handleTouchEnd = () => {
        // Reset touch tracking
        initialDistanceRef.current = null;
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

    return {
        handleWheel,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
} 