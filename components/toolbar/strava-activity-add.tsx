"use client"

import { useState, useEffect } from "react";
import { useLayerStore } from "@/lib/layer-store";
import { useStravaStore } from "@/lib/strava-store";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "lucide-react";
import { StravaActivity } from "@/lib/strava-store/types";

export default function StravaActivityAdd() {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null);

    const addLayer = useLayerStore((state) => state.addLayer);
    const activities = useStravaStore((state) => state.activities);
    const isLoading = useStravaStore((state) => state.isLoading);
    const fetchActivities = useStravaStore((state) => state.fetchActivities);

    // Fetch activities when the popover opens if we don't have any
    useEffect(() => {
        if (popoverOpen && activities.length === 0 && !isLoading) {
            fetchActivities();
        }
    }, [popoverOpen, activities.length, isLoading, fetchActivities]);

    const handleAddActivityLayer = () => {
        if (selectedActivity) {
            const newLayer = {
                id: crypto.randomUUID(),
                resourceType: 'component' as const,
                stravaActivityId: selectedActivity.id,
                name: `Strava: ${selectedActivity.name}`,
                position: { x: 100, y: 100 }, // Default position
                scale: 1,
                order: 0, // Set the order for rendering
            };

            addLayer(newLayer);
            setSelectedActivity(null);
            setPopoverOpen(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatDistance = (meters: number) => {
        return (meters / 1000).toFixed(1) + " km";
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Add Activity
                        <Activity size={18} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col p-2">
                    <h3 className="font-medium mb-2">Select Strava Activity</h3>

                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted-foreground mb-2">No activities found</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchActivities()}
                            >
                                Refresh Activities
                            </Button>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="h-60 pr-4">
                                <div className="space-y-2">
                                    {activities.map(activity => (
                                        <div
                                            key={activity.id}
                                            className={`flex flex-col p-2 border rounded-md cursor-pointer transition-colors ${selectedActivity?.id === activity.id
                                                ? 'bg-primary/10 border-primary/30'
                                                : 'hover:bg-accent'
                                                }`}
                                            onClick={() => setSelectedActivity(activity)}
                                        >
                                            <div className="font-medium truncate">{activity.name}</div>
                                            <div className="text-xs text-muted-foreground flex justify-between">
                                                <span>{formatDate(activity.start_date)}</span>
                                                <span>{formatDistance(activity.distance)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <Button
                                onClick={handleAddActivityLayer}
                                className="mt-4"
                                disabled={!selectedActivity}
                            >
                                Add Activity Layer
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
} 