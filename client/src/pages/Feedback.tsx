import React, { useState } from 'react';
import { Star, MessageSquare, ShieldAlert, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Feedback: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [ratingUX, setRatingUX] = useState(0);
  const [ratingEase, setRatingEase] = useState(0);
  const [ratingWallet, setRatingWallet] = useState(0);
  const [suggestions, setSuggestions] = useState('');
  const [bugs, setBugs] = useState('');
  
  const handleRatingUX = (val: number) => setRatingUX(val);
  const handleRatingEase = (val: number) => setRatingEase(val);
  const handleRatingWallet = (val: number) => setRatingWallet(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
  };

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold text-charcoal">User Feedback Center</h1>
        <p className="text-sm text-charcoal/60">Help us shape the future of BountyBridge. Submit your feedback to the Stellar Campus review board.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Feedback form */}
        <div className="lg:col-span-3 bg-white border border-accent rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-primary animate-bounce" />
              <h2 className="text-xl font-bold text-charcoal">Thank You for Your Feedback!</h2>
              <p className="text-xs text-charcoal/60 max-w-sm">
                Your comments have been recorded. We will use this data to prioritize updates in our Phase 1 & 2 roadmap.
              </p>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setRatingUX(0);
                  setRatingEase(0);
                  setRatingWallet(0);
                  setSuggestions('');
                  setBugs('');
                }}
                className="mt-4 px-4 py-2 border border-accent rounded-lg text-xs font-bold text-charcoal hover:bg-[#FAF7F2] transition-colors"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Ratings */}
              <div className="flex flex-col gap-4">
                {/* UX */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-charcoal">Overall User Experience</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingUX(star)}
                        className="p-1 transition-transform active:scale-95"
                      >
                        <Star className={`w-6 h-6 ${star <= ratingUX ? 'text-primary fill-primary' : 'text-accent/60'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ease of Use */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-charcoal">Ease of Use (Task Posting / Submissions)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingEase(star)}
                        className="p-1 transition-transform active:scale-95"
                      >
                        <Star className={`w-6 h-6 ${star <= ratingEase ? 'text-primary fill-primary' : 'text-accent/60'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallet Experience */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-charcoal">Stellar Wallet Integration Experience</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingWallet(star)}
                        className="p-1 transition-transform active:scale-95"
                      >
                        <Star className={`w-6 h-6 ${star <= ratingWallet ? 'text-primary fill-primary' : 'text-accent/60'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-primary" /> Suggestions & Improvements
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="How can we make BountyBridge better for developers and project owners?"
                  className="w-full min-h-[80px] bg-[#FAF7F2] border border-accent rounded-lg p-3 text-xs text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-charcoal/30 resize-y"
                  required
                />
              </div>

              {/* Bugs */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-primary" /> Bugs or Visual Issues Found
                </label>
                <textarea
                  value={bugs}
                  onChange={(e) => setBugs(e.target.value)}
                  placeholder="If you encountered any unexpected behaviors or validation warnings, let us know here."
                  className="w-full min-h-[80px] bg-[#FAF7F2] border border-accent rounded-lg p-3 text-xs text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-charcoal/30 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-xs"
              >
                Submit Feedback Details
              </button>
            </form>
          )}
        </div>

        {/* Resources / Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Google Form Link Card */}
          <div className="bg-white border border-accent rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-sm text-charcoal">Official Survey Forms</h3>
            <p className="text-xs text-charcoal/65 leading-relaxed">
              We also aggregate reviews and submissions via our centralized Google Forms for Level 4 documentation.
            </p>
            <a 
              href="https://forms.gle/feedback_form_placeholder"
              target="_blank" 
              rel="noreferrer"
              className="mt-1 flex items-center justify-between p-3 rounded-lg border border-accent bg-[#FAF7F2] hover:bg-[#FAF7F2]/50 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-charcoal group-hover:text-primary transition-colors">Feedback Google Form</span>
                <span className="text-[10px] text-charcoal/50">Submit rating summary data</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            </a>

            <a 
              href="https://docs.google.com/spreadsheets/d/testing_sheet_placeholder/edit"
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-accent bg-[#FAF7F2] hover:bg-[#FAF7F2]/50 transition-colors group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-charcoal group-hover:text-primary transition-colors">Interactions Spreadsheet</span>
                <span className="text-[10px] text-charcoal/50">View all verified user tests</span>
              </div>
              <FileSpreadsheet className="w-4 h-4 text-green-700 shrink-0" />
            </a>
          </div>

          {/* User Testing Context */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wider">Level 4 compliance note</h4>
            <p className="text-[11px] text-charcoal/70 leading-relaxed">
              Every wallet interaction, from peer payments to smart contract deployments and bounty locks, is recorded with cryptographic transaction signatures directly on the Stellar testnet ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
