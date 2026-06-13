import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                event: {
                    select: {
                        title: true,
                        date: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Failed to fetch bookings", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
