"use client"
import { useProjectStore, INSTAGRAM_ASPECT_RATIOS, QUALITY_PRESETS } from '@/lib/project-store';
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CanvasSettings() {

    const projectName = useProjectStore(state => state.projectName)
    const setProjectName = useProjectStore(state => state.setProjectName)
    const aspectRatioPreset = useProjectStore(state => state.aspectRatioPreset)
    const qualityPreset = useProjectStore(state => state.qualityPreset)
    const setAspectRatio = useProjectStore(state => state.setAspectRatio)
    const setQuality = useProjectStore(state => state.setQuality)
    const canvasWidth = useProjectStore(state => state.canvasWidth)
    const canvasHeight = useProjectStore(state => state.canvasHeight)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Canvas
                        <Settings size={18} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input
                            id="project-name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="My Instagram Post"
                        />
                    </div>

                    <div>
                        <Label>Aspect Ratio</Label>
                        <Select
                            value={aspectRatioPreset.name}
                            onValueChange={(value) => {
                                const preset = Object.values(INSTAGRAM_ASPECT_RATIOS).find(r => r.name === value);
                                if (preset) setAspectRatio(preset);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(INSTAGRAM_ASPECT_RATIOS).map((preset) => (
                                    <SelectItem key={preset.name} value={preset.name}>
                                        {preset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Quality</Label>
                        <Select
                            value={qualityPreset.name}
                            onValueChange={(value) => {
                                const preset = Object.values(QUALITY_PRESETS).find(q => q.name === value);
                                if (preset) setQuality(preset);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(QUALITY_PRESETS).map((preset) => (
                                    <SelectItem key={preset.name} value={preset.name}>
                                        {preset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Canvas dimensions: {canvasWidth} × {canvasHeight}px
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
} 