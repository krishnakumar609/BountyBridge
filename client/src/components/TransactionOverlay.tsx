import React from 'react';
import { useStore } from '../store/useStore.js';
import { Loader2, ExternalLink } from 'lucide-react';

export const TransactionOverlay: React.FC = () => {
  const { txLoadingState, setTxLoading } = useStore();

  if (!txLoadingState.loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-background border border-accent rounded-xl shadow-card p-6 flex flex-col items-center text-center gap-4">
        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-lg text-charcoal">{txLoadingState.title || 'Processing Transaction'}</h3>
          <p className="text-sm text-charcoal/70">{txLoadingState.message || 'Please confirm the request in your wallet.'}</p>
        </div>

        {/* Tx Hash Link if present */}
        {txLoadingState.txHash && (
          <div className="flex flex-col items-center gap-2 mt-2 w-full">
            <span className="text-[10px] uppercase font-semibold text-charcoal/50">Transaction Hash</span>
            <div className="bg-surface-container-low border border-accent rounded p-2 text-xs font-mono text-charcoal break-all max-w-full">
              {txLoadingState.txHash}
            </div>
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${txLoadingState.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold mt-1"
            >
              View on Stellar Expert <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Close/Dismiss Button (only if transaction is completed or has hash) */}
        {txLoadingState.txHash && (
          <button
            onClick={() => setTxLoading(false)}
            className="w-full mt-2 bg-primary text-background font-semibold py-2 rounded-lg hover:bg-primary-dark transition-all text-sm"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
