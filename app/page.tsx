'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import React, { useEffect } from 'react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/editor');
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/login-backgound.jpg")' }}
    >
      <SignedOut>
        <div className="max-w-md w-full space-y-8 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome to Fit Overlay</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Sign in with your Strava account to continue.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <SignInButton mode="modal">
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
                Sign In
              </button>
            </SignInButton>

          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="text-center bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow backdrop-blur-sm">
          <p>Redirecting to editor...</p>
        </div>
      </SignedIn>
    </div>
  );
}
