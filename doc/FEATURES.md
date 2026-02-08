# Seeker Demo - Feature Summary

## Overview

**Seeker Demo** is a Solana Mobile Stack (MWA) portfolio tracking application built with Expo and React Native. It enables users to connect their Solana wallet and track their crypto assets across different investment categories with real-time pricing and portfolio change tracking.

---

## Core Features

### 🔐 Wallet Authentication
- **Solana Mobile Wallet Adapter (MWA)** integration for secure wallet connection
- Beautiful gradient login screen with mascot animation
- Session persistence across app launches
- Mock wallet support for emulator testing

### 💼 Multi-Category Portfolio Management
Users can organize assets into 6 predefined investment categories:
- **Stock** - Traditional equities and tokenized stocks (via xStocks & Ondo)
- **Crypto** - Cryptocurrencies (SOL, BTC, ETH, etc.)
- **Real Estate** - REITs and tokenized property
- **Bonds** - Treasury and corporate bonds
- **Commodities** - Gold, silver, oil, and other commodities
- **Cash** - Stablecoins (USDC, USDT, USD1) and fiat equivalents

### 📊 Real-Time Asset Tracking
- **Automatic Solana Asset Detection** via Helius API
  - Fetches all SPL tokens in connected wallet
  - Retrieves native SOL balance separately for accuracy
  - Real-time price data for supported tokens
  - Filters out zero-value assets automatically

- **Token Categorization System**
  - 100+ pre-mapped token addresses to investment categories
  - Supports xStocks (tokenized equities)
  - Supports Ondo tokenized assets (stocks, commodities)
  - Automatic fallback to "crypto" category for unmapped tokens

### 📈 Portfolio Change Tracking
- **Session-Based Change Calculation**
  - Single snapshot stored on app close
  - Calculates changes since last session at:
    - Portfolio level (total change)
    - Investment type level (category change)
    - Individual asset level
  - New assets treated as 100% gain on first appearance

- **Optimistic UI with Caching**
  - Instant portfolio display from cached data on app launch
  - Background refresh for fresh data
  - Near-zero perceived loading time for returning users

### 🎨 Beautiful UI/UX

#### Main Hub View
- **Interactive Pie Chart** showing portfolio allocation
  - Tap segments to drill into investment types
  - Anime-style color scheme (pink, blue, purple, mint, yellow, orange)
  - "MASTERY 100%" center label

- **Portfolio Summary Card**
  - Total portfolio value
  - Total change ($ and %)
  - Color-coded badges (green for gains, red for losses)

- **Asset Squad** - Swipeable cards for each investment type
  - Shows total value per category
  - Percentage allocation
  - Change since last session
  - Swipe-to-delete functionality

#### Investment Type Detail View
- Shows all assets within a category
- Individual asset cards with:
  - Token name and symbol
  - Current value
  - UI amount (human-readable balance)
  - Price per token
  - Change since last session
- Add custom assets manually (feature exists but not fully integrated with wallet data)

### 🎯 Navigation
- **Bottom Tab Navigation** with investment type icons
- Hub view shows all categories
- Quick-switch between investment types
- "+" button to add new investment categories to active view
- Smooth transitions and gesture handling (React Native Gesture Handler + Reanimated)

### ⚙️ Settings & Configuration
- **Settings Drawer** with logout functionality
- Persistent storage of:
  - Active investment types selection
  - Portfolio snapshots (AsyncStorage)
  - User preferences

---

## Technical Architecture

### Frontend Stack
- **React Native 0.81** with New Architecture (Fabric)
- **Expo SDK ~54** for managed workflow
- **Expo Router** for file-based navigation
- **React Query (@tanstack/react-query)** for data fetching and caching
- **Zustand** for portfolio state management
- **AsyncStorage** for local data persistence

### Blockchain Integration
- **@solana/web3.js** for Solana interactions
- **@solana/spl-token** for SPL token operations
- **@wallet-ui/react-native-web3js** for MWA integration
- **Helius API** for:
  - Asset discovery (`getAssetsByOwner`)
  - Batch price lookups (`getAssetBatch`)
  - Native SOL balance (`getBalance`)

### Key Custom Hooks
- `useWalletAssets` - Fetches and processes wallet assets with pricing
- `usePortfolio` - Portfolio state management with Zustand
- Custom authentication provider with MWA

### Data Flow
1. **App Launch** → Load cached portfolio instantly
2. **Wallet Connection** → Fetch assets from Helius
3. **Asset Processing** → Map to categories, calculate values
4. **Snapshot Comparison** → Calculate changes vs. last session
5. **UI Update** → Display portfolio with real-time data
6. **App Close** → Save current portfolio snapshot

---

## Design System

