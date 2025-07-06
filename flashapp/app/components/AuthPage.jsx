import React from 'react'
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/nextjs'
export default function AuthPage() {
    return (
        <div>
            <SignedOut>
                <SignIn routing="path" path="/sign-in" />
                <SignUp routing="path" path="/sign-up" />
            </SignedOut>
            <SignedIn>
                <div>
                    <p>
                        You are signed in! Get out Bud
                    </p>
                </div>
            </SignedIn>
        </div>
    )
}
