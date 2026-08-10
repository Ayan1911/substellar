import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Cpu, RefreshCw, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onExplorePlans: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onExplorePlans }) => {
  return (
    <section className="relative pt-36 pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5733]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Hero Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-8 text-left"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300 font-medium tracking-wide">
            <Sparkles className="w-4 h-4 text-[#FF5733]" />
            <span>Soroban Smart Contract Powered Gateway</span>
          </div>

          <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-normal text-white leading-[0.9]">
            PROGRAMMABLE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5733] via-orange-400 to-[#E04C2C]">
              RECURRING PAYMENTS
            </span> <br />
            FOR WEB3 SAAS
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-xl font-light leading-relaxed">
            Non-custodial, time-bound USDC subscriptions on Stellar. Enable automated billing pulls, seamless plan management, and verifiable on-chain merchant analytics.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.15em] px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-xl shadow-[#FF5733]/25 uppercase border border-[#FF5733]"
            >
              Launch Merchant Studio <ArrowRight size={16} />
            </button>
            <button
              onClick={onExplorePlans}
              className="border border-white/30 hover:border-white hover:bg-white/5 text-white text-[11px] font-bold tracking-[0.15em] px-8 py-4 rounded-lg transition-all duration-300 uppercase"
            >
              Explore Subscriber Portal
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-md">
            <div>
              <div className="font-bebas text-3xl text-white">0%</div>
              <div className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">Custody Risk</div>
            </div>
            <div>
              <div className="font-bebas text-3xl text-[#FF5733]">3.5s</div>
              <div className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">Stellar Settlement</div>
            </div>
            <div>
              <div className="font-bebas text-3xl text-white">USDC</div>
              <div className="text-[10px] text-gray-400 tracking-[0.1em] uppercase">Stable Standard</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Voxel Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden space-y-6 bg-white/[0.03]">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF5733]/20 flex items-center justify-center border border-[#FF5733]/30">
                  <Cpu className="text-[#FF5733] w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bebas text-xl text-white tracking-wide">Enterprise Tier Plan</h3>
                  <span className="text-[10px] text-gray-400 tracking-[0.15em] uppercase">Recurring Contract #309</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold tracking-widest uppercase rounded">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-400 text-xs tracking-wider uppercase">Interval Price</span>
                <div className="text-right">
                  <span className="font-bebas text-4xl text-white">99.00 <span className="text-[#FF5733]">USDC</span></span>
                  <p className="text-[10px] text-gray-400 tracking-wider">Billed Every 30 Days</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#FF5733]" /> Soroban Auth Verification
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">Passed</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="text-[#FF5733]" /> Automated Relayer Pull
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">Enabled</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={onExplorePlans}
                className="w-full bg-white/5 hover:bg-[#FF5733] hover:text-white border border-white/10 text-gray-200 text-[10px] font-bold tracking-[0.15em] py-3.5 rounded-lg transition-all duration-300 uppercase"
              >
                Simulate Subscription Transaction
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
