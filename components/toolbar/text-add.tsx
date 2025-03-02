"use client"

import { useState } from "react";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Type } from "lucide-react"

export default function TextAdd() {
    const [textInput, setTextInput] = useState("");
    const [fontSize, setFontSize] = useState(24);
    const [color, setColor] = useState("#000000");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const addLayer = useLayerStore((state) => state.addLayer);

    const handleAddTextLayer = () => {
        if (textInput.trim()) {
            const newLayer = {
                id: crypto.randomUUID(),
                resourceType: 'text' as 'text',
                text: textInput,
                fontSize: fontSize,
                color: color,
                position: { x: 100, y: 100 }, // Default position, can be adjusted
                order: 0, // Set the order for rendering
            };
            addLayer(newLayer);
            setTextInput("");
            setFontSize(24);
            setColor("#000000");
            setPopoverOpen(false); // Close the popover after adding the layer
        }
    };

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Add Text
                        <Type size={18} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col p-4">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text here"
                        className="border p-2 rounded mb-2"
                    />
                    <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        placeholder="Font Size"
                        className="border p-2 rounded mb-2"
                    />
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="border p-2 rounded mb-2"
                    />
                    <Button onClick={handleAddTextLayer} className="mt-2">
                        Create Text Layer
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}