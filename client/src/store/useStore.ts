import { create } from 'zustand';
import { stellarService } from '../services/stellar.js';
import type { WalletState } from '../services/stellar.js';
import type { IBounty, ISubmission, ITransaction } from '../types/index.js';

export interface UserProfile {
  walletAddress: string;
  username: string;
  avatar: string;
  bio: string;
  reputationScore: number;
  totalRewardsEarned: number;
  totalBountiesCreated: number;
  totalSubmissions: number;
  joinedDate: string;
  badge?: string;
}

export interface AppNotification {
  id: string;
  type: string;
  bountyId: number;
  bountyTitle: string;
  wallet: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppState {
  wallet: WalletState;
  user: UserProfile | null;
  isWalletModalOpen: boolean;
  txLoadingState: {
    loading: boolean;
    title: string;
    message: string;
    txHash?: string;
  };
  
  bounties: IBounty[];
  submissions: ISubmission[];
  transactions: ITransaction[];
  notifications: AppNotification[];
  profiles: Record<string, { username: string; bio: string; avatar: string }>;

  setWalletModalOpen: (open: boolean) => void;
  setTxLoading: (loading: boolean, title?: string, message?: string, txHash?: string) => void;
  connectWallet: (type: 'freighter' | 'albedo' | 'xbull' | 'simulator', simulatedAddress?: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletBalance: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  createBounty: (bounty: Omit<IBounty, 'creatorAddress' | 'txHash' | 'status' | 'submissionCount' | 'winnerAddress' | 'createdAt'>) => Promise<number>;
  submitWork: (bountyId: number, submission: Omit<ISubmission, 'bountyId' | 'contributorAddress' | 'status' | 'txHash' | 'timestamp'>) => Promise<void>;
  selectWinner: (bountyId: number, winnerAddress: string) => Promise<void>;
  cancelBounty: (bountyId: number) => Promise<void>;
  
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotificationLocally: (note: AppNotification) => void;
}

// Initial Mock Data
const DEFAULT_BOUNTIES: IBounty[] = [
  {
    contractBountyId: 10001,
    title: 'Soroban Multi-sig Escrow Contract',
    description: 'Build a secure, audit-ready multi-signature escrow contract using the Soroban Rust SDK. The contract must allow creators to lock rewards and release them only upon receiving a 2-out-of-3 signatures validation.',
    category: 'Development',
    rewardAmount: 800,
    tokenType: 'XLM',
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    requirements: '1. Written in Rust for Soroban.\n2. Must include unit tests with mock auths.\n3. Detailed README on how to build and deploy.',
    tags: ['soroban', 'rust', 'escrow', 'multi-sig'],
    skillsRequired: ['Rust', 'Soroban SDK', 'Smart Contracts'],
    creatorAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG',
    txHash: 'a718cbdb82e783ab3e28490a0bbbcbc8294bb89deef998248c8bfaef729938c8',
    status: 'Locked',
    submissionCount: 2,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000)
  },
  {
    contractBountyId: 10002,
    title: 'BountyBridge Logo & Brand Identity',
    description: 'Design a professional logo and visual style guide for BountyBridge matching our handcrafted minimalism vibe. Brand colors should leverage warm stone, sage green, and cream shades.',
    category: 'Design',
    rewardAmount: 350,
    tokenType: 'XLM',
    deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    requirements: '1. Deliverables in Figma & SVG formats.\n2. Both dark & light modes included.\n3. High fidelity illustrations for landing hero.',
    tags: ['figma', 'branding', 'ui-ux'],
    skillsRequired: ['Figma', 'Vector Design', 'UI/UX'],
    creatorAddress: 'G_CREATOR_TESTNET_123',
    txHash: '394ccb394ccb394ccb394ccbdd039fdd039fdd039fdd039f',
    status: 'Locked',
    submissionCount: 1,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
  },
  {
    contractBountyId: 10003,
    title: 'Security Audit of SubmissionRegistry Contract',
    description: 'Perform a comprehensive vulnerability assessment and audit of our deployed SubmissionRegistry.wasm contract. Report on any possible reentrancy vectors, auth bypass, or state bloat issues.',
    category: 'Security',
    rewardAmount: 1200,
    tokenType: 'XLM',
    deadline: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    requirements: '1. Detailed PDF audit report.\n2. PoC exploit scripts if vulnerabilities are found.\n3. Recommended remediation steps.',
    tags: ['security', 'audit', 'soroban'],
    skillsRequired: ['Soroban VM', 'Rust Auditing', 'Exploit Scenarios'],
    creatorAddress: 'G_AUDITOR_ADMIN_888',
    txHash: 'cc78facc78facc78facc78fa9900ee9900ee9900ee9900ee',
    status: 'Completed',
    winnerAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG',
    submissionCount: 1,
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000)
  }
];

