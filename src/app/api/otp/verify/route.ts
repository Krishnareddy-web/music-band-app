import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { identifier, code } = await req.json();

        if (!identifier || !code) {
            return NextResponse.json({ error: "Identifier and code are required" }, { status: 400 });
        }

        // 1. Find the token in the database
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier,
                token: code
            }
        });

        if (!verificationToken) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
        }

        // 2. Check if expired
        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({
                where: {
                    identifier_token: {
                        identifier,
                        token: code
                    }
                }
            });
            return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
        }

        // 3. Valid! Delete the token so it can't be reused
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier,
                    token: code
                }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("OTP verification error:", error);
        return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
    }
}
