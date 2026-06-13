import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model");

    if (!session || session.user.role !== "DEVELOPER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!model) {
        return NextResponse.json({ error: "Model required" }, { status: 400 });
    }

    try {
        let data: any[] = [];
        switch (model.toLowerCase()) {
            case "user":
                data = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
                break;
            case "event":
                data = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
                break;
            case "booking":
                data = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
                break;
            case "purchase":
                data = await prisma.purchase.findMany({ orderBy: { createdAt: 'desc' } });
                break;
            case "account":
                data = await prisma.account.findMany();
                break;
            case "session":
                data = await prisma.session.findMany();
                break;
            default:
                return NextResponse.json({ error: "Invalid model" }, { status: 400 });
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error(`Failed to fetch ${model}`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
