'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";
import Editor from "@/components/editor";

export default function EditorPage() {
    const { isSignedIn, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isSignedIn, isLoaded, router]);

    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isSignedIn) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div>
            <LayerStore.Provider initialValue={{
                layerComparisonMode: false,
                layers: [{
                    id: crypto.randomUUID(),
                    url: "",
                    height: 0,
                    width: 0,
                    publicId: "",
                    order: 0
                }],
            }}
            >
                <ImageStore.Provider initialValue={{
                    activeTag: "all",
                    activeColor: "green",
                    activeImage: "",
                }}>
                    <main className="h-full">
                        <Editor />
                    </main>
                </ImageStore.Provider>
            </LayerStore.Provider>
        </div>
    );
}