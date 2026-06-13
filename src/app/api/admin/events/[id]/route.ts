import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const event = await prisma.event.update({
            where: { id },
            data: {
                title: body.title,
                date: body.date ? new Date(body.date) : undefined,
                venue: body.venue,
                location: body.location,
                availableSeats: body.availableSeats,
                status: body.status,
                videoUrl: body.videoUrl,
                imageUrl: body.imageUrl,
            }
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to update event", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.event.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete event", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
