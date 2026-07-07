import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export const WalletModal: React.FC = () => {
  const { isWalletModalOpen, setWalletModalOpen, connectWallet } = useStore();
  const [customAddress, setCustomAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isWalletModalOpen) return null;

  const handleConnect = async (type: 'freighter' | 'albedo' | 'xbull' | 'simulator') => {
    setErrorMsg('');
    setIsConnecting(true);
    try {
      if (type === 'simulator' && customAddress && !customAddress.startsWith('GB')) {
        setErrorMsg('Simulator addresses should start with GB (Stellar Public Key format).');
        setIsConnecting(false);
        return;
      }
      await connectWallet(type, type === 'simulator' ? customAddress : undefined);
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message || 'Failed to connect wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md bg-background border border-accent rounded-xl shadow-card overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-accent/40 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="script-logo text-2xl text-primary font-bold">BountyBridge</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Connect Wallet</span>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-surface-variant transition-colors"
            onClick={() => setWalletModalOpen(false)}
          >
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Freighter */}
            <button
              onClick={() => handleConnect('freighter')}
              disabled={isConnecting}
              className="flex items-center justify-between p-4 bg-white border border-accent hover:border-primary hover:shadow-sm rounded-lg transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#E4EEFF] flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-[#0D62FF]">F</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Freighter Wallet</h3>
                  <p className="text-xs text-charcoal/60">Official Stellar browser extension</p>
                </div>
              </div>
              <span className="text-xs bg-[#E4EEFF] text-[#0D62FF] px-2.5 py-1 rounded-full font-medium">Extension</span>
            </button>

            {/* Albedo */}
            <button
              onClick={() => handleConnect('albedo')}
              disabled={isConnecting}
              className="flex items-center justify-between p-4 bg-white border border-accent hover:border-primary hover:shadow-sm rounded-lg transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#FFF5E4] flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-[#FF9F0D]">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Albedo</h3>
                  <p className="text-xs text-charcoal/60">Secure Stellar web wallet</p>
                </div>
              </div>
              <span className="text-xs bg-[#FFF5E4] text-[#FF9F0D] px-2.5 py-1 rounded-full font-medium">Web</span>
            </button>

            {/* xBull */}
            <button
              onClick={() => handleConnect('xbull')}
              disabled={isConnecting}
              className="flex items-center justify-between p-4 bg-white border border-accent hover:border-primary hover:shadow-sm rounded-lg transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#FFE4F4] flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-[#FF0D8E]">X</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">xBull Wallet</h3>
                  <p className="text-xs text-charcoal/60">Flexible Stellar ecosystem account</p>
                </div>
              </div>
              <span className="text-xs bg-[#FFE4F4] text-[#FF0D8E] px-2.5 py-1 rounded-full font-medium">Multi-chain</span>
            </button>

            <div className="relative my-2 text-center">
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-accent/40"></span>
              <span className="relative px-3 bg-background text-xs text-charcoal/50 uppercase tracking-wider">Or Dev Sandbox</span>
            </div>

            {/* Simulator Mode */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">Simulator Sandbox</h3>
                  <p className="text-xs text-charcoal/70">Test all creation, voting, and payouts immediately without real testnet tokens.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Optional GB... simulator address"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="flex-1 bg-white border border-accent rounded px-3 py-1.5 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => handleConnect('simulator')}
                  disabled={isConnecting}
                  className="bg-primary hover:bg-primary-dark text-background text-xs px-4 py-1.5 rounded font-semibold transition-colors disabled:opacity-50"
                >
                  Launch Sandbox
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
