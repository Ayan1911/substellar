import React, { useState } from 'react';
import { Zap, XCircle, Loader2, ArrowUpRight, Lock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { logWalletInteraction } from '../lib/supabase';
import { CONTRACT_ID } from '../lib/soroban';

interface SubscriberPortalProps {
  address: string | null;
  onOpenConnect: () => void;
}

interface ActiveSub {
  id: string;
  plan_name: string;
  merchant: string;
  amount: number;
  interval_days: number;
  next_billing: string;
  status: 'active' | 'cancelled';
}

export const SubscriberPortal: React.FC<SubscriberPortalProps> = ({ address, onOpenConnect }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<ActiveSub[]>([
    {
      id: 'sub_1',
      plan_name: 'SubStellar Pro Gateway Tier',
      merchant: 'GABCD...SUPPLIER_XYZ',
      amount: 50,
      interval_days: 30,
      next_billing: new Date(Date.now() + 864000000).toLocaleDateString(),
      status: 'active',
    },
    {
      id: 'sub_2',
      plan_name: 'Enterprise Analytics Pass',
      merchant: 'GABCD...ANALYTICS_LAB',
      amount: 120,
      interval_days: 30,
      next_billing: new Date(Date.now() + 1728000000).toLocaleDateString(),
      status: 'active',
    },
  ]);

  const handleSubscribePlan = async (sub: ActiveSub) => {
    if (!address) {
      toast.error('Please connect your Freighter wallet to execute Soroban subscription auth');
      onOpenConnect();
      return;
    }

    setLoadingAction(`sub_${sub.id}`);
    try {
      await new Promise((res) => setTimeout(res, 1800));

      await logWalletInteraction(
        address,
        'subscribe',
        `Subscribed to ${sub.plan_name} (${sub.amount} USDC)`
      );

      toast.success(`Soroban Subscription authorized for ${sub.plan_name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Subscription authorization failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancelSub = async (subId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      onOpenConnect();
      return;
    }

    setLoadingAction(`cancel_${subId}`);
    try {
      await new Promise((res) => setTimeout(res, 1500));

      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, status: 'cancelled' } : s))
      );

      await logWalletInteraction(
        address,
        'cancel',
        `Cancelled Subscription ID: ${subId}`
      );

      toast.success('Subscription cancelled on Soroban smart contract');
    } catch (err: any) {
      toast.error(err.message || 'Cancellation failed');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FF5733] font-bold tracking-[0.2em] uppercase">
            <Zap size={14} /> Subscriber Dashboard
          </div>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide mt-1">
            MY ACTIVE <span className="text-[#FF5733]">SUBSCRIPTIONS</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span>Contract ID:</span>
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
            >
              {CONTRACT_ID.slice(0, 8)}...{CONTRACT_ID.slice(-8)} <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {!address && (
          <button
            onClick={onOpenConnect}
            className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.1em] px-6 py-3 rounded-lg transition-all duration-300 uppercase shadow-lg shadow-[#FF5733]/20"
          >
            Connect Wallet To Manage
          </button>
        )}
      </div>

      {/* Grid of Subscriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subscriptions.map((sub) => {
          const isSubscribedLoading = loadingAction === `sub_${sub.id}`;
          const isCancelLoading = loadingAction === `cancel_${sub.id}`;
          const isActive = sub.status === 'active';

          return (
            <div
              key={sub.id}
              className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 space-y-6 bg-white/[0.02] relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bebas text-3xl text-white tracking-wide">{sub.plan_name}</h3>
                  <p className="text-xs text-gray-400 font-mono">Merchant: {sub.merchant}</p>
                </div>

                <span
                  className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded border ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {isActive ? 'Active' : 'Cancelled'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Rate</span>
                  <div className="font-bebas text-3xl text-white">
                    {sub.amount} <span className="text-[#FF5733]">USDC</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Next Settlement</span>
                  <div className="font-mono text-sm text-gray-200 mt-1">{sub.next_billing}</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Lock size={14} className="text-[#FF5733]" /> Soroban Auth Time-Bound
                </div>

                {isActive ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSubscribePlan(sub)}
                      disabled={isSubscribedLoading || isCancelLoading}
                      className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold tracking-[0.1em] px-4 py-2.5 rounded-lg border border-white/10 transition-colors uppercase disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSubscribedLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          Execute Auth <ArrowUpRight size={13} />
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCancelSub(sub.id)}
                      disabled={isCancelLoading || isSubscribedLoading}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold tracking-[0.1em] px-4 py-2.5 rounded-lg border border-red-500/20 transition-colors uppercase disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isCancelLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <XCircle size={14} /> Cancel
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500 font-mono italic">Subscription Revoked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
