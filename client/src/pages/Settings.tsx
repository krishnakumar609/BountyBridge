import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { ShieldCheck, Globe, Eye } from 'lucide-react';

export const Settings: React.FC = () => {
  const { wallet } = useStore();
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [networkType, setNetworkType] = useState(wallet.network || 'Testnet (Simulator)');

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-charcoal">Settings</h1>
        <p className="text-sm text-charcoal/60">Configure your connection endpoints, notification centers, and developer sandboxes.</p>
      </div>

      <div className="bg-white border border-accent rounded-xl shadow-sm divide-y divide-accent/30 overflow-hidden">
        {/* Network configuration */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Globe className="w-4.5 h-4.5 text-primary" /> Consensus Network
          </h3>
          <p className="text-xs text-charcoal/65 leading-relaxed">
            Select the active Stellar ledger endpoint. Escrows will be verified against this horizon cluster.
          </p>
          <div className="flex bg-[#FAF7F2] p-1 rounded-lg border border-accent/40 mt-1 self-start">
            {['Stellar Testnet', 'Testnet (Simulator)', 'Mainnet'].map((net) => (
              <button
                key={net}
                onClick={() => setNetworkType(net)}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all ${
                  networkType.toLowerCase().includes(net.toLowerCase().split(' ')[0])
                    ? 'bg-primary text-background shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications toggles */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <Eye className="w-4.5 h-4.5 text-primary" /> Desktop Notifications
            </h3>
            <p className="text-xs text-charcoal/65 leading-normal">
              Receive alert triggers when new contributors register solutions.
            </p>
          </div>
          <button
            onClick={() => setAllowNotifications(!allowNotifications)}
            className={`w-11 h-6 rounded-full transition-all relative flex items-center p-0.5 ${
              allowNotifications ? 'bg-primary' : 'bg-charcoal/20'
            }`}
          >
            <span className={`w-5 h-5 bg-background rounded-full shadow-sm transition-all transform ${
              allowNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}></span>
          </button>
        </div>

        {/* Safety checklist */}
        <div className="p-5 flex flex-col gap-3 bg-primary/5">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5" /> Security Checklist
          </h3>
          <ul className="text-xs text-charcoal/70 list-disc list-inside space-y-1.5 leading-normal">
            <li>Escrow keys are held entirely within the decentralised Soroban smart contract account.</li>
            <li>No private keys are transmitted or recorded on the backend node server database.</li>
            <li>Horizon queries strictly route via authenticated public ledger hashes.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
