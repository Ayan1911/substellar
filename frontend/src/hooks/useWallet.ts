import { useState, useEffect } from 'react';
import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api';
import { logWalletInteraction, logUserOnboarding } from '../lib/supabase';

/**
 * Custom React Hook managing Freighter Wallet extension connections,
 * public key state, and telemetry logging to Supabase.
 */
export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connectionRes = await isConnected();
        if (connectionRes.isConnected) {
          const addressRes = await getAddress();
          if (addressRes.address) {
            setAddress(addressRes.address);
          }
        }
      } catch (err) {
        console.warn('Freighter auto-check non-blocking error:', err);
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const connectionRes = await isConnected();
      if (!connectionRes.isConnected) {
        throw new Error('Freighter extension is not installed or enabled in browser.');
      }

      const accessRes = await requestAccess();
      if (accessRes.error || !accessRes.address) {
        throw new Error(accessRes.error ? String(accessRes.error) : 'User rejected wallet access request.');
      }

      const publicKey = accessRes.address;
      setAddress(publicKey);

      // Onboarding & Proof of Interaction logging
      await logUserOnboarding(publicKey);
      await logWalletInteraction(publicKey, 'connect', 'Connected Freighter Wallet');

      return publicKey;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return {
    address,
    isConnecting,
    connect,
    disconnect,
  };
}
