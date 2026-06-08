import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Reverse-Engineerer — 7-Day AI Interview Prep",
  description:
    "Paste a job description and your GitHub. Get a custom LeetCode study plan built around that company's interview history and your actual skill gaps.",
  openGraph: {
    title: "Interview Reverse-Engineerer",
    description: "AI-powered 7-day interview prep tailored to you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
