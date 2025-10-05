"use client";
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";

const DAppKitProvider = dynamic(
  async () => {
    const { DAppKitProvider: _DAppKitProvider } = await import(
      "@vechain/dapp-kit-react"
    );
    return _DAppKitProvider;
  },
  {
    ssr: false,
  }
);

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <DAppKitProvider
          usePersistence={true}
          node={"https://testnet.vechain.org/"}
        >
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background">
              <Navbar />
              {children}
            </div>
          </QueryClientProvider>
        </DAppKitProvider>
      </body>
    </html>
  );
}
