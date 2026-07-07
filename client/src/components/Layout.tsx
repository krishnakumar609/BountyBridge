import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { WalletModal } from './WalletModal.js';
import { TransactionOverlay } from './TransactionOverlay.js';
import { 
  LayoutDashboard, 
  Search, 
  ListTodo, 
  Send, 
  Coins, 
  User, 
  Settings, 
  Bell, 
  Plus, 
  LogOut, 
  Wallet,
  Menu,
  X,
  Check,
  Trash2,
  HeartHandshake
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    wallet, 
    user, 
    setWalletModalOpen, 
    disconnectWallet, 
    notifications,
    markNotificationRead,
    deleteNotification
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Explore', icon: Search, path: '/explore' },
    { label: 'My Bounties', icon: ListTodo, path: '/my-bounties' },
    { label: 'Submissions', icon: Send, path: '/submissions' },
    { label: 'Rewards', icon: Coins, path: '/rewards' },
  ];

  const bottomNavItems = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Feedback', icon: HeartHandshake, path: '/feedback' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-accent/20">
      <WalletModal />
      <TransactionOverlay />

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col h-full w-64 border-r border-accent bg-surface-container-low flex-shrink-0 z-20 shadow-sm relative">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1 cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-script text-3xl text-primary font-bold">BountyBridge</span>
          </div>
          <p className="text-[10px] text-charcoal/50 uppercase tracking-widest font-semibold ml-1">Stellar Network</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-secondary-container text-primary shadow-[0_2px_4px_rgba(119,136,115,0.1)]' 
                    : 'text-charcoal/70 hover:bg-surface-variant/40 hover:text-charcoal'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-charcoal/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom items */}
        <div className="p-3 border-t border-accent/40 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-secondary-container text-primary' 
                    : 'text-charcoal/70 hover:bg-surface-variant/40 hover:text-charcoal'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-charcoal/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {wallet.connected && (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors mt-2"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span>Disconnect</span>
            </button>
          )}
        </div>

        {/* Create Bounty Footer Button */}
        <div className="p-4 border-t border-accent/40 bg-surface-container-low">
          <button 
            onClick={() => navigate('/create')}
            className="w-full btn-primary text-sm py-3"
          >
            <Plus className="w-4 h-4" />
            Create Bounty
          </button>

          {/* User Account Info */}
          {wallet.connected && user && (
            <div className="mt-4 flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-9 h-9 rounded-full object-cover border border-accent bg-white" 
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-charcoal truncate">{user.username}</p>
                <p className="text-[9px] font-mono text-charcoal/50 truncate">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CANVAS --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-6 py-4 bg-background/80 backdrop-blur-md border-b border-accent shadow-sm">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 rounded-full hover:bg-surface-variant/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-charcoal" />
            </button>
            <span className="font-script text-2xl text-primary font-bold cursor-pointer" onClick={() => navigate('/')}>
              BountyBridge
            </span>
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden md:block w-full max-w-md relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
            <input 
              type="text" 
              placeholder="Search bounties, skills, or projects..." 
              className="w-full bg-[#F5EEE4] border border-accent rounded-full py-2 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-charcoal placeholder:text-charcoal/40"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification Center */}
            {wallet.connected && (
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-charcoal/70 hover:text-primary hover:bg-surface-variant/40 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-background"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-background border border-accent rounded-xl shadow-card z-50 overflow-hidden flex flex-col max-h-[400px]">
                    <div className="px-4 py-3 bg-surface-container-low border-b border-accent/40 flex justify-between items-center">
                      <span className="font-semibold text-sm text-charcoal">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-accent/30">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-charcoal/50">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((note) => (
                          <div 
                            key={note.id} 
                            className={`p-3 text-xs flex flex-col gap-1.5 transition-colors ${
                              note.read ? 'bg-transparent' : 'bg-primary/5 font-medium'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-charcoal leading-relaxed">{note.message}</p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {!note.read && (
                                  <button 
                                    onClick={() => markNotificationRead(note.id)}
                                    className="p-1 hover:bg-primary/10 text-primary rounded"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteNotification(note.id)}
                                  className="p-1 hover:bg-red-50 text-red-500 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <span className="text-[9px] text-charcoal/40">
                              {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Wallet Info Badge & Trigger */}
            {wallet.connected ? (
              <div className="flex items-center gap-2 bg-[#F5EEE4] border border-accent rounded-full py-1.5 px-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-background text-[9px] font-bold">
                  {wallet.walletType === 'simulator' ? 'SIM' : 'WT'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-charcoal">
                    {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                  </span>
                  <span className="text-[9px] text-primary font-bold">
                    {wallet.xlmBalance} XLM
                  </span>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setWalletModalOpen(true)}
                className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
              >
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* --- MOBILE DRAWER MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-charcoal/40 backdrop-blur-sm">
          <div className="w-64 bg-background h-full flex flex-col p-6 shadow-card border-r border-accent">
            <div className="flex justify-between items-center mb-8">
              <span className="font-script text-3xl text-primary font-bold">BountyBridge</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-surface-variant transition-colors"
              >
                <X className="w-5 h-5 text-charcoal" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-secondary-container text-primary' 
                        : 'text-charcoal/70 hover:bg-surface-variant/40 hover:text-charcoal'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="h-[1px] bg-accent/40 my-4"></div>
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-secondary-container text-primary' 
                        : 'text-charcoal/70 hover:bg-surface-variant/40 hover:text-charcoal'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4">
              <button 
                onClick={() => handleNavClick('/create')}
                className="w-full btn-primary py-3 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Bounty
              </button>

              {wallet.connected && (
                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2.5 rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
