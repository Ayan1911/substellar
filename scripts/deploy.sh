#!/bin/bash
set -e

echo "🚀 Building SubStellar Soroban Contract..."
cd "$(dirname "$0")/../contracts"
cargo build --target wasm32-unknown-unknown --release

WASM_PATH="target/wasm32-unknown-unknown/release/substellar_contract.wasm"

if [ -f "$WASM_PATH" ]; then
  echo "✅ Contract successfully built at: $WASM_PATH"
else
  echo "❌ Build failed!"
  exit 1
fi

echo "🌟 Deploying to Stellar Testnet via Soroban CLI..."
echo "Command to run when stellar-cli is configured:"
echo "stellar contract deploy --wasm $WASM_PATH --source <YOUR_TESTNET_IDENTITY> --network testnet"
