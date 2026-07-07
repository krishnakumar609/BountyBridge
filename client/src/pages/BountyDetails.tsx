import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { stellarService } from '../services/stellar.js';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Coins, 
  User, 
  ExternalLink, 
  CheckCircle, 
  Globe, 
  FileText, 
  PlayCircle,
  AlertCircle,
  Clock,
  Award
} from 'lucide-react';

export const BountyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bountyId = parseInt(id || '');

  const { 
    wallet, 
    setTxLoading, 
    setWalletModalOpen, 
    bounties, 
    submissions: storeSubmissions, 
    submitWork, 
    selectWinner, 
    cancelBounty 
  } = useStore();

  const bounty = bounties.find(b => b.contractBountyId === bountyId) || null;
  const submissions = storeSubmissions.filter(s => s.bountyId === bountyId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Submission Form State
  const [message, setMessage] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [githubPR, setGithubPR] = useState('');
  const [figmaLink, setFigmaLink] = useState('');
  const [liveWebsite, setLiveWebsite] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [videoDemo, setVideoDemo] = useState('');
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isNaN(bountyId)) return;
    setLoading(true);
    if (!bounty) {
      setError('Bounty not found');
    } else {
      setError('');
    }
    setLoading(false);
  }, [bountyId, bounty]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) {
      setWalletModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      // 1. Submit transaction on-chain via smart contract
      setTxLoading(
        true, 
        'Registering Submission On-Chain', 
        'Invoking Soroban contract: submit_work... Please confirm in wallet.'
      );

      const txResult = await stellarService.submitContractTx(
        wallet.walletType!,
        'submit_work',
        {
          bountyId,
          contributor: wallet.address,
          proofUrl: githubRepo || liveWebsite || 'proof_submission',
        }
      );

      if (!txResult.success) {
        throw new Error('On-chain submission failed.');
      }

      // 2. Post metadata to state
      setTxLoading(
        true, 
        'Uploading Work Metadata', 
        'Registering submission details on-chain...',
        txResult.txHash
      );

      await submitWork(bountyId, {
        githubRepo,
        githubPR,
        figmaLink,
        liveWebsite,
        documentation,
        videoDemo,
        message,
        proof: proof || 'On-Chain Submission Recorded',
      });

      setTxLoading(false);
      
      // Clear form
      setMessage('');
      setGithubRepo('');
      setGithubPR('');
      setFigmaLink('');
      setLiveWebsite('');
      setDocumentation('');
      setVideoDemo('');
      setProof('');

    } catch (err) {
      console.error(err);
      setTxLoading(false);
      alert((err as Error).message || 'Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectWinner = async (winnerAddress: string) => {
    if (!bounty) return;
    
    const confirmChoice = window.confirm(`Are you sure you want to select ${winnerAddress.slice(0, 6)}...${winnerAddress.slice(-6)} as the winner? This will release ${bounty.rewardAmount} XLM from the escrow.`);
    if (!confirmChoice) return;

    try {
      setTxLoading(
        true, 
        'Releasing Escrow Payout', 
        'Invoking Soroban contract: select_winner... releasing funds to contributor.'
      );

      // 1. Invoke contract select winner
      const txResult = await stellarService.submitContractTx(
        wallet.walletType!,
        'select_winner',
        {
          bountyId,
          winner: winnerAddress,
        }
      );

      if (!txResult.success) {
        throw new Error('Winner selection on-chain call failed.');
      }

      // 2. Post state updates
      setTxLoading(
        true, 
        'Updating Bounty Status', 
        'Recording winning builder and releasing platform reputation points...',
        txResult.txHash
      );

      await selectWinner(bountyId, winnerAddress);

      setTxLoading(false);
      
      // Celebrate with Confetti!
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
      setTxLoading(false);
      alert((err as Error).message || 'Failed to select winner.');
    }
  };

  const handleCancelBounty = async () => {
    if (!bounty) return;
    
    const confirmCancel = window.confirm('Are you sure you want to cancel this bounty? This will trigger an escrow refund back to your wallet.');
    if (!confirmCancel) return;

    try {
      setTxLoading(
        true,
        'Refunding Escrow Deposit',
        'Invoking Soroban contract: cancel_bounty... returning funds to creator.'
      );

      const txResult = await stellarService.submitContractTx(
        wallet.walletType!,
        'cancel_bounty',
        {
          bountyId,
        }
      );

      if (!txResult.success) {
        throw new Error('Cancellation transaction failed.');
      }

      setTxLoading(
        true,
        'Updating state',
        'Refunding deposits and closing bounty details...',
        txResult.txHash
      );

      await cancelBounty(bountyId);

      setTxLoading(false);

    } catch (err) {
      console.error(err);
      setTxLoading(false);
      alert((err as Error).message || 'Failed to cancel.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <span className="text-xs text-charcoal/60 font-semibold">Loading bounty details...</span>
      </div>
    );
  }

  if (error || !bounty) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="font-bold text-xl text-charcoal">Error Loading Bounty</h2>
        <p className="text-sm text-charcoal/60">{error || 'Bounty does not exist or has been deleted.'}</p>
        <button onClick={() => navigate('/explore')} className="btn-primary text-xs py-2 px-4 mt-2">
          Back to Explore
        </button>
      </div>
    );
  }

  const isCreator = wallet.connected && wallet.address.toLowerCase() === bounty.creatorAddress.toLowerCase();
  const hasSubmitted = wallet.connected && submissions.some(s => s.contributorAddress.toLowerCase() === wallet.address.toLowerCase());
  
  const daysLeft = Math.ceil(
    (new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-full p-6 md:p-8 max-w-6xl mx-auto overflow-y-auto">
      {/* LEFT COLUMN: DETAILS */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate('/explore')}
          className="text-xs font-bold text-charcoal/50 hover:text-primary self-start transition-colors"
        >
          ← Back to Explore
        </button>

        {/* Title Block */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
              {bounty.category}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
              bounty.status === 'Locked' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : bounty.status === 'Completed' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'
            }`}>
              {bounty.status === 'Locked' ? 'Active' : bounty.status}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-charcoal leading-snug">{bounty.title}</h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-charcoal/50 font-medium">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-charcoal/30" />
              Creator: <span className="font-mono text-charcoal/70">{bounty.creatorAddress.slice(0, 6)}...{bounty.creatorAddress.slice(-6)}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal/20"></span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-charcoal/30" />
              Created: <span className="text-charcoal/70">{new Date(bounty.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-accent/40"></div>

        {/* Description */}
        <div className="flex flex-col gap-2.5">
          <h2 className="font-bold text-lg text-charcoal">Description</h2>
          <p className="text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap">{bounty.description}</p>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-2.5 bg-white border border-accent rounded-xl p-5 shadow-sm">
          <h2 className="font-bold text-base text-charcoal flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5 text-primary" /> Submission Requirements
          </h2>
          <p className="text-xs text-charcoal/70 leading-relaxed whitespace-pre-wrap">{bounty.requirements}</p>
        </div>

        {/* Submissions List Section */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-charcoal">Submissions ({submissions.length})</h2>
            {isCreator && bounty.status === 'Locked' && (
              <button 
                onClick={handleCancelBounty}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                Cancel & Refund
              </button>
            )}
          </div>

          {submissions.length === 0 ? (
            <div className="border border-dashed border-accent rounded-xl bg-white p-8 text-center text-xs text-charcoal/50">
              No solutions submitted yet. Be the first to build!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {submissions.map((sub, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-4 transition-all ${
                    sub.status === 'Winner' 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                      : 'border-accent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-background font-bold text-xs uppercase">
                        {sub.contributorAddress.slice(2, 4)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal font-mono">
                          {sub.contributorAddress.slice(0, 6)}...{sub.contributorAddress.slice(-6)}
                        </p>
                        <p className="text-[10px] text-charcoal/40">
                          Submitted on {new Date(sub.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      sub.status === 'Winner' 
                        ? 'bg-primary text-background' 
                        : 'bg-accent/40 text-charcoal/60'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal/70 leading-relaxed whitespace-pre-wrap">{sub.message}</p>

                  {/* Submission Links */}
                  <div className="flex flex-wrap gap-2.5 pt-3 border-t border-accent/20">
                    {sub.githubRepo && (
                      <a href={sub.githubRepo} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5 text-charcoal/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg> Repository
                      </a>
                    )}
                    {sub.githubPR && (
                      <a href={sub.githubPR} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5 text-charcoal/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg> Pull Request
                      </a>
                    )}
                    {sub.figmaLink && (
                      <a href={sub.figmaLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5 text-charcoal/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path></svg> Figma Design
                      </a>
                    )}
                    {sub.liveWebsite && (
                      <a href={sub.liveWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <Globe className="w-3.5 h-3.5 text-charcoal/60" /> Demo URL
                      </a>
                    )}
                    {sub.documentation && (
                      <a href={sub.documentation} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <FileText className="w-3.5 h-3.5 text-charcoal/60" /> Documentation
                      </a>
                    )}
                    {sub.videoDemo && (
                      <a href={sub.videoDemo} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#FAF7F2] border border-accent hover:border-charcoal rounded px-2.5 py-1 text-[10px] text-charcoal/80 font-semibold transition-colors">
                        <PlayCircle className="w-3.5 h-3.5 text-charcoal/60" /> Video Demo
                      </a>
                    )}
                  </div>

                  {/* Creator Winner Selection panel */}
                  {isCreator && bounty.status === 'Locked' && (
                    <button
                      onClick={() => handleSelectWinner(sub.contributorAddress)}
                      className="mt-2 w-full bg-primary hover:bg-primary-dark text-background font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Award className="w-4 h-4" /> Select as Winner & Release Reward
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTION PANEL */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
        {/* Reward card */}
        <div className="bg-white border border-accent rounded-xl shadow-card overflow-hidden">
          <div className="bg-surface-container-low p-5 border-b border-accent/40 flex flex-col gap-1 items-center text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/50">Escrow Reward</span>
            <div className="flex items-center gap-1 text-primary my-1">
              <Coins className="w-6 h-6 shrink-0" />
              <span className="text-3xl font-extrabold">{bounty.rewardAmount.toLocaleString()}</span>
            </div>
            <span className="text-xs font-bold text-primary font-mono">{bounty.tokenType} Token</span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-charcoal/60">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-charcoal/40" /> Status</span>
              <span className="font-bold text-charcoal">{bounty.status === 'Locked' ? 'Active' : bounty.status}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-charcoal/60">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-charcoal/40" /> Deadline</span>
              <span className="font-bold text-charcoal">{new Date(bounty.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-charcoal/60">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-charcoal/40" /> Time Left</span>
              <span className={`font-bold ${daysLeft <= 2 ? 'text-red-600 animate-pulse' : 'text-charcoal'}`}>
                {daysLeft > 0 ? `${daysLeft} days` : 'Ended'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-charcoal/60">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-charcoal/40" /> Escrow Lock</span>
              <span className="text-primary font-bold inline-flex items-center gap-0.5">Verified <ExternalLink className="w-3 h-3" /></span>
            </div>
          </div>
        </div>

        {/* CONTRIBUTOR SUBMISSION FORM */}
        {!isCreator && bounty.status === 'Locked' && daysLeft > 0 && (
          <div className="bg-white border border-accent rounded-xl shadow-card p-5 flex flex-col gap-4">
            <h3 className="font-bold text-base text-charcoal">Submit Solution</h3>
            
            {hasSubmitted ? (
              <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs leading-relaxed font-semibold">
                You have already submitted a solution for this bounty. You can submit another solution or wait for the creator's review.
              </div>
            ) : null}

            <form onSubmit={handleApplySubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase mb-1">Message / Explanation</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your approach, libraries used, and how to test..."
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg p-2.5 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase mb-1">GitHub Pull Request</label>
                <input
                  type="url"
                  value={githubPR}
                  onChange={(e) => setGithubPR(e.target.value)}
                  placeholder="Optional PR Link"
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase mb-1">Figma Link</label>
                <input
                  type="url"
                  value={figmaLink}
                  onChange={(e) => setFigmaLink(e.target.value)}
                  placeholder="Optional Figma File"
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase mb-1">Live Demo / Website</label>
                <input
                  type="url"
                  value={liveWebsite}
                  onChange={(e) => setLiveWebsite(e.target.value)}
                  placeholder="Optional Sandbox or App URL"
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg p-2.5 text-xs text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-2.5 text-xs mt-2"
              >
                Submit Work & Log On-Chain
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
