import React from 'react';
import { X, ShieldCheck, ExternalLink, Loader2, Wallet } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  address,
  isConnecting,
  onConnect,
  onDisconnect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative space-y-6 bg-[#050505]/95 overflow-hidden">
        
        {/* Ambient background blur */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF5733]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center text-[#FF5733]">
              <Wallet size={20} />
            </div>
            <div>
              <h3 className="font-bebas text-2xl text-white tracking-wide">Web3 Wallet Connection</h3>
              <p className="text-gray-400 text-xs tracking-wider uppercase">Stellar Testnet Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {address ? (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="text-xs text-gray-400 uppercase tracking-widest">Connected PublicKey</span>
              <div className="font-mono text-sm text-emerald-400 break-all bg-black/40 p-2.5 rounded border border-white/5">
                {address}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck size={14} /> Logged to Supabase
                </span>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF5733] hover:underline flex items-center gap-1"
                >
                  StellarExpert <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold tracking-[0.15em] py-3.5 rounded-lg transition-all duration-300 uppercase"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-[#FF5733]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                  FR
                </div>
                <div>
                  <h4 className="font-bebas text-xl text-white tracking-wide">Freighter Extension</h4>
                  <p className="text-xs text-gray-400">Official Stellar Soroban Wallet</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  await onConnect();
                  onClose();
                }}
                disabled={isConnecting}
                className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[10px] font-bold tracking-[0.1em] px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2 uppercase disabled:opacity-50"
              >
                {isConnecting ? <Loader2 size={14} className="animate-spin" /> : 'Connect'}
              </button>
            </div>

            <p className="text-[11px] text-gray-400 text-center font-light leading-relaxed pt-2">
              By connecting your wallet, a proof-of-interaction entry is automatically recorded to our Supabase telemetry database for audit compliance.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
