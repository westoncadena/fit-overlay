export interface StravaActivity {
    id: number;
    resource_state: number;
    athlete: {
        id: number;
        resource_state: number;
    };
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    sport_type: string;
    workout_type: number;
    start_date: string;
    start_date_local: string;
    timezone: string;
    utc_offset: number;
    location_city: string | null;
    location_state: string | null;
    location_country: string | null;
    achievement_count: number;
    kudos_count: number;
    comment_count: number;
    athlete_count: number;
    photo_count: number;
    map: {
        id: string;
        summary_polyline: string;
        resource_state: number;
    };
    trainer: boolean;
    commute: boolean;
    manual: boolean;
    private: boolean;
    visibility: string;
    flagged: boolean;
    gear_id: string | null;
    start_latlng: [number, number] | null;
    end_latlng: [number, number] | null;
    average_speed: number;
    max_speed: number;
    has_heartrate: boolean;
    heartrate_opt_out: boolean;
    display_hide_heartrate_option: boolean;
    elev_high: number;
    elev_low: number;
    upload_id: number;
    upload_id_str: string;
    external_id: string;
    from_accepted_tag: boolean;
    pr_count: number;
    total_photo_count: number;
    has_kudoed: boolean;
}

export interface StravaAthlete {
    id: number;
    username: string | null;
    resource_state: number;
    firstname: string;
    lastname: string;
    bio: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    sex: string | null;
    premium: boolean;
    summit: boolean;
    created_at: string;
    updated_at: string;
    profile_medium: string;
    profile: string;
    friend: null;
    follower: null;
}