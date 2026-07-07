import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { Users, Plus, Award } from 'lucide-react';

export const MyBounties: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, bounties: storeBounties } = useStore();
  const bounties = storeBounties.filter(b => b.creatorAddress.toLowerCase() === wallet.address.toLowerCase());
  const loading = false;

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 text-center gap-4">
        <Users className="w-16 h-16 text-primary/45" />
        <h2 className="font-bold text-2xl text-charcoal">My Created Bounties</h2>
        <p className="text-sm text-charcoal/60 max-w-sm">Connect your wallet to manage and fund your escrows.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-charcoal">My Bounties</h1>
          <p className="text-sm text-charcoal/60">Manage your deployed Soroban escrows, review work, and disburse rewards.</p>
        </div>
        <button 
          onClick={() => navigate('/create')}
          className="btn-primary text-xs py-2.5 px-4"
        >
          <Plus className="w-4 h-4" /> Create Bounty
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-charcoal/50">Loading your bounties...</div>
      ) : bounties.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-accent rounded-xl p-8 flex flex-col items-center gap-3">
          <Award className="w-12 h-12 text-charcoal/30" />
          <h3 className="font-bold text-base text-charcoal">No Bounties Deployed</h3>
          <p className="text-xs text-charcoal/50 max-w-sm">You haven't created any escrows yet. Click the button above to launch your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty) => (
            <div
              key={bounty.contractBountyId}
              onClick={() => navigate(`/bounty/${bounty.contractBountyId}`)}
              className="bg-white rounded-xl border border-accent/60 shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="p-5 flex justify-between items-start border-b border-accent/30 bg-surface-container-low">
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded font-bold uppercase">
                  {bounty.category}
                </span>
                <span className="text-xs font-bold text-primary">{bounty.rewardAmount} {bounty.tokenType}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col gap-2">
                <h3 className="font-bold text-sm text-charcoal leading-snug line-clamp-2">{bounty.title}</h3>
                <span className="text-[10px] uppercase font-bold text-charcoal/40">Status: {bounty.status}</span>
              </div>
              <div className="px-5 py-4 border-t border-accent/30 bg-[#FAF7F2] flex justify-between items-center text-xs text-charcoal/50">
                <span>Deadline: {new Date(bounty.deadline).toLocaleDateString()}</span>
                <span className="font-semibold text-primary">{bounty.submissionCount || 0} Submissions</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
