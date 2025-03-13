"use client"
import TextAdd from "./text-add"
import ImageAdd from "./image-add"
import BgRemove from "./bg-remove"
import GenRemove from "./gen-remove"
import StravaActivityAdd from "./strava-activity-add"
import CanvasSettings from "../project/canvas-settings"

export default function Toolbar() {
    return (
        <div className="py-6 px-4 min-w-48 hidden md:block">
            <div className="flex flex-col gap-4">
                <ImageAdd />
                <TextAdd />
                <StravaActivityAdd />
                <GenRemove />
                <BgRemove />
                <CanvasSettings />
            </div>
        </div>
    )
}