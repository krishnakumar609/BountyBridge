import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { 
  Coins, 
  Clock, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  Activity,
  Plus
} from 'lucide-react';


export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, user, bounties, submissions } = useStore();

  const creatorBounties = bounties.filter(
    (b) => b.creatorAddress.toLowerCase() === wallet.address.toLowerCase()
  );

  const contributorSubmissions = submissions.filter(
    (s) => s.contributorAddress.toLowerCase() === wallet.address.toLowerCase()
  );

  // Simulated live event stream logs (resembling contract states)
  const [eventStream, setEventStream] = useState<Array<{ id: string; msg: string; time: string; type: string }>>([
    { id: '1', msg: 'Escrow Contract BountyEscrow initialized on-chain', time: '10:00 AM', type: 'info' },
    { id: '2', msg: 'Bounty #2 locked: 1,200 XLM deposited by GB3...CREATOR', time: '11:15 AM', type: 'lock' },
    { id: '3', msg: 'Submission registry entry registered for Bounty #2', time: '11:30 AM', type: 'registry' },
    { id: '4', msg: 'Bounty #1 winner selected: GC4...937 won 2,500 XLM', time: '12:05 PM', type: 'won' },
    { id: '5', msg: 'Stellar anchor reward releasing transaction signed & broadcasted', time: '12:06 PM', type: 'transfer' },
  ]);

  useEffect(() => {
    // Listen to mock WebSocket notifications for the stream
    const interval = setInterval(() => {
      const msgs = [
        'Contract BountyEscrow checking account balances...',
        'Horizon client refreshing consensus state...',
        'New contributor registered in SubmissionRegistry.',
        'Gas fees consumed: 100 Stroops.',
        'Bounty deadline timer tick: check expiry...',
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setEventStream((prev) => [
        { id: Math.random().toString(), msg: randomMsg, time: now, type: 'info' },
        ...prev.slice(0, 7),
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, [wallet.connected]);

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 px-6 text-center gap-4">
        <Coins className="w-16 h-16 text-primary/45" />
        <h2 className="font-bold text-2xl text-charcoal">Access Your Dashboard</h2>
        <p className="text-sm text-charcoal/60 max-w-sm">Connect your Stellar wallet to view metrics, active pursuits, locked funds, and real-time ledger actions.</p>
      </div>
    );
  }

  // Calculate Creator Metrics
  const creatorTotalLocked = creatorBounties
    .filter(b => b.status === 'Locked')
    .reduce((sum, b) => sum + b.rewardAmount, 0);
  const creatorTotalSpent = creatorBounties
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.rewardAmount, 0);
  // Calculate Contributor Metrics
  const contributorEarned = user?.totalRewardsEarned || 0;
  const winsCount = contributorSubmissions.filter(s => s.status === 'Winner').length;

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 overflow-y-auto">
      {/* MAIN ANALYTICS COLUMN */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="bg-white border border-accent rounded-xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <img 
              src={user?.avatar} 
              alt={user?.username} 
              className="w-16 h-16 rounded-full border border-accent object-cover bg-[#FAF7F2]" 
            />
            <div>
              <h2 className="text-xl font-bold text-charcoal">{user?.username}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">
                  {user?.badge || 'Contributor'}
                </span>
                <span className="text-xs text-charcoal/50 font-semibold">
                  Reputation score: {user?.reputationScore}/100
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/create')}
            className="btn-primary text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" /> Create Bounty
          </button>
        </div>

        {/* --- DUAL VIEW ANALYTICS CARDS --- */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg text-charcoal">Account Performance</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Locked Funds */}
            <div className="bg-white border border-accent rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider">Locked Escrow</span>
              <span className="text-xl md:text-2xl font-bold text-charcoal">{creatorTotalLocked.toLocaleString()} XLM</span>
            </div>

            {/* Spent Funds */}
            <div className="bg-white border border-accent rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider">Total Disbursed</span>
              <span className="text-xl md:text-2xl font-bold text-charcoal">{creatorTotalSpent.toLocaleString()} XLM</span>
            </div>

            {/* Earned Rewards */}
            <div className="bg-white border border-accent rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider">Earnings</span>
              <span className="text-xl md:text-2xl font-bold text-charcoal">{contributorEarned.toLocaleString()} XLM</span>
            </div>

            {/* Wins count */}
            <div className="bg-white border border-accent rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider">Total Wins</span>
              <span className="text-xl md:text-2xl font-bold text-charcoal">{winsCount} Wins</span>
            </div>
          </div>
        </div>

        {/* --- ACTIVE PURSUITS LIST --- */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg text-charcoal">Active Pursuits</h2>
          {(creatorBounties.length === 0 && contributorSubmissions.length === 0) ? (
            <div className="w-full bg-white border border-accent border-dashed rounded-xl p-8 text-center text-xs text-charcoal/50">
              No active bounties or submissions. Go find open tasks on the Explore page!
            </div>
          ) : (
            <div className="bg-white border border-accent rounded-xl overflow-hidden divide-y divide-accent/40 shadow-sm">
              {/* Creator Bounties */}
              {creatorBounties.map((b) => (
                <div 
                  key={b.contractBountyId}
                  onClick={() => navigate(`/bounty/${b.contractBountyId}`)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-surface-variant/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-charcoal truncate">{b.title}</p>
                      <p className="text-[9px] font-semibold text-charcoal/45 uppercase tracking-wider">Creator • {b.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-primary">{b.rewardAmount} XLM</span>
                    <ChevronRight className="w-4 h-4 text-charcoal/30" />
                  </div>
                </div>
              ))}

              {/* Contributor Submissions */}
              {contributorSubmissions.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(`/bounty/${s.bountyId}`)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-surface-variant/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.status === 'Winner' ? 'bg-primary' : 'bg-yellow-500'}`}></span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-charcoal truncate">Submission for Bounty #{s.bountyId}</p>
                      <p className="text-[9px] font-semibold text-charcoal/45 uppercase tracking-wider">Contributor • {s.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-charcoal/50">Details</span>
                    <ChevronRight className="w-4 h-4 text-charcoal/30" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- REAL-TIME EVENT STREAM PANEL (RIGHT SIDE) --- */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
        <div className="bg-white border border-accent rounded-xl shadow-card overflow-hidden h-full flex flex-col min-h-[400px] lg:max-h-[550px]">
          <div className="px-5 py-4 bg-surface-container-low border-b border-accent/40 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-charcoal">Event Stream</h3>
              <p className="text-[9px] uppercase tracking-wider text-charcoal/50 font-semibold">Live Contract Logs</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-[10px]">
            {eventStream.map((ev) => (
              <div key={ev.id} className="p-3 bg-surface-container-low rounded border border-accent/30 flex flex-col gap-1 leading-relaxed">
                <div className="flex justify-between items-center text-[8px] text-charcoal/40 font-sans font-bold">
                  <span className="uppercase tracking-wider">[{ev.type}]</span>
                  <span>{ev.time}</span>
                </div>
                <p className="text-charcoal/80 break-all">{ev.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
