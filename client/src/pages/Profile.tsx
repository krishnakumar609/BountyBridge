import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { Edit2, Save, Calendar, Award, CheckCircle2, Star } from 'lucide-react';

export const Profile: React.FC = () => {
  const { wallet, user, updateUserProfile } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) return;

    setSaving(true);
    try {
      updateUserProfile({ username, bio, avatar });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error saving profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-40 px-6 text-center gap-4">
        <Award className="w-16 h-16 text-primary/45" />
        <h2 className="font-bold text-2xl text-charcoal">Connect Your Profile</h2>
        <p className="text-sm text-charcoal/60 max-w-sm">Connect your Stellar wallet to view credentials, reputation scores, and edit developer settings.</p>
      </div>
    );
  }

  // Define Achievements
  const achievements = [
    { title: 'First Lock', desc: 'Lock first bounty reward in smart contract', earned: (user?.totalBountiesCreated || 0) > 0 },
    { title: 'Code Solver', desc: 'Submit solutions in SubmissionRegistry', earned: (user?.totalSubmissions || 0) > 0 },
    { title: 'Ecosystem Legend', desc: 'Reach a Reputation Score of 90 or more', earned: (user?.reputationScore || 0) >= 90 },
    { title: 'Soroban Master', desc: 'Complete 5 or more bounties successfully', earned: (user?.totalRewardsEarned || 0) > 1000 },
  ];

  return (
    <div className="w-full h-full p-6 md:p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 overflow-y-auto">
      {/* LEFT PANEL: PROFILE SUMMARY */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
        <div className="bg-white border border-accent rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
          <img 
            src={user?.avatar} 
            alt={user?.username} 
            className="w-24 h-24 rounded-full border border-accent object-cover bg-[#FAF7F2]" 
          />

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-bold text-charcoal">{user?.username}</h2>
            <span className="text-xs font-mono text-charcoal/50 break-all max-w-[200px]">
              {wallet.address}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold">
            <Star className="w-3.5 h-3.5" /> Badge: {user?.badge || 'Contributor'}
          </div>

          <div className="w-full h-[1px] bg-accent/30 my-2"></div>

          <div className="w-full grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col">
              <span className="text-charcoal/50 font-bold uppercase text-[9px] tracking-wider">Created</span>
              <span className="text-sm font-semibold text-charcoal">{user?.totalBountiesCreated || 0} Bounties</span>
            </div>
            <div className="flex flex-col">
              <span className="text-charcoal/50 font-bold uppercase text-[9px] tracking-wider">Submissions</span>
              <span className="text-sm font-semibold text-charcoal">{user?.totalSubmissions || 0} Solutions</span>
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-1.5 text-xs text-charcoal/50 font-semibold mt-2">
            <Calendar className="w-4 h-4 text-charcoal/40" /> Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Reputation Score Progress */}
        <div className="bg-white border border-accent rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-charcoal">Reputation Score</span>
            <span className="text-primary">{user?.reputationScore || 50}/100</span>
          </div>
          <div className="w-full h-2 bg-accent/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${user?.reputationScore || 50}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-charcoal/60 leading-relaxed">
            Score climbs when completing bounties or creating verified contract deposits. Capped at 100 max.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: DETAILS & EDITING */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Edit Bio Form */}
        <div className="bg-white border border-accent rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-charcoal">Developer Credentials</h3>
            {!isEditing ? (
              <button 
                onClick={() => {
                  setUsername(user?.username || '');
                  setBio(user?.bio || '');
                  setAvatar(user?.avatar || '');
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : null}
          </div>

          {!isEditing ? (
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-wider">Biography</span>
                <p className="text-sm text-charcoal/80 leading-relaxed mt-1 whitespace-pre-wrap">
                  {user?.bio || 'No biography written yet. Click edit to describe your skillsets.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Avatar SVG Seed</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Biography</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-accent rounded-lg py-2 px-3 text-sm text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-accent/30 hover:bg-accent/40 text-charcoal font-semibold text-xs py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Achievements list */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-charcoal">Milestone Badges</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div 
                key={ach.title} 
                className={`p-4 border rounded-xl flex items-start gap-3.5 transition-all ${
                  ach.earned 
                    ? 'bg-white border-primary/40 shadow-sm' 
                    : 'bg-[#FAF7F2]/60 border-accent/40 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  ach.earned ? 'bg-primary/10 text-primary' : 'bg-charcoal/10 text-charcoal/40'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-charcoal flex items-center gap-1.5">
                    {ach.title}
                    {ach.earned && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </h4>
                  <p className="text-xs text-charcoal/60 leading-normal mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
