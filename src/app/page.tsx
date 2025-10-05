"use client";
import { WalletButton } from "@vechain/dapp-kit-react";
import StravaIntegration from "./components/StravaIntegration";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  // return (
  //   <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
  //     <div className="max-w-4xl mx-auto space-y-8">
  //       {/* Header */}
  //       <div className="text-center">
  //         <h1 className="text-4xl font-bold text-gray-800 mb-4">
  //           VeChain + Strava Integration
  //         </h1>
  //         <p className="text-gray-600 mb-8">
  //           Connect your VeChain wallet and Strava account to explore fitness
  //           data on the blockchain
  //         </p>
  //       </div>

  //       {/* Wallet Connection */}
  //       <div className="bg-white rounded-lg shadow-md p-6 text-center">
  //         <h2 className="text-2xl font-bold text-gray-800 mb-4">
  //           Connect Your Wallet
  //         </h2>
  //         <WalletButton className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors" />
  //       </div>

  //       {/* Strava Integration */}
  //       <StravaIntegration />
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <Hero />
      <Features />
    </div>
  );
}
