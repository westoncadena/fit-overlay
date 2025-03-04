'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { cache } from 'react'
import { StravaActivity, StravaAthlete } from './types'



// Cache the token fetching to reduce Clerk API calls
export const getStravaToken = cache(async () => {
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    try {
        const client = await clerkClient()
        const { data } = await client.users.getUserOauthAccessToken(userId, 'custom_strava')

        if (data.length === 0) {
            return null
        }

        return data[0].token
    } catch (error) {
        console.error('Error fetching Strava token:', error)
        return null
    }
})

// Base function for Strava API calls
async function callStravaApi<T>(endpoint: string, options: { headers?: Record<string, string> } = {}): Promise<T> {
    const token = await getStravaToken()

    if (!token) {
        throw new Error('No Strava token available')
    }

    const baseUrl = 'https://www.strava.com/api/v3'
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    })

    if (!response.ok) {
        throw new Error(`Strava API error: ${response.status}`)
    }

    return response.json()
}

// Specific API endpoints
export async function getStravaActivities(page = 1, perPage = 30) {
    try {
        const activities = await callStravaApi<StravaActivity[]>(
            `/athlete/activities?page=${page}&per_page=${perPage}`
        )
        return { activities, error: null }
    } catch (error) {
        return { activities: [] as StravaActivity[], error: error.message || 'Unknown error' }
    }
}

export async function getStravaAthlete() {
    try {
        const athlete = await callStravaApi<StravaAthlete>('/athlete')
        return { athlete, error: null }
    } catch (error) {
        return { athlete: null as StravaAthlete | null, error: error.message || 'Unknown error' }
    }
}

export async function getStravaActivity(activityId: string) {
    try {
        const activity = await callStravaApi<StravaActivity>(`/activities/${activityId}`)
        return { activity, error: null }
    } catch (error) {
        return { activity: null as StravaActivity | null, error: error.message || 'Unknown error' }
    }
}