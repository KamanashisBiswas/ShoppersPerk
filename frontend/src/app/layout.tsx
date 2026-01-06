import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "../styles/globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Shoppers Perk",
  description: "Best deals and offers for shoppers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} font-fredoka antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
