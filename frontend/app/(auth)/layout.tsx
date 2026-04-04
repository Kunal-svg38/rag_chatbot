import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { Card } from "@/components/ui/card";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <SessionProvider>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full flex`}
>
                <div className="hidden md:flex items-center justify-center h-full md:w-1/2 p-5  bg-gray-400">
                <Card className="w-full sm:max-w-md border-none">
                    <img src="/Chat bot-bro.svg" alt="logo"/>
                </Card>
                </div>
                <div className="flex items-center justify-center h-full w-full md:w-1/2 p-4 ">
                    {children}
                </div>
            </body> 
            </SessionProvider>
        </html>
    );
}