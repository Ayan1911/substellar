import React from 'react';
import { Shield, Clock, BarChart3, Lock, Code2, Users } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Clock,
      title: 'Time-Bound Pull Payments',
      description: 'Programmatic execution intervals enforced directly by Soroban smart contract logic on the Stellar network.',
    },
    {
      icon: Shield,
      title: 'Non-Custodial Escrows',
      description: 'Funds move directly from subscriber wallets to merchant accounts without intermediary escrow risks.',
    },
    {
      icon: BarChart3,
      title: 'Off-Chain & On-Chain Analytics',
      description: 'Real-time telemetry tracked via Supabase while maintaining immutable cryptographic proofs on Testnet.',
    },
    {
      icon: Lock,
      title: 'Soroban Auth Guard',
      description: 'Every subscription initialization requires explicit cryptographic signature authorization via Freighter.',
    },
    {
      icon: Code2,
      title: 'Automated Relayer Cron',
      description: 'Serverless relayer service continuously monitors due subscriptions and triggers automated pull transactions.',
    },
    {
      icon: Users,
      title: 'Merchant SaaS Studio',
      description: 'Create custom tier plans with dynamic pricing, billing periods, and instant subscriber telemetry.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="font-bebas text-5xl sm:text-6xl tracking-wide text-white">
          ENGINEERED FOR <span className="text-[#FF5733]">PRODUCTION</span> WEB3 SAAS
        </h2>
        <p className="text-gray-400 text-sm font-light tracking-wide max-w-xl mx-auto">
          Built specifically to satisfy Stellar Level 4 Green Belt criteria with robust smart contracts and high-contrast Voxel UX.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-xl border border-white/10 hover:border-[#FF5733]/50 transition-all duration-300 space-y-4 group bg-white/[0.02]"
            >
              <div className="w-12 h-12 rounded-lg bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center text-[#FF5733] group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} />
              </div>
              <h3 className="font-bebas text-2xl text-white tracking-wide">{feat.title}</h3>
              <p className="text-gray-400 text-xs font-light leading-relaxed">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
