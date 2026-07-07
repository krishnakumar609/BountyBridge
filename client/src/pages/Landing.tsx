import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { Plus, Search, ShieldCheck, Zap, Trophy, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, setWalletModalOpen } = useStore();

  const handleCreateBountyClick = () => {
    if (!wallet.connected) {
      setWalletModalOpen(true);
    } else {
      navigate('/create');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-semibold text-primary">Stellar Campus Program - Level 3 Compliant</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl text-charcoal font-bold tracking-tight leading-tight max-w-4xl">
          Create, Fund, and Complete <br className="hidden md:block"/> 
          <span className="script-logo text-6xl md:text-8xl text-primary font-normal">Bounties</span> on Stellar
        </h1>
        
        <p className="text-base md:text-xl text-charcoal/70 max-w-2xl mt-2 leading-relaxed">
          Connect world-class contributors with high-impact projects. Secure escrow, transparent smart contracts, and seamless payouts across the ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            onClick={handleCreateBountyClick}
            className="btn-primary text-base px-8 py-3.5 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Bounty
          </button>
          <button 
            onClick={() => navigate('/explore')}
            className="btn-secondary text-base px-8 py-3.5 hover:bg-accent/10"
          >
            <Search className="w-5 h-5" />
            Explore Bounties
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-accent/20 py-16 border-y border-accent/40">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '12.5k', label: 'Total Bounties' },
            { value: '842', label: 'Active Bounties' },
            { value: '$4.2M', label: 'Rewards Paid' },
            { value: '34k', label: 'Contributors' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-4xl md:text-5xl font-bold text-primary font-sans">{stat.value}</span>
              <span className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mt-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Mechanics Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-charcoal">Decentralized Trust Built on Soroban</h2>
          <p className="text-sm text-charcoal/60 mt-2">Our architecture guarantees security and transparency for both creators and builders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-accent/40 card-shadow flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-charcoal">Escrow Protection</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Rewards are locked in individual smart contract escrows immediately upon creation. Funds cannot be retrieved without proof or project cancellation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-accent/40 card-shadow flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-charcoal">Instant Settlements</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              When the creator selects the winning submission, the Soroban smart contract automatically releases the escrowed tokens to the winner's wallet.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-accent/40 card-shadow flex flex-col gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-charcoal">Reputation Registry</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Every completed bounty and submission is recorded on-chain, creating a verified resume of developers' contributions and credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Bounties Preview */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12 pb-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-charcoal">Featured Bounties</h2>
            <p className="text-sm text-charcoal/60 mt-1">High-priority tasks seeking immediate contribution.</p>
          </div>
          <button 
            onClick={() => navigate('/explore')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all bounties <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => navigate('/explore')}
            className="bg-white rounded-xl p-6 border border-accent/60 card-shadow card-shadow-hover transition-all duration-300 flex flex-col h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-primary/10 rounded text-xs font-semibold text-primary">Development</span>
              <span className="text-lg font-bold text-primary">2,500 XLM</span>
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2 leading-tight">Implement Soroban Smart Contracts for Escrow</h3>
            <p className="text-xs text-charcoal/60 mb-6 flex-grow line-clamp-3">Develop and deploy rust-based smart contracts for secure multi-sig escrow functionality on the Stellar network.</p>
            <div className="flex justify-between items-center pt-4 border-t border-accent/30 text-xs text-charcoal/50">
              <span className="flex items-center gap-1">3 days left</span>
              <span className="font-semibold text-primary">12 submissions</span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => navigate('/explore')}
            className="bg-white rounded-xl p-6 border border-accent/60 card-shadow card-shadow-hover transition-all duration-300 flex flex-col h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-primary/10 rounded text-xs font-semibold text-primary">Design</span>
              <span className="text-lg font-bold text-primary">1,200 XLM</span>
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2 leading-tight">Redesign Wallet Extension UI/UX</h3>
            <p className="text-xs text-charcoal/60 mb-6 flex-grow line-clamp-3">Create a modern, intuitive user interface for a new browser-based Stellar wallet extension focused on DeFi interactions.</p>
            <div className="flex justify-between items-center pt-4 border-t border-accent/30 text-xs text-charcoal/50">
              <span className="flex items-center gap-1">1 week left</span>
              <span className="font-semibold text-primary">5 submissions</span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => navigate('/explore')}
            className="bg-white rounded-xl p-6 border border-accent/60 card-shadow card-shadow-hover transition-all duration-300 flex flex-col h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-primary/10 rounded text-xs font-semibold text-primary">Content</span>
              <span className="text-lg font-bold text-primary">500 XLM</span>
            </div>
            <h3 className="font-bold text-lg text-charcoal mb-2 leading-tight">Technical Documentation Translation (ES)</h3>
            <p className="text-xs text-charcoal/60 mb-6 flex-grow line-clamp-3">Translate the core protocol documentation into Spanish, ensuring high technical accuracy and proper terminology.</p>
            <div className="flex justify-between items-center pt-4 border-t border-accent/30 text-xs text-charcoal/50">
              <span className="flex items-center gap-1">2 days left</span>
              <span className="font-semibold text-primary">2 submissions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-accent/60 py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-2">
            <span className="font-script text-2xl text-primary font-bold">BountyBridge</span>
            <p className="text-xs text-charcoal/50">© 2026 BountyBridge. Built on Stellar + Soroban. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 md:justify-end text-xs font-semibold text-charcoal/60">
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Stellar</a>
            <a href="https://soroban.stellar.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Soroban Docs</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
