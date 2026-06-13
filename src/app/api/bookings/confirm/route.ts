import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
    if (!req.auth?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { bookingId, favoriteSongs, clientAddress, eventLocation, clientPhone } = await req.json();

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (booking.userId !== req.auth!.user!.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (booking.status === "CONFIRMED") {
            return NextResponse.json({ success: true, status: "CONFIRMED" });
        }

        if (booking.expiresAt && new Date() > booking.expiresAt) {
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: "EXPIRED" }
            });
            return NextResponse.json({ error: "Slot Expired" }, { status: 400 });
        }

        // Confirm the booking and deduct seat
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updated = await prisma.$transaction(async (tx: any) => {
            const currentBooking = await tx.booking.findUnique({
                where: { id: bookingId }
            });

            if (!currentBooking || currentBooking.status !== "PENDING") {
                throw new Error("Invalid booking state");
            }

            const event = await tx.event.findUnique({
                where: { id: currentBooking.eventId }
            });

            if (!event || event.availableSeats <= 0) {
                throw new Error("Event sold out");
            }

            // Deduct seat
            await tx.event.update({
                where: { id: currentBooking.eventId },
                data: { availableSeats: { decrement: 1 } }
            });

            return await tx.booking.update({
                where: { id: bookingId },
                data: {
                    status: "CONFIRMED",
                    favoriteSongs: favoriteSongs || null,
                    clientAddress,
                    eventLocation,
                    clientPhone
                } as any,
            });
        });

        return NextResponse.json({ success: true, booking: updated });

    } catch (error) {
        console.error("Booking Confirm Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
});
