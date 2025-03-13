import Link from "next/link";
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { ModeToggle } from "@/components/theme/mode-toggle"



export default function Header() {

    return (
        <header className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-4">
                <ModeToggle />
                <Link href="/" className="font-bold text-xl">
                    Fit Overlay
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <SignedIn>
                    <Link href="/editor" className="hover:underline">
                        Editor
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
            </div>
        </header>
    )
}