import { getStravaActivities } from "@/lib/strava-store/stava"

export default async function ActivitiesPage() {
    const { activities, error } = await getStravaActivities()

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h1>Your Activities</h1>
            <ul>
                {activities.map(activity => (
                    <li key={activity.id}>{activity.name}</li>
                ))}
            </ul>
        </div>
    )
} 