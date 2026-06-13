import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
    if (!req.auth?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { eventId } = await req.json();
        const userId = req.auth?.user?.id;

        console.log("DEBUG: Creating booking request:", { userId, eventId });

        if (!eventId) {
            return NextResponse.json({ error: "Event ID required" }, { status: 400 });
        }

        // Check for existing active booking for this user/event to prevent duplicates
        const existing = await prisma.booking.findFirst({
            where: {
                userId: req.auth!.user!.id!,
                eventId: eventId,
                status: "PENDING",
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (existing) {
            return NextResponse.json({
                bookingId: existing.id,
                expiresAt: existing.expiresAt
            });
        }

        // Check effective availability (actual seats - active holds)
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { availableSeats: true }
        });

        if (!event || event.availableSeats <= 0) {
            return NextResponse.json({ error: "Event Sold Out" }, { status: 400 });
        }

        const activeHolds = await prisma.booking.count({
            where: {
                eventId: eventId,
                status: "PENDING",
                expiresAt: { gt: new Date() }
            }
        });

        if (activeHolds >= event.availableSeats) {
            return NextResponse.json({ error: "All seats currently held. Try again soon." }, { status: 400 });
        }

        // Create new booking with 8 minute expiry
        const expiresAt = new Date(Date.now() + 8 * 60 * 1000); // 8 minutes

        const booking = await prisma.booking.create({
            data: {
                userId: req.auth!.user!.id!,
                eventId: eventId,
                status: "PENDING",
                expiresAt: expiresAt,
            },
        });

        return NextResponse.json({
            bookingId: booking.id,
            expiresAt: booking.expiresAt
        });

    } catch (error) {
        console.error("Booking Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
});
