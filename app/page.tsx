'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignedOut>
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome to the App</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Please sign in or create an account to continue.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <SignInButton mode="modal">
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-md">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="text-center">
          <p>Redirecting to editor...</p>
        </div>
      </SignedIn>
    </div>
  );
}