### Color Palette
- **Anime Blue** (#4CC9F0) - Stock
- **Anime Purple** (#C77DFF) - Crypto
- **Anime Mint** (#06FFA5) - Real Estate, Primary Actions
- **Anime Yellow** (#FFD60A) - Bonds
- **Anime Orange** (#FF6B35) - Commodities
- **Anime Pink** (#F72585) - Cash

### UI Patterns
- **Glassmorphism** effects on cards
- **Bold borders** (3px black) for definition
- **Hard shadows** (6-8px offset) for depth
- **Rounded corners** (999px for pills, 16-24px for cards)
- **Linear gradients** for backgrounds (#fdf2f8 → #e0f2fe)
- **Swipeable interactions** with smooth animations

---

## Key Files Structure

```
seeker_demo/
├── app/
│   ├── (tabs)/
│   │   └── portfolio/
│   │       ├── index.tsx          # Main hub view
│   │       └── investment-type.tsx # Category detail view
│   ├── sign-in.tsx                 # Login screen
│   └── _layout.tsx                 # Root navigation
├── components/
│   ├── portfolio/
│   │   ├── AssetCard.tsx           # Asset display
│   │   ├── PieChart.tsx            # Interactive chart
│   │   ├── PortfolioSummary.tsx    # Total value summary
│   │   ├── BottomNav.tsx           # Tab navigation
│   │   └── SettingsDrawer.tsx      # Settings menu
│   └── auth/
│       └── auth-provider.tsx       # MWA authentication
├── hooks/
│   └── useWalletAssets.ts          # Asset fetching logic
├── utils/
│   ├── portfolioSnapshot.ts        # Change tracking
│   └── helius.ts                   # API integration
├── constants/
│   ├── tokenMap.ts                 # Token → Category mapping
│   ├── systemInvestmentTypes.ts    # Predefined categories
│   └── portfolioTheme.ts           # Design tokens
└── store/
    └── portfolioStore.ts           # Zustand state
```

---

## Supported Token Types

### 1. Stablecoins (Cash Category)
- USDC, USDT, USD1

### 2. Major Cryptocurrencies
- Native SOL (with special handling for accurate balance)
- Any SPL token with Helius price data

### 3. Tokenized Stocks (100+ tokens)
- **xStocks** - AAPL, GOOGL, META, MSFT, NVDA, TSLA, etc.
- **Ondo Tokens** - AAPLon, MSFTon, NVDAon, TSLAon, etc.
- **Pre-IPO Stocks** - OPENAI, SPACEX, XAI, ANDURIL, ANTHROPIC, KALSHI

### 4. Tokenized Commodities
- Gold (GLDx, GLDr)
- Silver (SLVr, SLVon)
- Oil, Palladium, Platinum tokens

---

## Performance Optimizations

1. **Optimistic UI** - Cached data shown immediately
2. **Batch API Calls** - Single batch request for all price data
3. **Filtered Assets** - Only display assets with value > 0
4. **Query Caching** - React Query manages refresh strategy
5. **Manual Refresh Only** - No auto-refresh to reduce API calls
6. **Efficient Re-renders** - Zustand slice updates

---

## Known Limitations & Future Enhancements

### Current Limitations
- Manual asset addition not fully integrated with wallet data
- Single snapshot only (no historical tracking)
- No custom investment type creation
- Limited to Solana blockchain

### Potential Enhancements from Discussions
- Multi-timeframe change tracking (24h, 7d, 30d)
- Historical portfolio value charts
- Multi-chain support (Ethereum, BSC, etc.)
- Custom category creation
- Asset notes and tags
- Portfolio rebalancing suggestions
- Notifications for significant changes

---

## Development & Testing

### Running the App
```bash
npm install
npx expo start
# Press 'a' for Android emulator
```

### Mock Wallet Setup
For emulator testing:
1. Install Mock MWA Wallet APK on Android emulator
2. Configure biometric authentication (fingerprint/PIN)
3. Create test wallet in Mock MWA
4. Connect via the app's login screen

### Key Commands
- `npm run android` - Build and run Android app
- `npm run dev` - Start Expo dev server
- `npm run lint` - Run ESLint checks
- `npm run fmt` - Format code with Prettier

---

## Project History Highlights

Based on conversation history, the app evolved through:

1. **Initial Setup** - Solana Mobile quickstart
2. **Wallet Integration** - MWA connection and authentication
3. **Portfolio UI** - Pie charts, asset cards, navigation
4. **Token Mapping** - 100+ token addresses mapped to categories
5. **Portfolio Tracking** - Snapshot-based change calculation
6. **Performance** - Optimistic UI with caching
7. **Bug Fixes** - Fabric mounting issues, SOL balance accuracy

---

## App Identity

- **Name**: Seeker (from AppConfig)
- **Slogan**: Track your wealth
- **Theme**: Anime-inspired, bold, playful
- **Platform**: Android (Solana Mobile Stack)
- **Target Users**: Crypto investors tracking diversified portfolios

