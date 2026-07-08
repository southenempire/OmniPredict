# OmniPredict - Flare Network Hackathon

## 🌍 The Problem
Prediction markets today are largely disconnected from the real world, heavily reliant on trusted central intermediaries, and extremely slow to settle. In emerging markets—especially across Africa—access to reliable, decentralized financial tools to hedge against local economic or environmental risks (like droughts, floods, or extreme weather) is practically non-existent.

## 🚀 The Solution: OmniPredict
OmniPredict is a fully decentralized, frictionless prediction market built on the **Flare Network**. We combine Flare's unique data acquisition protocols with a seamless Web2-like onboarding experience to create a platform that is ready for mass adoption.

By utilizing the **Flare Time Series Oracle (FTSO)** and the **Flare Data Connector (FDC)**, OmniPredict allows users to speculate and hedge on both high-frequency crypto assets AND real-world off-chain events (like African weather patterns) with zero central points of failure.

### Key Features
1. **Frictionless Onboarding:** Integrated with **Privy**, users can sign in with just an Email or Google account. No seed phrases required. Behind the scenes, a secure embedded wallet is provisioned on the Flare Coston2 network.
2. **FTSO Powered Crypto Markets:** Predict whether BTC, ETH, or XRP will cross specific price thresholds. Settlement is instant, decentralized, and mathematically guaranteed by Flare's FTSO data providers.
3. **FDC Powered Real-World Markets:** Specialized African weather markets (Nairobi, Accra, Cape Town) demonstrating how Web2 API data can be bridged trustlessly to Web3 via the Flare Data Connector.
4. **OmniAI Terminal:** A premium, built-in AI assistant powered by **Groq**. OmniAI acts as an advanced quantitative analyst, synthesizing FTSO data trends and Web2 data to give users high-probability trading recommendations.

## 🏗️ Architecture
- **Frontend:** React + Vite, styled with custom sleek CSS.
- **Web3 Auth:** Privy Embedded Wallets (Email/Social Login -> C2FLR Wallet).
- **Blockchain:** Flare Coston2 Testnet.
- **Smart Contracts:** Solidity (Hardhat).
- **AI Core:** Vercel Serverless Functions + Groq API.

## 💻 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file with the following:
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_MARKET_CONTRACT_ADDRESS=your_deployed_coston2_address
GROQ_API_KEY=your_groq_api_key
```

### 3. Run the App
```bash
npm run dev
```

## 📜 Smart Contract Deployment
The `OmniPredictMarket.sol` contract is deployed on Flare Coston2. It features an automated `resolveMarket` function that pulls the exact final price from the FTSO Registry at the expiration timestamp to determine the winners!

*Built for the Flare Network Hackathon 2026*
