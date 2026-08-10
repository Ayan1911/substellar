import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { MerchantDashboard } from './components/MerchantDashboard';
import { SubscriberPortal } from './components/SubscriberPortal';
import { WalletModal } from './components/WalletModal';
import { useWallet } from './hooks/useWallet';

export default function App() {
  const { address, isConnecting, connect, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState<'landing' | 'merchant' | 'subscriber'>('landing');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-inter selection:bg-[#FF5733] selection:text-white flex flex-col justify-between">
      <Toaster theme="dark" position="bottom-right" />

      {/* Global Header */}
      <Header
        address={address}
        isConnecting={isConnecting}
        onConnectClick={() => setIsWalletModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {activeTab === 'landing' && (
          <>
            <Hero
              onGetStarted={() => setActiveTab('merchant')}
              onExplorePlans={() => setActiveTab('subscriber')}
            />
            <Features />
          </>
        )}

        {activeTab === 'merchant' && (
          <MerchantDashboard
            address={address}
            onOpenConnect={() => setIsWalletModalOpen(true)}
          />
        )}

        {activeTab === 'subscriber' && (
          <SubscriberPortal
            address={address}
            onOpenConnect={() => setIsWalletModalOpen(true)}
          />
        )}
      </main>

      {/* Voxel Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-light">
          <div className="flex items-center gap-2">
            <span className="font-bebas text-xl text-white tracking-wider">SUBSTELLAR</span>
            <span>— Stellar Level 4 Green Belt Web3 SaaS Gateway</span>
          </div>
          <div>
            Powered by Soroban Smart Contracts & Supabase Telemetry
          </div>
        </div>
      </footer>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        address={address}
        isConnecting={isConnecting}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </div>
  );
}
