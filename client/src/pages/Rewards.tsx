import React from 'react';
import { useStore } from '../store/useStore.js';
import { Coins, ExternalLink, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const Rewards: React.FC = () => {
  const { wallet, transactions: storeTransactions } = useStore();
  const txs = storeTransactions.filter(tx => tx.walletAddress.toLowerCase() === wallet.address.toLowerCase());
  const loading = false;

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 text-center gap-4">
        <Coins className="w-16 h-16 text-primary/45" />
        <h2 className="font-bold text-2xl text-charcoal">Rewards Log</h2>
        <p className="text-sm text-charcoal/60 max-w-sm">Connect your wallet to audit your historical payments and rewards disbursed on the Stellar blockchain.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-charcoal">Rewards & Transactions</h1>
        <p className="text-sm text-charcoal/60 font-medium">Detailed audit trail of all actions, deposits, and releases executed by your wallet.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-charcoal/50">Loading transactions...</div>
      ) : txs.length === 0 ? (
        <div className="text-center py-20 bg-white border border-accent rounded-xl p-8 flex flex-col items-center gap-3">
          <Coins className="w-12 h-12 text-charcoal/30" />
          <h3 className="font-bold text-base text-charcoal">No Transactions Logged</h3>
          <p className="text-xs text-charcoal/50 max-w-sm">No recorded escrow deployments or winner selections are listed for this wallet.</p>
        </div>
      ) : (
        <div className="bg-white border border-accent rounded-xl overflow-hidden divide-y divide-accent/30 shadow-sm">
          {txs.map((tx) => {
            const isOutgoing = tx.type === 'Create Bounty' || tx.type === 'Lock Reward' || tx.type === 'Select Winner';
            return (
              <div key={tx.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isOutgoing ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {isOutgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal">{tx.type}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-charcoal/40 font-mono">
                      <span>Tx: {tx.txHash.slice(0, 12)}...</span>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary"
                      >
                        <ExternalLink className="w-2.5 h-2.5 inline" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  {tx.amount ? (
                    <span className={`text-xs font-bold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
                      {isOutgoing ? '-' : '+'}{tx.amount} XLM
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-charcoal/50">Action Logged</span>
                  )}
                  <span className="text-[9px] text-charcoal/40 mt-0.5">
                    {new Date(tx.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
