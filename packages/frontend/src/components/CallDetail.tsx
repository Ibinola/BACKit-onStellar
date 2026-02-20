"use client";

import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import CallDetailHeader from "./CallDetailHeader";
import StakeBar from "./StakeBar";
import ActivityLog from "./ActivityLog";
import StakingInterface from "./StakingInterface";
import StakingDrawer from "./StakingDrawer";
import { CallDetailData } from "@/types";
import { useMediaQuery } from "@/hooks/useMediaQuery"; 

export default function CallDetail({ call }: { call: CallDetailData }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(call.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Resolved");
        clearInterval(interval);
      } else {
        const hrs = Math.floor(diff / 36e5);
        const mins = Math.floor((diff % 36e5) / 6e4);
        const secs = Math.floor((diff % 6e4) / 1000);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [call.endTime]);

  const handleStake = async (amount: number, side: 'YES' | 'NO') => {
    // Implement actual staking logic here
    console.log(`Staking ${amount} USDC on ${side} for call ${call.id}`);
    // Close drawer after successful stake on mobile
    if (isMobile) setIsDrawerOpen(false);
  };

  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* Desktop Layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          <CallDetailHeader call={call} timeLeft={timeLeft} />

          {/* Condition/Thesis section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Thesis</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{call.thesis}</ReactMarkdown>
            </div>
          </div>

          {/* Activity Log - Desktop */}
          <div className="hidden lg:block">
            <ActivityLog participants={call.participants} callId={call.id} />
          </div>
        </div>

        {/* Right column - Staking (Desktop) */}
        <div className="hidden lg:block space-y-6">
          <StakingInterface call={call} onStake={handleStake} />
          
          {/* Pool summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Pool Summary</h4>
            <StakeBar yes={call.stakes.yes} no={call.stakes.no} />
            <div className="mt-3 text-sm text-gray-600">
              Total Pool: {(call.stakes.yes + call.stakes.no)} USDC
            </div>
          </div>
        </div>

        {/* Mobile Staking Button */}
        {isMobile && !call.resolved && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              Place Stake
            </button>
          </div>
        )}
      </div>

      {/* Activity Log - Mobile */}
      {isMobile && (
        <div className="mt-6">
          <ActivityLog participants={call.participants} callId={call.id} />
        </div>
      )}

      {/* Mobile Staking Drawer */}
      <StakingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        call={call}
        onStake={handleStake}
      />
    </main>
  );
}
