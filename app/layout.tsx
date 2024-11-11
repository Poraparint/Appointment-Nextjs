import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// การเรียกใช้ใน Javascript library & framework (React, Vue ฯลฯ)
import "@fortawesome/fontawesome-free/css/all.min.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "A-Dental",
  description: "Calendar?",
  icons: [{ url: "/favicon/favicon.ico", href: "/favicon/favicon.ico" }],
};

const kanit = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-prompt",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={kanit.variable} data-theme="mytheme">
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Navbar />
          <div className="mt-24 w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
