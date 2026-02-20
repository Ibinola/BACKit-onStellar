export interface User {
  address: string
  displayName?: string
  winRate: number
  totalCalls: number
  followers: number
  following: number
  isFollowing?: boolean
}

export interface Call {
  id: string
  creator: string
  title: string
  description: string
  token: string
  condition: string
  stake: number
  startTs: number
  endTs: number
  outcome?: 'YES' | 'NO' | 'PENDING'
  finalPrice?: number
  participants: number
  totalStake: number
  contentCID?: string
}

export interface UserProfile {
  user: User
  createdCalls: Call[]
  participatedCalls: Call[]
  resolvedCalls: Call[]
}

export interface Participant {
  address: string;
  side: 'YES' | 'NO';
  amount: string;
  timestamp: string; // ISO date string
  txHash: string;
}

export interface CallDetailData {
  id: number;
  title: string;
  thesis: string;
  tokenAddress: string;
  pairId: string;
  token: {
    symbol: string;
    price: number;
    targetPrice?: number; 
  };
  stakeToken: string;
  stakeAmount: string;
  creatorAddress: string;
  endTime: string;
  resolved: boolean;
  outcome?: string;
  stakes: {
    yes: number;
    no: number;
  };
  participants: Participant[];
  condition: string;
  conditionJson?: any;
}

export type TabType = 'created' | 'participated' | 'resolved'
