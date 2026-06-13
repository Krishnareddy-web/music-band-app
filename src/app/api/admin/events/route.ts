import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("Failed to fetch events", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const event = await prisma.event.create({
            data: {
                title: body.title,
                date: new Date(body.date),
                venue: body.venue,
                location: body.location,
                availableSeats: body.availableSeats || 100,
                totalSeats: body.availableSeats || 100,
                status: body.status || "OPEN",
                videoUrl: body.videoUrl,
                imageUrl: body.imageUrl,
            }
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to create event", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
