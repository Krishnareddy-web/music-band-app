import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ model: string; id: string }> }
) {
    const session = await auth();
    const { model, id } = await params;

    if (!session || session.user.role !== "DEVELOPER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const modelName = model.toLowerCase();

        // Dynamic access to prisma models
        const prismaModel = (prisma as any)[modelName];

        if (!prismaModel) {
            return NextResponse.json({ error: "Invalid model" }, { status: 400 });
        }

        const updatedRecord = await prismaModel.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedRecord);
    } catch (error: any) {
        console.error(`God-Mode Update Failed for ${model}:`, error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ model: string; id: string }> }
) {
    const session = await auth();
    const { model, id } = await params;

    if (!session || session.user.role !== "DEVELOPER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const modelName = model.toLowerCase();
        const prismaModel = (prisma as any)[modelName];

        if (!prismaModel) {
            return NextResponse.json({ error: "Invalid model" }, { status: 400 });
        }

        await prismaModel.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`God-Mode Delete Failed for ${model}:`, error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
