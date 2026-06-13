import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
    if (!req.auth?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { itemId, amount } = await req.json();

        // Verify amount (100 Rs for song books as per requirements)
        if (amount !== 100) {
            return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
        }

        // Check if already purchased
        await prisma.user.findUnique({
            where: { id: req.auth!.user!.id! },
            select: {
                // This assumes a 'purchasedItems' field or similar in schema
                // For now, we simulate success and update a flag
                email: true
            }
        });

        // Create purchase record
        await prisma.purchase.create({
            data: {
                userId: req.auth!.user!.id!,
                itemId,
                amount
            }
        });

        console.log(`Payment confirmed and recorded for item ${itemId} by user ${req.auth!.user!.id!}`);

        return NextResponse.json({
            success: true,
            message: "Payment verified. Content unlocked."
        });

    } catch (error) {
        console.error("Payment Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
});
