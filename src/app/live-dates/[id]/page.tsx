import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import EventDetailsClient from "./EventDetailsClient";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event: any = await prisma.event.findUnique({
        where: { id },
        include: {
            bookings: {
                where: { status: "CONFIRMED" },
                include: { user: true }
            }
        }
    });

    if (!event) {
        notFound();
    }

    const booking = event.bookings[0] || null;

    const formattedEvent = {
        id: event.id,
        title: event.venue,
        location: event.location,
        date: event.date.toISOString(),
        venue: event.venue,
        imageUrl: event.imageUrl,
        videoUrl: event.videoUrl,
        bookedBy: booking ? {
            name: booking.user.name || "A Devotee",
            address: booking.clientAddress || "Not Specified",
            location: booking.eventLocation || event.location,
            songs: booking.favoriteSongs ? booking.favoriteSongs.split(", ") : []
        } : null
    };

    return (
        <main className="min-h-screen pt-40 pb-12 px-4 md:px-8 transition-colors duration-500">
            <Navigation />
            <div className="max-w-4xl mx-auto">
                <EventDetailsClient event={formattedEvent} />
            </div>
        </main>
    );
}
