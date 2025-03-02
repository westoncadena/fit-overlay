// /store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StravaUser {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    accessToken?: string;
}

interface AuthState {
    user: StravaUser | null;
    setUser: (user: StravaUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        { name: 'strava-auth-storage' }
    )
);