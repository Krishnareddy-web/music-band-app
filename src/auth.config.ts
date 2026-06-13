import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authConfig = {
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) return null;

                // Administrative Access Overrides
                if (password === "02April2024") {
                    if (email === "krishnareddy02072006@gmail.com") {
                        return {
                            id: "admin-root",
                            name: "Krishna Reddy Admin",
                            email: email,
                            role: "ADMIN",
                        };
                    }
                    if (email === "2300520067bca@gmail.com") {
                        return {
                            id: "dev-root",
                            name: "Krishna Reddy Developer",
                            email: email,
                            role: "DEVELOPER",
                        };
                    }
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: email },
                            { phone: email }
                        ]
                    }
                });

                if (user && user.password) {
                    const isPasswordValid = await bcrypt.compare(password, user.password);

                    if (isPasswordValid) {
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { lastLogin: new Date(), lastActive: new Date() }
                        });
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        };
                    }
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.role === "ADMIN";
            const isDeveloper = auth?.user?.role === "DEVELOPER";
            const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
            const isOnProfile = nextUrl.pathname.startsWith('/profile');

            if (isOnAdminPanel) {
                if (isLoggedIn && (isAdmin || isDeveloper)) return true;
                return false;
            }

            if (isOnProfile) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
} satisfies NextAuthConfig;
