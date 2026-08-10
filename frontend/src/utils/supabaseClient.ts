import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const logWalletInteraction = async (address: string, action: string, details?: string) => {
  if (supabaseUrl === 'https://placeholder-url.supabase.co') {
    console.log('[Supabase Mock] Logged interaction:', { address, action, details });
    return;
  }
  
  try {
    const { error } = await supabase
      .from('wallet_interactions')
      .insert([
        { 
          wallet_address: address, 
          action_type: action, 
          details: details || '',
          created_at: new Date().toISOString()
        }
      ])
      
    if (error) throw error
  } catch (error) {
    console.error('Error logging wallet interaction:', error)
  }
}
