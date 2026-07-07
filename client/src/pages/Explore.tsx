import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Calendar, Users, Coins } from 'lucide-react';
import { useStore } from '../store/useStore.js';
import type { IBounty } from '../types/index.js';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { bounties: storeBounties } = useStore();
  const [bounties, setBounties] = useState<IBounty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Locked'); // Default to Locked (Funded/Active)
  const [sort, setSort] = useState('newest');

  const categories = ['Development', 'Design', 'Content', 'Marketing', 'Security'];
  const statuses = [
    { label: 'Active', value: 'Locked' },
    { label: 'Draft / Unfunded', value: 'Created' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const fetchBounties = () => {
    setLoading(true);
    try {
      let filtered = [...storeBounties];
      
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(b => 
          b.title.toLowerCase().includes(query) || 
          b.description.toLowerCase().includes(query) ||
          b.tags.some((t: string) => t.toLowerCase().includes(query))
        );
      }
      if (category) {
        filtered = filtered.filter(b => b.category === category);
      }
      if (status) {
        filtered = filtered.filter(b => b.status === status);
      }
      
      // Sort
      if (sort === 'newest') {
        filtered.sort((a, b) => b.contractBountyId - a.contractBountyId);
      } else if (sort === 'highest_reward') {
        filtered.sort((a, b) => b.rewardAmount - a.rewardAmount);
      } else if (sort === 'ending_soon') {
        filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      } else if (sort === 'most_active') {
        filtered.sort((a, b) => (b.submissionCount || 0) - (a.submissionCount || 0));
      }
      
      setBounties(filtered);
    } catch (err) {
      console.error('Error filtering bounties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBounties();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, status, sort, storeBounties]);

  return (
    <div className="flex flex-col w-full h-full p-6 md:p-8 gap-6 max-w-6xl mx-auto overflow-y-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-charcoal">Explore Bounties</h1>
        <p className="text-sm text-charcoal/60">Find open tasks, submit your work, and earn verified rewards on the Stellar blockchain.</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-surface-container-low border border-accent rounded-xl p-4 shadow-sm">
        {/* Search */}
        <div className="flex-1 relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-accent rounded-lg py-2 pl-9 pr-4 text-xs text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filter categories dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-accent rounded-lg py-2 px-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-primary"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex bg-accent/20 p-1 rounded-lg border border-accent/40">
            {statuses.map((stat) => (
              <button
                key={stat.value}
                onClick={() => setStatus(stat.value)}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all ${
                  status === stat.value
                    ? 'bg-primary text-background shadow-sm'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-accent rounded-lg py-2 px-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="highest_reward">Highest Reward</option>
            <option value="ending_soon">Ending Soon</option>
            <option value="most_active">Most Active</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-xs text-charcoal/60 font-semibold">Loading bounties...</span>
        </div>
      ) : bounties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-accent rounded-2xl bg-white p-8">
          <SlidersHorizontal className="w-12 h-12 text-charcoal/30 mb-4" />
          <h3 className="font-bold text-lg text-charcoal">No Bounties Found</h3>
          <p className="text-xs text-charcoal/50 max-w-sm mt-1">Try adjusting your filters or query criteria to see more opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty) => {
            const daysLeft = Math.ceil(
              (new Date(bounty.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)
            );
            return (
              <div
                key={bounty.contractBountyId}
                onClick={() => navigate(`/bounty/${bounty.contractBountyId}`)}
                className="bg-white rounded-xl border border-accent/60 overflow-hidden shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Reward Banner */}
                <div className="p-5 flex justify-between items-start border-b border-accent/30 bg-surface-container-low">
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    {bounty.category}
                  </span>
                  <div className="flex items-center gap-1 text-primary">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold text-lg">{bounty.rewardAmount.toLocaleString()} {bounty.tokenType}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h3 className="font-bold text-base text-charcoal hover:text-primary transition-colors leading-snug line-clamp-2">
                    {bounty.title}
                  </h3>
                  <p className="text-xs text-charcoal/65 leading-relaxed line-clamp-3">
                    {bounty.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {bounty.tags.slice(0, 3).map((t: string, idx: number) => (
                      <span key={idx} className="bg-accent/20 px-2 py-0.5 rounded text-[10px] text-charcoal/70">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer stats */}
                <div className="px-5 py-4 border-t border-accent/30 bg-[#FAF7F2] flex justify-between items-center text-xs text-charcoal/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Users className="w-3.5 h-3.5" />
                    {bounty.submissionCount || 0} Submissions
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
