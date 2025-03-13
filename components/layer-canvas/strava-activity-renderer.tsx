import type React from "react"
import { useStravaStore } from "@/lib/strava-store"
import type { Layer } from "@/lib/layer-store/types"

interface StravaActivityRendererProps {
    layer: Layer
    style?: React.CSSProperties
}

export default function StravaActivityRenderer({ layer, style }: StravaActivityRendererProps) {
    const { stravaActivityId } = layer
    const activity = useStravaStore((state) => state.activities.find((a) => a.id === stravaActivityId))
    const scale = (layer.scale || 1) * 2

    if (!activity) {
        return (
            <div
                style={{
                    ...style,
                    minWidth: "300px",
                    width: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    // Remove transform scale
                    transform: "none",
                }}
            >
                <p style={{ fontWeight: "bold", fontSize: `${18 * scale}px` }}>Activity not found</p>
            </div>
        )
    }

    // Format duration in a more readable format
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}:${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
    }

    // Convert kilometers to miles
    const distanceInMiles = (activity.distance / 1609.34).toFixed(2)

    // Convert meters to feet for elevation
    const elevationInFeet = Math.round(activity.total_elevation_gain * 3.28084)

    // Calculate pace in minutes per mile and format as MM:SS
    const paceMinutesPerMile = activity.moving_time / 60 / (activity.distance / 1609.34)
    const paceMinutes = Math.floor(paceMinutesPerMile)
    const paceSeconds = Math.round((paceMinutesPerMile - paceMinutes) * 60)
    const formattedPace = `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")}`

    // Convert km/h to mph
    const speedInMph = (activity.average_speed * 2.23694).toFixed(1)
    const maxSpeedInMph = (activity.max_speed * 2.23694).toFixed(1)

    // Apply scale directly to font sizes and spacing instead of using transform
    return (
        <div
            style={{
                ...style,
                minWidth: `${600 * scale}px`,
                width: `${600 * scale}px`,
                color: "white",
                // Remove transform scale
                transform: "none",
            }}
        >
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: `${16 * scale}px`,
                rowGap: `${24 * scale}px`,
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Distance</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>{distanceInMiles} mi</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Avg Pace</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>
                        {formattedPace} /mi
                    </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Moving Time</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>{formatDuration(activity.moving_time)}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Elevation Gain</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>{elevationInFeet} ft</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Avg Speed</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>{speedInMph} mph</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontSize: `${14 * scale}px`, fontWeight: 500, opacity: 0.8, margin: 0 }}>Max Speed</p>
                    <p style={{ fontSize: `${30 * scale}px`, fontWeight: 700, margin: 0 }}>{maxSpeedInMph} mph</p>
                </div>
            </div>

            {/* <div className="flex flex-col items-center justify-center mt-3 text-xs opacity-70">{new Date(activity.start_date).toLocaleDateString()}</div> */}
        </div>
    )
}

