import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your sacred account.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