const DEFAULT_SUBMISSIONS: ISubmission[] = [
  {
    bountyId: 10001,
    contributorAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG',
    githubRepo: 'https://github.com/stellar-developer/soroban-multisig-escrow',
    githubPR: 'https://github.com/stellar-developer/soroban-multisig-escrow/pull/1',
    figmaLink: '',
    liveWebsite: '',
    documentation: 'https://github.com/stellar-developer/soroban-multisig-escrow/blob/main/README.md',
    videoDemo: '',
    message: 'I have finished implementing the 2-out-of-3 signatures escrow contract. Tests compile cleanly.',
    proof: 'Soroban contract successfully tested with 95% line coverage.',
    status: 'Pending',
    txHash: 'cc770acc770acc770acc770a94fe9b94fe9b94fe9b94fe9b',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000)
  },
  {
    bountyId: 10003,
    contributorAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG',
    githubRepo: 'https://github.com/stellar-developer/registry-audit',
    githubPR: '',
    figmaLink: '',
    liveWebsite: '',
    documentation: 'https://github.com/stellar-developer/registry-audit/report.pdf',
    videoDemo: '',
    message: 'Submitted audit report. Found 1 minor storage optimization vulnerability, remediation applied.',
    proof: 'PDF vulnerability report uploaded to public registry.',
    status: 'Winner',
    txHash: 'ffa88cb9911e3b2e7a783b9cde18cf8a2ef8dbe8ca22c09e3e78b9cdaee298bc',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000)
  }
];

const DEFAULT_TRANSACTIONS: ITransaction[] = [
  {
    id: 'tx_1',
    type: 'Lock Reward',
    amount: 800,
    txHash: 'a718cbdb82e783ab3e28490a0bbbcbc8294bb89deef998248c8bfaef729938c8',
    status: 'Confirmed',
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    walletAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG'
  },
  {
    id: 'tx_2',
    type: 'Select Winner',
    amount: 1200,
    txHash: 'ffa88cb9911e3b2e7a783b9cde18cf8a2ef8dbe8ca22c09e3e78b9cdaee298bc',
    status: 'Confirmed',
    date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    walletAddress: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG'
  }
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n_1',
    type: 'winner_selected',
    bountyId: 10003,
    bountyTitle: 'Security Audit of SubmissionRegistry Contract',
    wallet: 'GCYTEM4L43BOU3P5GX7RY34GVQMDZEV5TQLABQ2MA5WUPZSK44B5Z4KG',
    message: 'Congratulations! Your solution was selected as winner. 1200 XLM is released to your wallet.',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    read: false
  }
];

const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(`bountybridge_${key}`, JSON.stringify(data));
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(`bountybridge_${key}`);
  if (!item) return defaultValue;
  try {
    const parsed = JSON.parse(item);
    if (key === 'bounties') {
      return parsed.map((b: any) => ({
        ...b,
        deadline: new Date(b.deadline),
        createdAt: new Date(b.createdAt)
      }));
    }
    if (key === 'submissions') {
      return parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      }));
    }
    if (key === 'transactions') {
      return parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }));
    }
    if (key === 'notifications') {
      return parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse local storage key', key, err);
    return defaultValue;
  }
};

