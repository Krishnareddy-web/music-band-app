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
        const user = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                role: body.role,
                password: body.password || undefined,
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update user", error);
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

    if (id === session.user.id) {
        return NextResponse.json({ error: "Cannot delete self" }, { status: 400 });
    }

    try {
        await prisma.user.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete user", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
