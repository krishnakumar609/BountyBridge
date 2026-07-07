export interface IUser {
  walletAddress: string;
  username: string;
  avatar: string;
  bio: string;
  reputationScore: number;
  totalRewardsEarned: number;
  totalBountiesCreated: number;
  totalSubmissions: number;
  joinedDate: Date;
}

export interface IBounty {
  contractBountyId: number;
  title: string;
  description: string;
  category: string;
  rewardAmount: number;
  tokenType: string;
  deadline: Date;
  requirements: string;
  tags: string[];
  skillsRequired: string[];
  creatorAddress: string;
  txHash: string;
  status: 'Created' | 'Locked' | 'Completed' | 'Cancelled';
  winnerAddress?: string;
  submissionCount: number;
  createdAt: Date;
}

export interface ISubmission {
  bountyId: number;
  contributorAddress: string;
  githubRepo: string;
  githubPR: string;
  figmaLink: string;
  liveWebsite: string;
  documentation: string;
  videoDemo: string;
  message: string;
  timestamp: Date;
  proof: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Winner';
  txHash?: string;
}

export interface INotification {
  id: string;
  type: string;
  bountyId: number;
  bountyTitle: string;
  wallet: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ITransaction {
  id: string;
  txHash: string;
  walletAddress: string;
  type: string;
  amount?: number;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Failed';
  date: Date;
}
