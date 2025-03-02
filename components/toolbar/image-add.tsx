"use client"

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import UploadImage from "../upload/upload-image-new";
import { Image as Image2 } from "lucide-react"

export default function ImageAdd() {

    const [popoverOpen, setPopoverOpen] = useState(false);


    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Add Image
                        <Image2 size={18} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <UploadImage />
            </PopoverContent>
        </Popover>
    );
}