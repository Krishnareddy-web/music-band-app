import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isDeveloper = session.user.role === "DEVELOPER";

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: isDeveloper,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
