import React from 'react';
import { useStravaStore } from '@/lib/strava-store';
import { Layer } from '@/lib/layer-store/types';

interface StravaActivityRendererProps {
    layer: Layer;
    style?: React.CSSProperties;
}

export default function StravaActivityRenderer({ layer, style }: StravaActivityRendererProps) {
    const { stravaActivityId } = layer;
    const activity = useStravaStore(state =>
        state.activities.find(a => a.id === stravaActivityId)
    );

    if (!activity) {
        return (
            <div
                className="flex items-center justify-center bg-red-50 border border-red-200 rounded p-4"
                style={{
                    ...style,
                    minWidth: '300px', // Ensure minimum width
                    width: '300px'      // Fixed width
                }}
            >
                <p className="text-red-500">Activity not found</p>
            </div>
        );
    }

    return (
        <div
            className="border-2 rounded-lg shadow-sm p-4 overflow-hidden"
            style={{
                ...style,
                minWidth: '300px',  // Ensure minimum width
                width: '300px',     // Fixed width
                maxWidth: '400px',   // Maximum width
                borderColor: '#fc4c02', // Strava orange border
                borderWidth: '3px',  // Thicker border
                backgroundColor: 'rgba(255, 255, 255, 0.25)', // Semi-transparent white background
                backdropFilter: 'blur(2px)' // Optional: adds a slight blur effect
            }}
        >
            <h3 className="font-bold text-lg mb-2 truncate" title={activity.name}>
                {activity.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p style={{ color: '#fc4c02', fontSize: '0.9rem', fontWeight: 600 }}>Distance</p>
                    <p className="font-medium text-base">{(activity.distance / 1000).toFixed(2)} km</p>
                </div>
                <div>
                    <p style={{ color: '#fc4c02', fontSize: '0.9rem', fontWeight: 600 }}>Duration</p>
                    <p className="font-medium text-base">
                        {Math.floor(activity.moving_time / 3600)}h {Math.floor((activity.moving_time % 3600) / 60)}m
                    </p>
                </div>
                <div>
                    <p style={{ color: '#fc4c02', fontSize: '0.9rem', fontWeight: 600 }}>Elevation</p>
                    <p className="font-medium text-base">{activity.total_elevation_gain} m</p>
                </div>
                <div>
                    <p style={{ color: '#fc4c02', fontSize: '0.9rem', fontWeight: 600 }}>Avg Speed</p>
                    <p className="font-medium text-base">{(activity.average_speed * 3.6).toFixed(1)} km/h</p>
                </div>
            </div>

            {/* {activity.map && (
                <div className="mt-3 h-32 bg-gray-100 rounded overflow-hidden">
                    <img
                        src={activity.map.summary_polyline ?
                            `https://maps.googleapis.com/maps/api/staticmap?size=400x200&path=enc:${activity.map.summary_polyline}&key=YOUR_API_KEY` :
                            '/placeholder-map.png'
                        }
                        alt="Activity map"
                        className="w-full h-full object-cover"
                    />
                </div>
            )} */}

            <div className="mt-3 text-xs" style={{ color: '#fc4c02' }}>
                {new Date(activity.start_date).toLocaleDateString()}
            </div>
        </div>
    );
} 