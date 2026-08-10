import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * SubStellar Supabase Database Client and Telemetry Helper Functions.
 * Handles off-chain merchant plans, proof-of-wallet interactions, and user feedback.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserRecord {
  id?: string;
  wallet_address: string;
  created_at?: string;
  last_login?: string;
}

export interface WalletInteractionLog {
  id?: string;
  wallet_address: string;
  action_type: 'connect' | 'subscribe' | 'cancel' | 'billing_execution';
  details?: string;
  tx_hash?: string;
  created_at?: string;
}

export interface UserFeedback {
  id?: string;
  wallet_address?: string;
  rating: number;
  category: 'bug' | 'feature' | 'general' | 'ux';
  comment: string;
  created_at?: string;
}

export const logUserOnboarding = async (walletAddress: string): Promise<void> => {
  if (supabaseUrl.includes('placeholder')) {
    console.log('[Supabase Mock] User Onboarded:', walletAddress);
    return;
  }

  try {
    const { error } = await supabase
      .from('users')
      .upsert({ 
        wallet_address: walletAddress,
        last_login: new Date().toISOString()
      }, { onConflict: 'wallet_address' });

    if (error) console.error('Error recording user onboarding:', error);
  } catch (err) {
    console.error('Failed to log user onboarding:', err);
  }
};

export const logWalletInteraction = async (
  walletAddress: string,
  actionType: WalletInteractionLog['action_type'],
  details?: string,
  txHash?: string
): Promise<void> => {
  if (supabaseUrl.includes('placeholder')) {
    console.log('[Supabase Mock] Interaction Logged:', { walletAddress, actionType, details, txHash });
    return;
  }

  try {
    const { error } = await supabase.from('interactions').insert([
      {
        wallet_address: walletAddress,
        action_type: actionType,
        details: details || '',
        tx_hash: txHash || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) console.error('Error logging interaction to Supabase:', error);
  } catch (err) {
    console.error('Failed to log wallet interaction:', err);
  }
};

export const submitFeedback = async (feedback: UserFeedback): Promise<boolean> => {
  if (supabaseUrl.includes('placeholder')) {
    console.log('[Supabase Mock] Feedback Received:', feedback);
    return true;
  }

  try {
    const { error } = await supabase.from('feedback').insert([
      {
        ...feedback,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to submit feedback:', err);
    return false;
  }
};
