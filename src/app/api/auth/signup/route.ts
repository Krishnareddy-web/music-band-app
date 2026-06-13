import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password, phoneVerified, emailVerified } = await req.json();

        // Server-side validation
        if (!name || (!email && !phone) || !password) {
            return NextResponse.json({ error: "Name, password and (Email or Phone) are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({
                error: existingUser.email === email ? "Email already registered" : "Phone number already registered"
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                emailVerified: emailVerified ? new Date() : null,
                phoneVerified: phoneVerified ? new Date() : null,
                role: "USER"
            }
        });

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: { id: user.id, email: user.email }
        });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "An unexpected error occurred during signup" }, { status: 500 });
    }
}
