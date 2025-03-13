"use client"

import { useState } from "react";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function DownloadTool() {
    const activeLayer = useLayerStore((state) => state.activeLayer);
    const [selected, setSelected] = useState("original");
    const [exportTab, setExportTab] = useState("layer");
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Function to download the active layer
    const handleLayerDownload = async () => {
        if (activeLayer?.publicId) {
            try {
                const res = await fetch(
                    `/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch image URL");
                }
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                // For mobile compatibility
                if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                    // Open the URL directly in a new tab for mobile devices
                    window.open(data.url, '_blank');
                } else {
                    // Desktop download flow
                    // Fetch the image
                    const imageResponse = await fetch(data.url);
                    if (!imageResponse.ok) {
                        throw new Error("Failed to fetch image");
                    }
                    const imageBlob = await imageResponse.blob();

                    // Create a download link and trigger the download
                    const downloadUrl = URL.createObjectURL(imageBlob);
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = data.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up the object URL
                    URL.revokeObjectURL(downloadUrl);
                }
                setPopoverOpen(false);
            } catch (error) {
                console.error("Download failed:", error);
            }
        }
    };

    // Function to export the entire canvas
    const handleCanvasExport = () => {
        // Trigger the canvas export function defined in the global window object
        if (typeof window !== 'undefined' && window.exportCanvas) {
            // For mobile compatibility
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Set a flag to open the exported canvas in a new tab
                window.exportCanvasForMobile = true;
            }
            window.exportCanvas();
            setPopoverOpen(false);
        } else {
            console.error("Canvas export function not available");
        }
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Export
                        <Download size={18} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="p-1">
                    <h3 className="text-center text-lg font-medium pb-2">Export</h3>

                    <Tabs defaultValue="layer" onValueChange={setExportTab} value={exportTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="canvas">Canvas</TabsTrigger>
                            <TabsTrigger value="layer">Layer</TabsTrigger>
                        </TabsList>


                        <TabsContent value="canvas" className="space-y-3">
                            <Card className="p-2">
                                <CardContent className="p-0">
                                    <CardTitle className="text-sm">Canvas Export</CardTitle>
                                    <CardDescription className="text-xs">
                                        Export the entire canvas as a PNG image
                                    </CardDescription>
                                </CardContent>
                            </Card>
                            <Button onClick={handleCanvasExport} className="w-full">
                                Export Canvas as PNG
                            </Button>
                        </TabsContent>
                        <TabsContent value="layer" className="space-y-3">
                            {activeLayer?.url ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <Card
                                            onClick={() => setSelected("original")}
                                            className={cn(
                                                selected === "original" ? "border-primary" : null,
                                                "p-2 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-sm">Original</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {activeLayer.width}X{activeLayer.height}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            onClick={() => setSelected("large")}
                                            className={cn(
                                                selected === "large" ? "border-primary" : null,
                                                "p-2 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-sm">Large</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {(activeLayer.width! * 0.7).toFixed(0)}X
                                                    {(activeLayer.height! * 0.7).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            onClick={() => setSelected("medium")}
                                            className={cn(
                                                selected === "medium" ? "border-primary" : null,
                                                "p-2 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-sm">Medium</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {(activeLayer.width! * 0.5).toFixed(0)}X
                                                    {(activeLayer.height! * 0.5).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            onClick={() => setSelected("small")}
                                            className={cn(
                                                selected === "small" ? "border-primary" : null,
                                                "p-2 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-sm">Small</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {(activeLayer.width! * 0.3).toFixed(0)}X
                                                    {(activeLayer.height! * 0.3).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <Button onClick={handleLayerDownload} className="w-full">
                                        Download {selected} layer
                                    </Button>
                                </>
                            ) : (
                                <p className="text-center text-muted-foreground text-sm">
                                    No layer selected or layer has no URL
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </PopoverContent>
        </Popover>
    );
}
