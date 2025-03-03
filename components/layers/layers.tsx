'use client'

import { useLayerStore } from "@/lib/layer-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { cn } from "@/lib/utils";
import { useImageStore } from "@/lib/image-store";
import LayerImage from "./layer-image";
import LayerInfo from "./layer-info";
import ExportAsset from "./layer-eport";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Create a sortable layer item component
function SortableLayerItem({ layer, index, isActive, isGenerating, onSelect }) {
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
                    {!layer.url ? (
                        <p className="text-xs font-medium justify-self-end">
                            New Layer
                        </p>
                    ) : null}
                    <LayerImage layer={layer} />
                    <LayerInfo layer={layer} layerIndex={index} />
                </div>
            </div>
        </div>
    );
}

export default function Layers() {
    const layers = useLayerStore((state) => state.layers);
    const activeLayer = useLayerStore((state) => state.activeLayer);
    const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
    const reorderLayers = useLayerStore((state) => state.reorderLayers);
    const generating = useImageStore((state) => state.generating);

    // Sort layers by order
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

    // Set up sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
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

    return (
        <Card className="basis-[320px] shrink-0 scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl">
            <CardHeader className="sticky top-0 z-50 px-4 py-6 min-h-24 bg-card shadow-sm">
                <div>
                    <CardTitle className="text-sm">{activeLayer?.name || "No Layer Selected"}</CardTitle>
                    {activeLayer?.width && activeLayer?.height ? (
                        <CardDescription>
                            {activeLayer.width}x{activeLayer.height}
                        </CardDescription>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
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
            </CardContent>
            <div className="sticky bottom-0 bg-card flex gap-2 shrink-0">
                {activeLayer?.resourceType && (
                    <ExportAsset resource={activeLayer.resourceType} />
                )}
            </div>
        </Card>
    )
}