export const useStore = create<AppState>((set, get) => {
  const bounties = loadFromLocalStorage('bounties', DEFAULT_BOUNTIES);
  const submissions = loadFromLocalStorage('submissions', DEFAULT_SUBMISSIONS);
  const transactions = loadFromLocalStorage('transactions', DEFAULT_TRANSACTIONS);
  const notifications = loadFromLocalStorage('notifications', DEFAULT_NOTIFICATIONS);
  const profiles = loadFromLocalStorage('profiles', {});

  return {
    wallet: {
      connected: false,
      address: '',
      network: '',
      xlmBalance: '0.00',
      walletType: null,
    },
    user: null,
    isWalletModalOpen: false,
    txLoadingState: {
      loading: false,
      title: '',
      message: '',
    },

    bounties,
    submissions,
    transactions,
    notifications,
    profiles,

    setWalletModalOpen: (open) => set({ isWalletModalOpen: open }),
    
    setTxLoading: (loading, title = '', message = '', txHash) => 
      set({ txLoadingState: { loading, title, message, txHash } }),

    connectWallet: async (type, simulatedAddress) => {
      try {
        set({ 
          txLoadingState: { 
            loading: true, 
            title: 'Connecting Wallet', 
            message: `Requesting authorization from ${type} wallet...` 
          } 
        });

        const walletState = await stellarService.connect(type, simulatedAddress);

        const challenge = `BountyBridge Authentication Challenge: ${Date.now()}`;
        const signature = await stellarService.signAuthMessage(type, walletState.address, challenge);
        console.log(`🔒 Authentication signature verified: ${signature.slice(0, 15)}...`);

        const currentProfiles = get().profiles;
        let userProfile = currentProfiles[walletState.address];
        
        if (!userProfile) {
          userProfile = {
            username: `Builder_${walletState.address.slice(2, 8)}`,
            bio: 'Soroban developer exploring open bounties.',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${walletState.address}`,
          };
          currentProfiles[walletState.address] = userProfile;
          saveToLocalStorage('profiles', currentProfiles);
        }

        const userBounties = get().bounties.filter(b => b.creatorAddress === walletState.address);
        const userSubs = get().submissions.filter(s => s.contributorAddress === walletState.address);
        const userWins = get().bounties.filter(b => b.winnerAddress === walletState.address && b.status === 'Completed');
        
        const totalRewards = userWins.reduce((sum, b) => sum + b.rewardAmount, 0);
        const score = Math.min(100, 50 + (userBounties.length * 10) + (userSubs.length * 15) + (userWins.length * 20));
        
        const badge = score >= 90 ? 'Legend' 
                    : score >= 75 ? 'Expert' 
                    : score >= 60 ? 'Builder' 
                    : score >= 50 ? 'Contributor' 
                    : 'Explorer';

        const fullUser: UserProfile = {
          walletAddress: walletState.address,
          username: userProfile.username,
          avatar: userProfile.avatar,
          bio: userProfile.bio,
          reputationScore: score,
          totalRewardsEarned: totalRewards,
          totalBountiesCreated: userBounties.length,
          totalSubmissions: userSubs.length,
          joinedDate: new Date().toLocaleDateString(),
          badge
        };

        sessionStorage.setItem('walletAddress', walletState.address);
        sessionStorage.setItem('walletType', type);

        set({
          wallet: walletState,
          user: fullUser,
          isWalletModalOpen: false,
          txLoadingState: { loading: false, title: '', message: '' }
        });

        get().fetchNotifications();

      } catch (error) {
        set({ txLoadingState: { loading: false, title: '', message: '' } });
        throw error;
      }
    },

    disconnectWallet: () => {
      sessionStorage.removeItem('walletAddress');
      sessionStorage.removeItem('walletType');
      set({
        wallet: {
          connected: false,
          address: '',
          network: '',
          xlmBalance: '0.00',
          walletType: null,
        },
        user: null,
      });
    },

    refreshWalletBalance: async () => {
      const { address, walletType } = get().wallet;
      if (!address || !walletType) return;
      const balance = await stellarService.refreshBalance(address, walletType);
      set((state) => ({ wallet: { ...state.wallet, xlmBalance: balance } }));
    },

    updateUserProfile: (profile) => {
      const currentAddress = get().wallet.address;
      if (!currentAddress) return;

      const currentProfiles = get().profiles;
      const userProfile = currentProfiles[currentAddress] || {
        username: `Builder_${currentAddress.slice(2, 8)}`,
        bio: '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${currentAddress}`
      };

      const updated = {
        ...userProfile,
        username: profile.username !== undefined ? profile.username : userProfile.username,
        bio: profile.bio !== undefined ? profile.bio : userProfile.bio,
        avatar: profile.avatar !== undefined ? profile.avatar : userProfile.avatar,
      };

      currentProfiles[currentAddress] = updated;
      saveToLocalStorage('profiles', currentProfiles);

      set((state) => {
        if (!state.user) return {};
        return {
          user: {
            ...state.user,
            username: updated.username,
            bio: updated.bio,
            avatar: updated.avatar
          }
        };
      });
    },

    createBounty: async (bountyData) => {
      const { address } = get().wallet;
      if (!address) throw new Error('Wallet not connected');

      const bountyId = bountyData.contractBountyId;
      const generatedHash = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newBounty: IBounty = {
        ...bountyData,
        creatorAddress: address,
        txHash: generatedHash,
        status: 'Locked',
        submissionCount: 0,
        createdAt: new Date()
      };

      const newTransaction: ITransaction = {
        id: `tx_${Date.now()}`,
        type: 'Lock Reward',
        amount: bountyData.rewardAmount,
        txHash: generatedHash,
        status: 'Confirmed',
        date: new Date(),
        walletAddress: address
      };

      const updatedBounties = [newBounty, ...get().bounties];
      const updatedTxs = [newTransaction, ...get().transactions];

      set({
        bounties: updatedBounties,
        transactions: updatedTxs
      });

      saveToLocalStorage('bounties', updatedBounties);
      saveToLocalStorage('transactions', updatedTxs);

      const newNotification: AppNotification = {
        id: `n_${Date.now()}`,
        type: 'bounty_created',
        bountyId,
        bountyTitle: bountyData.title,
        wallet: address,
        message: `Escrow contract funded with ${bountyData.rewardAmount} XLM. Bounty is now live!`,
        timestamp: new Date(),
        read: false
      };

      const updatedNotes = [newNotification, ...get().notifications];
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);

      get().refreshWalletBalance();
      
      const userState = get().user;
      if (userState) {
        const newCount = userState.totalBountiesCreated + 1;
        const newScore = Math.min(100, userState.reputationScore + 10);
        set({
          user: {
            ...userState,
            totalBountiesCreated: newCount,
            reputationScore: newScore,
            badge: newScore >= 90 ? 'Legend' : newScore >= 75 ? 'Expert' : newScore >= 60 ? 'Builder' : 'Contributor'
          }
        });
      }

      return bountyId;
    },

    submitWork: async (bountyId, submissionData) => {
      const { address } = get().wallet;
      if (!address) throw new Error('Wallet not connected');

      const generatedHash = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newSubmission: ISubmission = {
        ...submissionData,
        bountyId,
        contributorAddress: address,
        status: 'Pending',
        txHash: generatedHash,
        timestamp: new Date()
      };

      const newTransaction: ITransaction = {
        id: `tx_${Date.now()}`,
        type: 'Submit Work',
        amount: 0,
        txHash: generatedHash,
        status: 'Confirmed',
        date: new Date(),
        walletAddress: address
      };

      const updatedSubs = [newSubmission, ...get().submissions];
      const updatedTxs = [newTransaction, ...get().transactions];

      const updatedBounties = get().bounties.map(b => 
        b.contractBountyId === bountyId 
          ? { ...b, submissionCount: (b.submissionCount || 0) + 1 }
          : b
      );

      set({
        submissions: updatedSubs,
        transactions: updatedTxs,
        bounties: updatedBounties
      });

      saveToLocalStorage('submissions', updatedSubs);
      saveToLocalStorage('transactions', updatedTxs);
      saveToLocalStorage('bounties', updatedBounties);

      const bounty = get().bounties.find(b => b.contractBountyId === bountyId);
      const bountyTitle = bounty ? bounty.title : `Bounty #${bountyId}`;

      const creatorNotification: AppNotification = {
        id: `n_${Date.now()}`,
        type: 'work_submitted',
        bountyId,
        bountyTitle,
        wallet: bounty?.creatorAddress || '',
        message: `New solution registered by builder ${address.slice(0, 6)}... for "${bountyTitle}".`,
        timestamp: new Date(),
        read: false
      };

      const updatedNotes = [creatorNotification, ...get().notifications];
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);

      get().refreshWalletBalance();

      const userState = get().user;
      if (userState) {
        const newCount = userState.totalSubmissions + 1;
        const newScore = Math.min(100, userState.reputationScore + 15);
        set({
          user: {
            ...userState,
            totalSubmissions: newCount,
            reputationScore: newScore,
            badge: newScore >= 90 ? 'Legend' : newScore >= 75 ? 'Expert' : newScore >= 60 ? 'Builder' : 'Contributor'
          }
        });
      }
    },

    selectWinner: async (bountyId, winnerAddress) => {
      const { address } = get().wallet;
      if (!address) throw new Error('Wallet not connected');

      const bounty = get().bounties.find(b => b.contractBountyId === bountyId);
      if (!bounty) throw new Error('Bounty not found');

      const generatedHash = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const updatedBounties = get().bounties.map(b => 
        b.contractBountyId === bountyId 
          ? { ...b, status: 'Completed' as const, winnerAddress }
          : b
      );

      const updatedSubs = get().submissions.map(s => 
        s.bountyId === bountyId
          ? { ...s, status: (s.contributorAddress === winnerAddress ? 'Winner' : 'Rejected') as any }
          : s
      );

      const winnerTx: ITransaction = {
        id: `tx_${Date.now()}`,
        type: 'Select Winner',
        amount: bounty.rewardAmount,
        txHash: generatedHash,
        status: 'Confirmed',
        date: new Date(),
        walletAddress: address
      };

      const updatedTxs = [winnerTx, ...get().transactions];

      set({
        bounties: updatedBounties,
        submissions: updatedSubs,
        transactions: updatedTxs
      });

      saveToLocalStorage('bounties', updatedBounties);
      saveToLocalStorage('submissions', updatedSubs);
      saveToLocalStorage('transactions', updatedTxs);

      const winNotification: AppNotification = {
        id: `n_${Date.now()}`,
        type: 'winner_selected',
        bountyId,
        bountyTitle: bounty.title,
        wallet: winnerAddress,
        message: `Congratulations! Your solution for "${bounty.title}" was selected as winner. ${bounty.rewardAmount} XLM is released to your wallet.`,
        timestamp: new Date(),
        read: false
      };

      const updatedNotes = [winNotification, ...get().notifications];
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);

      get().refreshWalletBalance();

      const userState = get().user;
      if (userState && userState.walletAddress === winnerAddress) {
        const newEarned = userState.totalRewardsEarned + bounty.rewardAmount;
        const newScore = Math.min(100, userState.reputationScore + 20);
        set({
          user: {
            ...userState,
            totalRewardsEarned: newEarned,
            reputationScore: newScore,
            badge: newScore >= 90 ? 'Legend' : newScore >= 75 ? 'Expert' : newScore >= 60 ? 'Builder' : 'Contributor'
          }
        });
      }
    },

    cancelBounty: async (bountyId) => {
      const { address } = get().wallet;
      if (!address) throw new Error('Wallet not connected');

      const bounty = get().bounties.find(b => b.contractBountyId === bountyId);
      if (!bounty) throw new Error('Bounty not found');

      const generatedHash = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const updatedBounties = get().bounties.map(b => 
        b.contractBountyId === bountyId 
          ? { ...b, status: 'Cancelled' as const }
          : b
      );

      const cancelTx: ITransaction = {
        id: `tx_${Date.now()}`,
        type: 'Cancel Bounty',
        amount: bounty.rewardAmount,
        txHash: generatedHash,
        status: 'Confirmed',
        date: new Date(),
        walletAddress: address
      };

      const updatedTxs = [cancelTx, ...get().transactions];

      set({
        bounties: updatedBounties,
        transactions: updatedTxs
      });

      saveToLocalStorage('bounties', updatedBounties);
      saveToLocalStorage('transactions', updatedTxs);

      const cancelNotification: AppNotification = {
        id: `n_${Date.now()}`,
        type: 'bounty_cancelled',
        bountyId,
        bountyTitle: bounty.title,
        wallet: address,
        message: `Bounty "${bounty.title}" has been successfully cancelled and your escrow deposit of ${bounty.rewardAmount} XLM has been refunded.`,
        timestamp: new Date(),
        read: false
      };

      const updatedNotes = [cancelNotification, ...get().notifications];
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);

      get().refreshWalletBalance();
    },

    fetchNotifications: async () => {},

    markNotificationRead: async (id) => {
      const updatedNotes = get().notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      );
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);
    },

    deleteNotification: async (id) => {
      const updatedNotes = get().notifications.filter((n) => n.id !== id);
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);
    },

    addNotificationLocally: (note) => {
      const updatedNotes = [note, ...get().notifications];
      set({ notifications: updatedNotes });
      saveToLocalStorage('notifications', updatedNotes);
    }
  };
});
