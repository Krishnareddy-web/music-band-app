import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch for bookings, collaborations, or sacred music inquiries.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
