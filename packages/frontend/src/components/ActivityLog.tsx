"use client";

import { Participant } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  participants: Participant[];
  callId: number;
}

export default function ActivityLog({ participants, callId }: Props) {
  const [activities, setActivities] = useState(participants);
  
  // Simulate real-time updates (replace with WebSocket in production)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/calls/${callId}/stakes/recent`);
        const newStakes = await res.json();
        if (newStakes.length > 0) {
          setActivities(prev => [...newStakes, ...prev].slice(0, 20));
        }
      } catch (error) {
        console.error('Failed to fetch recent stakes:', error);
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [callId]);

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Activity Log</h3>
        <p className="text-xs text-gray-500">Recent stakes and transactions</p>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No activity yet</p>
        ) : (
          activities.map((activity, index) => (
            <div key={`${activity.txHash}-${index}`} className="p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.side === 'YES' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {activity.side}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{activity.amount} USDC</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-block"
                  >
                    View tx ↗
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}