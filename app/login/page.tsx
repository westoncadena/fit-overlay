'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' instead of 'next/router' in App Router
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import React from 'react';

export default function Page() {
    const { isSignedIn } = useUser(); // Check if the user is signed in
    const router = useRouter(); // Use the 'useRouter' hook from 'next/navigation'

    React.useEffect(() => {
        if (isSignedIn) {
            // Redirect to the editor page if the user is logged in
            router.push('/editor');
        } else {
            // Redirect to the login page if the user is not logged in
            router.push('/login');
        }
    }, [isSignedIn, router]);

    return (
        <div>
            This is the login page
        </div>
    );
}
