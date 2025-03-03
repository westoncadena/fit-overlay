"use client"

import { useLayerStore } from "@/lib/layer-store"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Download } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "../ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export default function ExportAsset({ resource }: { resource: string }) {
    const activeLayer = useLayerStore((state) => state.activeLayer)
    const [selected, setSelected] = useState("original")
    const [exportTab, setExportTab] = useState("layer")

    // Function to download the active layer
    const handleLayerDownload = async () => {
        if (activeLayer?.publicId) {
            try {
                const res = await fetch(
                    `/api/download?publicId=${activeLayer.publicId}&quality=${selected}&resource_type=${activeLayer.resourceType}&format=${activeLayer.format}&url=${activeLayer.url}`
                )
                if (!res.ok) {
                    throw new Error("Failed to fetch image URL")
                }
                const data = await res.json()
                console.log(data)
                if (data.error) {
                    throw new Error(data.error)
                }

                // Fetch the image
                const imageResponse = await fetch(data.url)
                if (!imageResponse.ok) {
                    throw new Error("Failed to fetch image")
                }
                const imageBlob = await imageResponse.blob()

                // Create a download link and trigger the download
                const downloadUrl = URL.createObjectURL(imageBlob)
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = data.filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                // Clean up the object URL
                URL.revokeObjectURL(downloadUrl)
            } catch (error) {
                console.error("Download failed:", error)
                // Here you could show an error message to the user
            }
        }
    }

    // Function to export the entire canvas
    const handleCanvasExport = () => {
        // Trigger the canvas export function defined in the global window object
        if (typeof window !== 'undefined' && window.exportCanvas) {
            window.exportCanvas();
        } else {
            console.error("Canvas export function not available");
        }
    }

    return (
        <Dialog>
            <DialogTitle />
            <DialogTrigger asChild>
                <Button className="w-full flex gap-2"
                    variant="outline">
                    <span> Export </span>
                    <Download size={18} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <h3 className="text-center text-2xl font-medium pb-4">Export</h3>

                    <Tabs defaultValue="layer" onValueChange={setExportTab} value={exportTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="layer">Export Layer</TabsTrigger>
                            <TabsTrigger value="canvas">Export Canvas</TabsTrigger>
                        </TabsList>

                        <TabsContent value="layer" className="space-y-4">
                            {activeLayer?.url ? (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <Card
                                            onClick={() => setSelected("original")}
                                            className={cn(
                                                selected === "original" ? "border-primary" : null,
                                                "p-4 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-md">Original</CardTitle>
                                                <CardDescription>
                                                    {activeLayer.width}X{activeLayer.height}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            onClick={() => setSelected("large")}
                                            className={cn(
                                                selected === "large" ? "border-primary" : null,
                                                "p-4 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-md">Large</CardTitle>
                                                <CardDescription>
                                                    {(activeLayer.width! * 0.7).toFixed(0)}X
                                                    {(activeLayer.height! * 0.7).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            onClick={() => setSelected("medium")}
                                            className={cn(
                                                selected === "medium" ? "border-primary" : null,
                                                "p-4 cursor-pointer"
                                            )}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-md">Medium</CardTitle>
                                                <CardDescription>
                                                    {(activeLayer.width! * 0.5).toFixed(0)}X
                                                    {(activeLayer.height! * 0.5).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                        <Card
                                            className={cn(
                                                selected === "small" ? "border-primary" : null,
                                                "p-4 cursor-pointer"
                                            )}
                                            onClick={() => setSelected("small")}
                                        >
                                            <CardContent className="p-0">
                                                <CardTitle className="text-md">Small</CardTitle>
                                                <CardDescription>
                                                    {(activeLayer.width! * 0.3).toFixed(0)}X
                                                    {(activeLayer.height! * 0.3).toFixed(0)}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <Button onClick={handleLayerDownload} className="w-full">
                                        Download {selected} {resource}
                                    </Button>
                                </>
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    No layer selected or layer has no URL
                                </p>
                            )}
                        </TabsContent>

                        <TabsContent value="canvas" className="space-y-4">
                            <Card className="p-4">
                                <CardContent className="p-0">
                                    <CardTitle className="text-md">Canvas Export</CardTitle>
                                    <CardDescription>
                                        Export the entire canvas as a PNG image
                                    </CardDescription>
                                </CardContent>
                            </Card>
                            <Button onClick={handleCanvasExport} className="w-full">
                                Export Canvas as PNG
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}