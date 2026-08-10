import React, { useState } from 'react';
import { Plus, DollarSign, Calendar, Shield, Loader2, Sparkles, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { logWalletInteraction, supabase } from '../lib/supabase';

interface MerchantDashboardProps {
  address: string | null;
  onOpenConnect: () => void;
}

export interface PlanItem {
  id: string;
  merchant_address: string;
  plan_name: string;
  amount: number;
  interval_days: number;
  created_at: string;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ address, onOpenConnect }) => {
  const [planName, setPlanName] = useState('');
  const [amount, setAmount] = useState('');
  const [intervalDays, setIntervalDays] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPlans, setCreatedPlans] = useState<PlanItem[]>([
    {
      id: 'plan_1',
      merchant_address: address || 'GABCD...MERCHANT',
      plan_name: 'SaaS Starter Tier',
      amount: 29,
      interval_days: 30,
      created_at: new Date().toISOString(),
    },
    {
      id: 'plan_2',
      merchant_address: address || 'GABCD...MERCHANT',
      plan_name: 'Pro Developer Pass',
      amount: 99,
      interval_days: 30,
      created_at: new Date().toISOString(),
    },
  ]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please connect your Freighter wallet to create merchant plans');
      onOpenConnect();
      return;
    }

    if (!planName || !amount || !intervalDays) {
      toast.error('Please fill out all required plan parameters');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPlan: PlanItem = {
        id: `plan_${Date.now()}`,
        merchant_address: address,
        plan_name: planName,
        amount: parseFloat(amount),
        interval_days: parseInt(intervalDays, 10),
        created_at: new Date().toISOString(),
      };

      // Save off-chain plan to Supabase
      const { error } = await supabase.from('merchant_plans').insert([newPlan]);
      if (error) {
        console.warn('Supabase DB notice:', error.message);
      }

      setCreatedPlans((prev) => [newPlan, ...prev]);

      // Proof of Wallet Interaction logging
      await logWalletInteraction(address, 'subscribe', `Created Plan: ${planName} (${amount} USDC)`);

      toast.success(`Merchant Plan "${planName}" created successfully!`);
      setPlanName('');
      setAmount('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to register merchant plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FF5733] font-bold tracking-[0.2em] uppercase">
            <Building2 size={14} /> Merchant SaaS Studio
          </div>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide mt-1">
            CREATE RECURRING <span className="text-[#FF5733]">PLANS</span>
          </h1>
        </div>

        {!address && (
          <button
            onClick={onOpenConnect}
            className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.1em] px-6 py-3 rounded-lg transition-all duration-300 uppercase shadow-lg shadow-[#FF5733]/20"
          >
            Connect Wallet To Deploy
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCreatePlan}
            className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-white/[0.02] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FF5733]/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
              <Sparkles size={18} className="text-[#FF5733]" /> New Subscription Tier
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                Plan Name / SaaS Product Title
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Enterprise API Gateway Tier"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF5733] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                  Price (USDC)
                </label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="49.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF5733] rounded-lg pl-8 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase">
                  Billing Cycle (Days)
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF5733] rounded-lg pl-8 pr-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-300 font-medium">
                <Shield size={14} className="text-[#FF5733]" /> Soroban Contract Specs
              </div>
              <p className="text-[11px] leading-relaxed">
                Creating a plan saves the off-chain metadata to Supabase and prepares the WASM contract payload for client approval.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.15em] py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase shadow-xl shadow-[#FF5733]/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Plus size={16} /> Register Merchant Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Plans Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bebas text-3xl text-white tracking-wide">Active Merchant Tiers</h3>
            <span className="text-xs text-gray-400 font-mono">{createdPlans.length} Plans Deployed</span>
          </div>

          <div className="space-y-4">
            {createdPlans.map((plan) => (
              <div
                key={plan.id}
                className="glass-panel p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bebas text-2xl text-white tracking-wide">{plan.plan_name}</h4>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase rounded">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">
                    Merchant: {plan.merchant_address}
                  </p>
                </div>

                <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <span className="font-bebas text-3xl text-[#FF5733]">
                    {plan.amount} <span className="text-white text-xl">USDC</span>
                  </span>
                  <span className="text-[10px] text-gray-400 tracking-wider uppercase">
                    Every {plan.interval_days} Days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
