#!/bin/bash
set -e

echo "🛠 Building Soroban Rust Contract to WebAssembly..."
cd "$(dirname "$0")/../contracts"
cargo build --target wasm32-unknown-unknown --release

echo "✅ Contract compiled successfully to WASM!"
