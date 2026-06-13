import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";
import BookBandClient from "./BookBandClient";

export const metadata: Metadata = {
    title: "Book Band | Devotional Ensemble",
    description: "Book our band for your spiritual events and devotional festivals.",
};

export default async function BookBandPage() {
    const dbEvents = await prisma.event.findMany({
        where: {
            date: { gte: new Date() }
        },
        orderBy: { date: 'asc' },
    });

    const events = await Promise.all(dbEvents.map(async (e: any) => {
        const activeHolds = await prisma.booking.count({
            where: {
                eventId: e.id,
                status: "PENDING",
                expiresAt: { gt: new Date() }
            }
        });

        return {
            id: e.id,
            date: e.date.toISOString(),
            venue: e.venue,
            location: e.location,
            title: e.title || "Devotional Event",
            availableSeats: e.availableSeats - activeHolds,
            totalSeats: e.totalSeats,
        };
    }));

    return (
        <main className="min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500">
            <Navigation />

            <div className="max-w-5xl mx-auto">
                <BookBandClient initialEvents={events} />
            </div>
        </main>
    );
}
