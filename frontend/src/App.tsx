import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ArrowRight, Zap, Shield, Clock, Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { useWallet } from './hooks/useWallet'
import { logWalletInteraction } from './utils/supabaseClient'

function App() {
  const { address, isConnecting, connect, disconnect } = useWallet()
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleConnect = async () => {
    if (address) {
      disconnect()
      toast('Wallet disconnected')
      return
    }
    
    try {
      await connect()
      toast.success('Wallet connected successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet')
    }
  }

  const handleSubscribe = async () => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSubscribing(true)
    try {
      // Mocking smart contract interaction for MVP frontend showcase
      // In full implementation, we'd sign a Soroban tx here
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      await logWalletInteraction(address, 'subscribe', 'Pro Plan - 50 USDC')
      toast.success('Successfully subscribed to Pro Plan!')
    } catch (error: any) {
      toast.error(error.message || 'Subscription failed')
    } finally {
      setIsSubscribing(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">
      <Toaster theme="dark" position="bottom-right" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bebas text-3xl tracking-wider text-brand">SubStellar</div>
          <button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-[11px] font-bold tracking-[0.1em] px-7 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
          >
            {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
            {address ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <h1 className="font-bebas text-6xl md:text-8xl leading-[0.9] tracking-tight">
              Programmable <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-hover">Subscriptions</span> <br/>
              on Stellar
            </h1>
            <p className="text-text-secondary text-lg max-w-lg font-inter font-light">
              Automate your SaaS recurring payments in USDC. Transparent, non-custodial, and built for the future of Web3 subscriptions.
            </p>
            <div className="flex gap-4">
              <button className="bg-brand hover:bg-brand-hover text-white text-[11px] font-bold tracking-[0.1em] px-7 py-3 rounded-lg transition-all duration-300 flex items-center gap-2">
                Start Building <ArrowRight size={16} />
              </button>
              <button className="border border-white/40 hover:border-white hover:bg-white/5 text-white text-[11px] font-bold tracking-[0.1em] px-7 py-3 rounded-lg transition-all duration-300">
                View Documentation
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-md mx-auto"
          >
            {/* Voxel aesthetic card */}
            <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group border border-white/10 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bebas text-2xl tracking-wide">Pro Plan</h3>
                    <p className="text-text-muted text-sm tracking-[0.1em] uppercase mt-1">Monthly Subscription</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bebas text-4xl text-brand">50 USDC</span>
                    <p className="text-text-muted text-xs">/month</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Zap size={16} className="text-brand" /> Instant Settlements
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Shield size={16} className="text-brand" /> Non-Custodial
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Clock size={16} className="text-brand" /> Automated Pulls
                  </div>
                </div>

                <button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] font-bold tracking-[0.1em] py-4 rounded-lg transition-all duration-300 mt-4 flex justify-center items-center gap-2"
                >
                  {isSubscribing ? <Loader2 size={16} className="animate-spin" /> : 'Subscribe Now'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default App
