import TextAdd from "./text-add"
import ImageAdd from "./image-add"
import BgRemove from "./bg-remove"
import GenRemove from "./gen-remove"
import CanvasSettings from "../project/canvas-settings"


export default function ImageTools() {
    return (
        <>
            <ImageAdd />
            <TextAdd />
            <GenRemove />
            <BgRemove />
            <CanvasSettings />
        </>
    )
}