import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Once Upon a Prompt — AI Bedtime Stories for Kids",
  description:
    "Create personalised, AI-generated bedtime stories for your children — complete with multi-voice narration and illustrations. Built by DamoBird365.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
