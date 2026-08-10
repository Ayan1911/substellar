-- SubStellar Supabase Database Schema
-- Stellar Level 4 Green Belt Telemetry & Off-chain Metadata

-- 1. Users Onboarding Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Wallet Interactions Telemetry Table
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'connect', 'subscribe', 'cancel', 'billing_execution'
    details TEXT,
    tx_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Feedback Collection Table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL, -- 'general', 'ux', 'feature', 'bug'
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Merchant Plans Metadata Table
CREATE TABLE IF NOT EXISTS merchant_plans (
    id TEXT PRIMARY KEY,
    merchant_address TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    interval_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
