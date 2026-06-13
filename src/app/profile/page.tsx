import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Navigation from "@/components/Navigation";
import { Lock } from "lucide-react";
import Link from "next/link";
import ProfileClient from "./ProfileClient";
import ProfileHeader from "@/components/ProfileHeader";
import type { Metadata } from "next";

interface PurchaseItem {
    id: string;
    createdAt: Date;
    itemId?: string;
    amount?: number;
}

export const metadata: Metadata = {
    title: "Devotee Profile",
    description: "Manage your sacred bookings and access your purchased digital song books.",
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500">
                <Navigation />
                <div className="text-center space-y-6">
                    <div className="p-6 bg-yellow-500/10 rounded-full w-fit mx-auto">
                        <Lock className="w-12 h-12 text-yellow-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black uppercase tracking-widest">Access Denied</h1>
                        <p className="opacity-60 font-light">Please sign in to view your sacred vault.</p>
                    </div>
                    <Link href="/login" className="inline-block bg-yellow-500 text-black px-12 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-yellow-400 transition-all hover:scale-105 shadow-xl">Login</Link>
                </div>
            </main>
        );
    }

    const dbPurchases = await prisma.purchase.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    const purchases = dbPurchases.map((p: any) => ({
        id: p.id,
        title: "Ayyappa Swamy Keerthanas",
        type: "Digital Book",
        date: p.createdAt.toISOString().split('T')[0],
        status: "Unlocked"
    }));

    const dbBookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id,
            status: "CONFIRMED"
        },
        include: { event: true },
        orderBy: { createdAt: 'desc' }
    });

    const bookings = dbBookings.map((b: any) => ({
        id: b.id,
        title: b.event.venue,
        location: b.event.location,
        type: "Band Booking",
        date: b.event.date.toISOString().split('T')[0],
        status: "Confirmed",
        favoriteSongs: b.favoriteSongs ? b.favoriteSongs.split(", ") : []
    }));

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 transition-colors duration-500">
            <Navigation />

            <div className="max-w-5xl mx-auto space-y-20">
                <ProfileHeader userName={session.user?.name || "Devotee"} />

                <section className="space-y-8">
                    <ProfileClient
                        initialPurchases={purchases}
                        initialBookings={bookings}
                    />
                </section>
            </div>
        </main>
    );
}
