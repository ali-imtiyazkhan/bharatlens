import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BharatLens — AI-Powered Cultural Tourism",
  description:
    "Explore India's rich heritage with real-time AR translation, personalized AI itineraries, and immersive virtual tours.",
  keywords: ["India", "heritage", "tourism", "AR", "AI", "translation"],
};

import StudioBackground from "../components/StudioBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#080808' }}>
        <StudioBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}