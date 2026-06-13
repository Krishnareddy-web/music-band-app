import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Join the divine music community.",
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
