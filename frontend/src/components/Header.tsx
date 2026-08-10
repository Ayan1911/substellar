import React from 'react';
import { Wallet, Zap } from 'lucide-react';

interface HeaderProps {
  address: string | null;
  isConnecting: boolean;
  onConnectClick: () => void;
  activeTab: 'landing' | 'merchant' | 'subscriber';
  setActiveTab: (tab: 'landing' | 'merchant' | 'subscriber') => void;
}

export const Header: React.FC<HeaderProps> = ({
  address,
  isConnecting,
  onConnectClick,
  activeTab,
  setActiveTab,
}) => {
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 px-4 sm:px-8 py-4 backdrop-blur-xl bg-[#050505]/80">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#FF5733]/10 rounded-xl flex items-center justify-center border border-[#FF5733]/30 group-hover:border-[#FF5733] transition-colors duration-300">
              <Zap className="text-[#FF5733] w-5 h-5" />
            </div>
            <span className="font-bebas text-3xl tracking-wider text-white">SUBSTELLAR</span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                activeTab === 'landing' ? 'bg-[#FF5733] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('merchant')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                activeTab === 'merchant' ? 'bg-[#FF5733] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Merchant Studio
            </button>
            <button
              onClick={() => setActiveTab('subscriber')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${
                activeTab === 'subscriber' ? 'bg-[#FF5733] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Subscriber Portal
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Stellar Testnet
          </div>

          <button
            onClick={onConnectClick}
            disabled={isConnecting}
            className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.1em] px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 border border-[#FF5733]/50 shadow-lg shadow-[#FF5733]/20 uppercase disabled:opacity-50"
          >
            <Wallet size={15} />
            {isConnecting ? 'Connecting...' : address ? formatAddress(address) : 'Connect Wallet'}
          </button>
        </div>

      </div>
    </header>
  );
};
