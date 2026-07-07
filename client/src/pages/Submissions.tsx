import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { Send, Clock, ChevronRight } from 'lucide-react';

export const Submissions: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, submissions: storeSubmissions } = useStore();
  const submissions = storeSubmissions.filter(s => s.contributorAddress.toLowerCase() === wallet.address.toLowerCase());
  const loading = false;

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 text-center gap-4">
        <Send className="w-16 h-16 text-primary/45" />
        <h2 className="font-bold text-2xl text-charcoal">My Submissions</h2>
        <p className="text-sm text-charcoal/60 max-w-sm">Connect your wallet to view active submissions and review project reviews.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-charcoal">My Submissions</h1>
        <p className="text-sm text-charcoal/60 font-medium">Verify your submitted solution histories and current approval badges.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-charcoal/50">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-accent rounded-xl p-8 flex flex-col items-center gap-3">
          <Clock className="w-12 h-12 text-charcoal/30" />
          <h3 className="font-bold text-base text-charcoal">No Submissions Recorded</h3>
          <p className="text-xs text-charcoal/50 max-w-sm">You haven't applied to any bounties yet. Navigate to the Explore page to pick a task.</p>
          <button onClick={() => navigate('/explore')} className="btn-primary text-xs py-2 px-4 mt-2">
            Explore Bounties
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {submissions.map((sub, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/bounty/${sub.bountyId}`)}
              className="bg-white border border-accent rounded-xl p-5 shadow-sm hover:border-primary transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer"
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="font-bold text-sm text-charcoal truncate">Submission for Bounty #{sub.bountyId}</h3>
                <p className="text-xs text-charcoal/60 leading-normal truncate max-w-lg">{sub.message}</p>
                <span className="text-[10px] text-charcoal/40 font-mono">Tx: {sub.txHash?.slice(0, 10)}...</span>
              </div>
              
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded ${
                  sub.status === 'Winner'
                    ? 'bg-primary text-background'
                    : sub.status === 'Rejected'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-accent/40 text-charcoal/60'
                }`}>
                  {sub.status}
                </span>
                <ChevronRight className="w-4 h-4 text-charcoal/30 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
