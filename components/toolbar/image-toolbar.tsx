"use client"
import { useState } from "react"
import TextAdd from "./text-add"
import ImageAdd from "./image-add"
import BgRemove from "./bg-remove"
import GenRemove from "./gen-remove"
import StravaActivityAdd from "./strava-activity-add"
import CanvasSettings from "../project/canvas-settings"
import { Button } from "../ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ImageTools() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Mobile menu toggle button - only visible on small screens */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="bg-white/90 backdrop-blur-sm shadow-md"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
            </div>

            {/* Toolbar container - different styles for mobile vs desktop */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                // Mobile styles
                "md:hidden fixed top-0 left-0 z-40 h-full bg-white/90 backdrop-blur-sm shadow-lg",
                "flex flex-col items-center justify-start gap-2 p-4 pt-16",
                mobileMenuOpen ? "translate-x-0 w-[100px]" : "-translate-x-full w-0",
                // Desktop styles
                "md:translate-x-0 md:w-auto md:h-auto md:static md:flex md:flex-row md:bg-transparent md:shadow-none md:p-0 md:pt-0"
            )}>
                <ImageAdd />
                <TextAdd />
                <StravaActivityAdd />
                <GenRemove />
                <BgRemove />
                <CanvasSettings />
            </div>
        </>
    )
}