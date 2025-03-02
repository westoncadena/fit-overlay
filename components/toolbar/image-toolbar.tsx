import TextAdd from "./text-add"
import ImageAdd from "./image-add"
import BgRemove from "./bg-remove"
import GenRemove from "./gen-remove"


export default function ImageTools() {
    return (
        <>
            <ImageAdd />
            <TextAdd />
            <GenRemove />
            <BgRemove />
        </>
    )
}