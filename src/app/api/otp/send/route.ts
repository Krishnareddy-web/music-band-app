import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendSMS } from "@/lib/sms";

export async function POST(req: Request) {
    try {
        const { identifier, type } = await req.json();

        if (!identifier) {
            return NextResponse.json({ error: "Identifier (Phone or Email) is required" }, { status: 400 });
        }

        // 1. Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 2. Set expiry (10 minutes from now)
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        // 3. Delete any existing tokens for this identifier to keep it clean
        await prisma.verificationToken.deleteMany({
            where: { identifier }
        });

        // 4. Store the new token
        await prisma.verificationToken.create({
            data: {
                identifier,
                token: otp,
                expires
            }
        });

        // 5. Send the OTP
        const smsResult = await sendSMS(
            identifier,
            `Your Dappu Srinu verification code is: ${otp}. Valid for 10 minutes.`
        );

        if (!smsResult.success) {
            return NextResponse.json({ error: "Failed to send SMS: " + smsResult.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: smsResult.virtual
                ? `OTP generated successfully. (Check server logs in development)`
                : `OTP sent successfully to your phone.`
        });

    } catch (error: any) {
        console.error("OTP send error:", error);
        return NextResponse.json({ error: "Failed to send OTP. Please try again later." }, { status: 500 });
    }
}
