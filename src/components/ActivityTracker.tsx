"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ActivityTracker() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            const updateActivity = async () => {
                try {
                    await fetch(`/api/developer/db/user/${session.user.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ lastActive: new Date() }),
                    });
                } catch (err) {
                    // Fail silently for activity tracking
                    console.error("Activity tracking failed", err);
                }
            };

            updateActivity();
        }
    }, [pathname, status, session]);

    return null;
}
