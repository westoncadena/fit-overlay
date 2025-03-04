import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getStravaActivities, getStravaAthlete } from './stava'
import { StravaActivity, StravaAthlete } from './types'

interface StravaState {
    activities: StravaActivity[]
    athlete: StravaAthlete | null
    isLoading: boolean
    error: string | null
    lastFetched: number | null

    // Actions
    fetchActivities: (page?: number, perPage?: number) => Promise<void>
    fetchAthlete: () => Promise<void>
    clearData: () => void
}

// Time threshold for refetching (5 minutes)
const REFETCH_THRESHOLD = 5 * 60 * 1000

export const useStravaStore = create<StravaState>()(
    persist(
        (set, get) => ({
            activities: [],
            athlete: null,
            isLoading: false,
            error: null,
            lastFetched: null,

            fetchActivities: async (page = 1, perPage = 30) => {
                const lastFetched = get().lastFetched
                const now = Date.now()

                // Only fetch if data is stale or doesn't exist
                if (!lastFetched || now - lastFetched > REFETCH_THRESHOLD) {
                    set({ isLoading: true, error: null })

                    try {
                        const { activities, error } = await getStravaActivities(page, perPage)

                        if (error) {
                            set({ error, isLoading: false })
                            return
                        }

                        set({
                            activities,
                            isLoading: false,
                            lastFetched: Date.now()
                        })
                    } catch (err: unknown) {

                        if (err instanceof Error) {
                            set({
                                error: err.message || 'Failed to fetch activities',
                                isLoading: false
                            })
                        } else {
                            set({
                                error: 'Unknown error occurred when fetching activites',
                                isLoading: false
                            })
                        }
                    }
                }
            },

            fetchAthlete: async () => {
                set({ isLoading: true, error: null })

                try {
                    const { athlete, error } = await getStravaAthlete()

                    if (error) {
                        set({ error, isLoading: false })
                        return
                    }

                    set({ athlete, isLoading: false })
                } catch (err: unknown) { // Changed `any` to `unknown`
                    // Narrow the error type if necessary (e.g., check if it's an instance of Error)
                    if (err instanceof Error) {
                        set({
                            error: err.message || 'Failed to fetch acthlete',
                            isLoading: false
                        })
                    } else {
                        set({
                            error: 'Unknown error occurred when fetching athlete',
                            isLoading: false
                        })
                    }
                }
            },

            clearData: () => {
                set({
                    activities: [],
                    athlete: null,
                    lastFetched: null
                })
            }
        }),
        {
            name: 'strava-storage',
            // Only persist activities and athlete data
            partialize: (state) => ({
                activities: state.activities,
                athlete: state.athlete,
                lastFetched: state.lastFetched
            }),
        }
    )
)