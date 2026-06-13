import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";
import LiveDatesClient from "./LiveDatesClient";

interface DbEvent {
    id: string;
    title: string | null;
    date: Date;
    venue: string;
    location: string;
    imageUrl: string | null;
    videoUrl: string | null;
}

export const metadata: Metadata = {
    title: "Live Dates | Devotional Band",
    description: "Join us at upcoming spiritual events and musical festivals across India.",
};

export default async function LiveDatesPage() {
    const dbEvents = await prisma.event.findMany({
        orderBy: { date: 'asc' },
    });

    const events = dbEvents.map((e: any) => ({
        id: e.id,
        date: e.date.toISOString(),
        venue: e.venue,
        location: e.location,
        title: e.title || "Devotional Event",
        imageUrl: e.imageUrl,
        videoUrl: e.videoUrl,
        status: e.status,
    }));

    return (
        <main className="min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500">
            <Navigation />

            <div className="max-w-5xl mx-auto space-y-12">
                <LiveDatesClient initialEvents={events} />
            </div>
        </main>
    );
}

