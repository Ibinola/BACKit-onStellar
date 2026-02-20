"use client";

import { useState } from "react";
import { CallDetailData } from "@/types";

interface Props {
  call: CallDetailData;
  onStake: (amount: number, side: 'YES' | 'NO') => Promise<void>;
}

export default function StakingInterface({ call, onStake }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<'YES' | 'NO' | null>(null);
  const [isStaking, setIsStaking] = useState(false);

  // Calculate potential payout based on current pool
  const calculatePayout = (amount: number, side: 'YES' | 'NO') => {
    const totalYes = call.stakes.yes;
    const totalNo = call.stakes.no;
    const totalPool = totalYes + totalNo;
    
    if (side === 'YES') {
      // If YES wins, they share the NO pool
      const multiplier = totalNo / totalYes + 1;
      return (amount * multiplier).toFixed(2);
    } else {
      // If NO wins, they share the YES pool
      const multiplier = totalYes / totalNo + 1;
      return (amount * multiplier).toFixed(2);
    }
  };

  const handleStake = async () => {
    if (!selectedSide || !amount) return;
    
    setIsStaking(true);
    try {
      await onStake(parseFloat(amount), selectedSide);
      setAmount('');
      setSelectedSide(null);
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const numericAmount = parseFloat(amount) || 0;
  const potentialPayout = selectedSide && numericAmount > 0 
    ? calculatePayout(numericAmount, selectedSide)
    : '0.00';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Place Your Stake</h3>
      
      {/* Side selection */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setSelectedSide('YES')}
          className={`py-3 rounded-lg font-medium transition ${
            selectedSide === 'YES'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          YES 👍
        </button>
        <button
          onClick={() => setSelectedSide('NO')}
          className={`py-3 rounded-lg font-medium transition ${
            selectedSide === 'NO'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          NO 👎
        </button>
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USDC)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setAmount('100')}
            className="absolute right-2 top-2 text-xs bg-gray-200 px-2 py-1 rounded"
          >
            Max
          </button>
        </div>
      </div>

      {/* Profit simulation */}
      {selectedSide && numericAmount > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Potential payout if you win:</p>
          <p className="text-xl font-bold text-blue-600">
            {potentialPayout} USDC
          </p>
          <p className="text-xs text-gray-500 mt-1">
            +{(parseFloat(potentialPayout) - numericAmount).toFixed(2)} USDC profit
          </p>
        </div>
      )}

      {/* Pool distribution */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm mb-1">
          <span>YES Pool</span>
          <span className="font-medium">{call.stakes.yes} USDC</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <div 
            className="h-2 bg-green-500 rounded-full"
            style={{ 
              width: `${(call.stakes.yes / (call.stakes.yes + call.stakes.no)) * 100}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>NO Pool</span>
          <span className="font-medium">{call.stakes.no} USDC</span>
        </div>
      </div>

      {/* Stake button */}
      <button
        onClick={handleStake}
        disabled={!selectedSide || !amount || isStaking}
        className={`w-full py-3 rounded-lg font-medium text-white transition ${
          !selectedSide || !amount || isStaking
            ? 'bg-gray-400 cursor-not-allowed'
            : selectedSide === 'YES'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isStaking ? 'Processing...' : `Stake ${selectedSide || ''}`}
      </button>
    </div>
  );
}