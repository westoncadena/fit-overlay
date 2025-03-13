'use client'

import { useLayerStore } from "@/lib/layer-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import LayerImage from "./layer-image";
import LayerInfo from "./layer-info";
import { Layer } from "@/lib/layer-store";
import ExportAsset from "./layer-eport";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

// Create a sortable layer item component
function SortableLayerItem({ layer, index, isActive, isGenerating, onSelect }: { layer: Layer, index: number, isActive: boolean, isGenerating: boolean, onSelect: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: layer.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Get appropriate layer name based on type
    const getLayerDisplayName = () => {
        if (layer.url) {
            return null; // LayerImage will handle this
        } else if (layer.resourceType === 'text') {
            return layer.text ? layer.text.substring(0, 20) + (layer.text.length > 20 ? '...' : '') : 'Text Layer';
        } else if (layer.resourceType === 'component') {
            if (layer.stravaActivityId) {
                return layer.name || 'Strava Activity';
            }
            return layer.name || 'Component';
        }
        return 'New Layer';
    };

    // Get icon based on layer type
    const getLayerIcon = () => {
        if (layer.resourceType === 'text') {
            return <span className="text-xs text-muted-foreground mr-1">T</span>;
        } else if (layer.resourceType === 'component' && layer.stravaActivityId) {
            return <span className="text-xs text-[#fc4c02] mr-1">S</span>;
        }
        return null;
    };

    const layerDisplayName = getLayerDisplayName();

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
                {
                    "animate-pulse": isGenerating,
                    "border-primary": isActive,
                    "bg-muted": isDragging
                }
            )}
            onClick={() => {
                if (isGenerating) return;
                onSelect(layer.id);
            }}
        >
            <div className="relative p-4 flex items-center">
                <div className="flex gap-2 items-center h-8 w-full justify-between">
                    {layerDisplayName && (
                        <div className="flex items-center text-xs font-medium justify-self-end overflow-hidden">
                            {getLayerIcon()}
                            <span className="truncate">{layerDisplayName}</span>
                        </div>
                    )}
                    <LayerImage layer={layer} />
                    <LayerInfo layer={layer} layerIndex={index} />
                </div>
            </div>
        </div>
    );
}

export default function LayersMenu() {
    const layers = useLayerStore((state) => state.layers);
    const activeLayer = useLayerStore((state) => state.activeLayer);
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
    const reorderLayers = useLayerStore((state) => state.reorderLayers);
    const generating = useImageStore((state) => state.generating);
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Sort layers by order
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

    // Set up sensors for drag detection - ensure this is always called
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
                delay: 100,
                tolerance: 5,
            },
        }),
        useSensor(TouchSensor, {
            // Touch-specific constraints
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortedLayers.findIndex(layer => layer.id === active.id);
        const newIndex = sortedLayers.findIndex(layer => layer.id === over.id);

        reorderLayers(oldIndex, newIndex);
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {/* Mobile toggle button - only visible when menu is closed */}
            {!isExpanded && (
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden fixed top-20 right-4 z-[100]"
                    onClick={toggleExpanded}
                    aria-label="Open layers panel"
                >
                    <Layers className="h-7 w-7" />
                </Button>
            )}

            <Card className={cn(
                "transition-all duration-300 ease-in-out",
                "md:basis-[320px] md:shrink-0 md:static md:h-auto",
                "scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl",
                isExpanded ?
                    "fixed inset-0 z-[100] h-full w-full" :
                    "hidden md:flex"
            )}>
                <CardHeader className="sticky top-0 z-100 px-4 py-6 min-h-24 bg-card shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Layers
                            </CardTitle>
                            {activeLayer?.name && (
                                <CardDescription>
                                    {activeLayer.name}
                                    {activeLayer?.width && activeLayer?.height ? (
                                        <span className="ml-1">
                                            ({activeLayer.width}x{activeLayer.height})
                                        </span>
                                    ) : null}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    {layers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <p className="text-sm">No layers yet</p>
                            <p className="text-xs">Add layers to your project to see them here</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sortedLayers.map(layer => layer.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sortedLayers.map((layer, index) => (
                                    <SortableLayerItem
                                        key={layer.id}
                                        layer={layer}
                                        index={index}
                                        isActive={activeLayer.id === layer.id}
                                        isGenerating={generating}
                                        onSelect={setActiveLayer}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </CardContent>
                <div className="sticky top-0 bg-card flex gap-2 shrink-0 p-4">
                    {activeLayer?.resourceType && !isExpanded && (
                        <ExportAsset resource={activeLayer.resourceType} />
                    )}
                    {isExpanded ? (
                        <Button
                            variant="outline"
                            className="w-full md:hidden"
                            onClick={toggleExpanded}
                        >
                            <X className="h-5 w-5 mr-2" />
                            Close Layers
                        </Button>
                    ) : null}
                </div>
            </Card>
        </>
    );
}