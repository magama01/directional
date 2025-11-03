import type {Metadata} from "next";
import "./globals.css";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import Navbar from "@/components/nav-bar/nav-bar";
import AuthProvider from "@/components/(auth)/auth-provider";
import {CssBaseline} from "@mui/material";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";

export const metadata: Metadata = {
    title: "Directional",
    description: "과제랍니다",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth();

    return (
        <html lang="kr">
        <body
            className={`antialiased`}
        >
        <AppRouterCacheProvider>
            <CssBaseline/>
            <SessionProvider session={session}>
                <Navbar/>
                <main>{children}</main>
            </SessionProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
