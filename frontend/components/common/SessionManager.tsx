"use client";

import { useClerk, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function SessionManager() {
    const { signOut } = useClerk();
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        // Wait for auth to load before making decisions
        if (!isLoaded) return;

        // Check if we have a flag in sessionStorage
        // sessionStorage persists on refresh but clears on tab/window close
        const isSessionActive = sessionStorage.getItem("cvision_session_active");

        if (!isSessionActive) {
            // This indicates a fresh tab or window.
            // If the user appears signed in (via persistent cookie), we sign them out
            // to enforce "logout on close" behavior.
            if (isSignedIn) {
                void signOut();
            }

            // Mark the session as active so subsequent refreshes don't trigger logout
            sessionStorage.setItem("cvision_session_active", "true");
        }
    }, [isLoaded, isSignedIn, signOut]);

    return null;
}
