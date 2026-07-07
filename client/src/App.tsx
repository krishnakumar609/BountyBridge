import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import { Layout } from './components/Layout.js';

// Pages
import { Landing } from './pages/Landing.js';
import { Explore } from './pages/Explore.js';
import { CreateBounty } from './pages/CreateBounty.js';
import { BountyDetails } from './pages/BountyDetails.js';
import { Dashboard } from './pages/Dashboard.js';
import { Profile } from './pages/Profile.js';
import { MyBounties } from './pages/MyBounties.js';
import { Submissions } from './pages/Submissions.js';
import { Rewards } from './pages/Rewards.js';
import { Settings } from './pages/Settings.js';
import { Feedback } from './pages/Feedback.js';

import './App.css';

function App() {
  const { wallet, connectWallet } = useStore();

  // Try auto-reconnecting on load if wallet credentials exist in sessionStorage
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('walletAddress');
    const savedType = sessionStorage.getItem('walletType');
    
    if (savedAddress && savedType && !wallet.connected) {
      console.log(`⚡ Auto-reconnecting wallet: [${savedType}] - ${savedAddress}`);
      connectWallet(savedType as any, savedAddress).catch((err) => {
        console.error('Failed to auto-reconnect wallet:', err);
        sessionStorage.removeItem('walletAddress');
        sessionStorage.removeItem('walletType');
      });
    }
  }, [wallet.connected]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/bounty/:id" element={<BountyDetails />} />
          
          {/* Protected/Wallet-reliant Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateBounty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bounties" element={<MyBounties />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
