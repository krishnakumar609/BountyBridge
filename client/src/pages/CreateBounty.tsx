import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { stellarService } from '../services/stellar.js';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';

export const CreateBounty: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, setTxLoading, createBounty } = useStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    tags: '',
    rewardAmount: '',
    tokenType: 'XLM',
    deadline: '',
    requirements: '',
    skillsRequired: '',
  });

  const categories = ['Development', 'Design', 'Content', 'Marketing', 'Security'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      // 1. Loading Overlay: Invoke Smart Contract
      setTxLoading(
        true, 
        'Deploying Escrow Smart Contract', 
        'Invoking Soroban contract: create_bounty... Please confirm in wallet.'
      );

      // Generate simulated contract bounty ID
      const contractBountyId = Math.floor(Math.random() * 90000) + 10000;

      const txResult = await stellarService.submitContractTx(
        wallet.walletType!, 
        'create_bounty', 
        {
          creator: wallet.address,
          rewardAmount: formData.rewardAmount,
          deadline: new Date(formData.deadline).getTime() / 1000,
        }
      );

      if (!txResult.success) {
        throw new Error('Transaction submission failed.');
      }

      // 2. Loading Overlay: Lock Reward Escrow Funds
      setTxLoading(
        true, 
        'Locking Escrow Funds', 
        'Transferring reward to escrow contract and locking funds...',
        txResult.txHash
      );

      const lockResult = await stellarService.submitContractTx(
        wallet.walletType!, 
        'lock_reward', 
        {
          bountyId: contractBountyId,
        }
      );

      if (!lockResult.success) {
        throw new Error('Locking funds transaction failed.');
      }

      // 3. Post Metadata to Decentralized Store
      setTxLoading(
        true, 
        'Saving Bounty Metadata', 
        'Registering bounty details on-chain...'
      );

      await createBounty({
        contractBountyId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        rewardAmount: parseFloat(formData.rewardAmount),
        tokenType: formData.tokenType,
        deadline: new Date(formData.deadline),
        requirements: formData.requirements,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
        skillsRequired: formData.skillsRequired.split(',').map((s) => s.trim()).filter((s) => s),
      });

      // Update state
      setTxLoading(false);
      navigate(`/bounty/${contractBountyId}`);

    } catch (error) {
      console.error(error);
      setTxLoading(false);
      alert((error as Error).message || 'Failed to deploy bounty.');
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-charcoal">Create New Bounty</h1>
        <p className="text-sm text-charcoal/60">Initialize a Soroban escrow contract and define submission requirements.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between items-center bg-white border border-accent rounded-xl p-4 shadow-sm">
        {[
          { num: 1, name: 'Bounty Details' },
          { num: 2, name: 'Locked Reward' },
          { num: 3, name: 'Requirements' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s.num ? 'bg-primary text-background' : 'bg-accent/30 text-charcoal/40'
            }`}>
              {step > s.num ? <Check className="w-4.5 h-4.5" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${
              step >= s.num ? 'text-charcoal' : 'text-charcoal/40'
            }`}>{s.name}</span>
            {s.num < 3 && <ChevronRight className="w-4 h-4 text-charcoal/20 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-accent rounded-xl shadow-card overflow-hidden">
        <div className="p-6">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Bounty Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Implement Stellar Anchor integration"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Provide a detailed description of the task. Explain exactly what needs to be built."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="rust, soroban, anchor"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Reward */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Reward Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rewardAmount"
                      required
                      min="1"
                      placeholder="500"
                      value={formData.rewardAmount}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 pl-3 pr-12 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal/40">XLM</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3 mt-4">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-charcoal/80 leading-relaxed">
                  <span className="font-bold text-primary">On-chain Escrow Lock:</span> Your reward tokens will be transferred from your connected wallet directly to the newly deployed Escrow Contract. Contributors are guaranteed payout when they complete the requirements.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Requirements */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Bounty Requirements</label>
                <textarea
                  name="requirements"
                  required
                  rows={5}
                  placeholder="List out specific technical requirements (e.g. 90% test coverage, must run on testnet, GitHub PR linked)."
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Skills Required (Comma Separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  placeholder="React, Rust, Smart Contracts"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons Bar */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-accent/40 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-1 text-xs font-bold text-charcoal/60 hover:text-charcoal disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 btn-primary text-xs py-2 px-4"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary text-xs py-2 px-5"
            >
              Deploy & Lock Escrow
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
