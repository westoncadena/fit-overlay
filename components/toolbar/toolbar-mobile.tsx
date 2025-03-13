"use client"

import { useRef } from "react"
import TextAdd from "./text-add"
import ImageAdd from "./image-add"
import BgRemove from "./bg-remove"
import GenRemove from "./gen-remove"
import StravaActivityAdd from "./strava-activity-add"
import CanvasSettings from "../project/canvas-settings"

export default function ToolbarMobile() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const tools = [
        { component: <ImageAdd /> },
        { component: <TextAdd /> },
        { component: <StravaActivityAdd /> },
        { component: <GenRemove /> },
        { component: <BgRemove /> },
        { component: <CanvasSettings /> },
    ]

    const handleScroll = () => {
        // Keep this if you want to implement any scroll-based behavior in the future
    }

    return (
        <div className="fixed bottom-0 left-0 right-0  pb-safe z-50 block lg:hidden">
            <div className="relative flex items-center">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide py-3 px-4 gap-4 w-full"
                    onScroll={handleScroll}
                >
                    {tools.map((tool, index) => (
                        <div key={index} className="flex flex-col items-center justify-center min-w-[70px] flex-shrink-0">
                            <div className="flex items-center justify-center w-full">{tool.component}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

