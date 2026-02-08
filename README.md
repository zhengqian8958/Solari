# Solari 🌟

A Solana mobile portfolio tracker built with Expo and React Native. Solari provides real-time tracking of your Solana wallet assets across multiple investment categories with intelligent change tracking and optimistic UI.

## Features

### 🎯 Core Functionality
- **Real-time Portfolio Tracking**: Connect your Solana wallet and view all your assets in real-time
- **Investment Categories**: Assets automatically categorized into:
  - Cryptocurrency
  - Stocks (xStocks)
  - Commodities
  - And more...
- **Portfolio Change Tracking**: Track value changes since your last session at portfolio, category, and asset levels
- **Optimistic UI**: Instant app loading using cached data while fresh data loads in the background

### 📊 Portfolio Management
- **Multi-view Navigation**: Swipe between different investment type views with smooth animations
- **Asset Management**: 
  - Remove unwanted assets from view
  - Add custom manual assets
  - Pull-to-refresh for latest data
- **Customizable Categories**: Add or remove investment categories based on your preferences

### 🔐 Solana Integration
- **Mobile Wallet Adapter (MWA)**: Seamless Solana wallet connection
- **Real-time Data**: Fetches asset balances and metadata from Solana blockchain
- **Token Categorization**: Automatic detection and categorization of SPL tokens

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (~54.0.21) with React Native (0.81.5)
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Context API with AsyncStorage for persistence
- **Blockchain**: 
  - `@solana/web3.js` for Solana interaction
  - `@wallet-ui/react-native-web3js` for wallet integration
  - `@solana/spl-token` for token handling
- **Data Fetching**: `@tanstack/react-query` for async state management
- **UI/UX**: 
  - `react-native-reanimated` for smooth animations
  - `react-native-gesture-handler` for swipe gestures
  - `expo-blur` for glassmorphism effects
  - Custom components with responsive design

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or pnpm
- Android Studio (for Android) or Xcode (for iOS)
- Expo CLI

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory (if not exists)

3. **Start the development server**
   ```bash
   npm run dev
   # or
   npx expo start
   ```

### Running on Device/Emulator

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Build Android (prebuild):**
```bash
npm run android:build
```

## Project Structure

```
seeker_demo/
├── app/                    # File-based routing (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   └── portfolio/     # Portfolio views
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── portfolio/        # Portfolio-specific components
│   └── ui/               # General UI components
├── hooks/                # Custom React hooks
├── store/                # Global state management
│   └── portfolioStore.tsx # Portfolio context & logic
├── utils/                # Utility functions
│   └── portfolioSnapshot.ts # Change tracking logic
├── constants/            # App constants
│   └── systemInvestmentTypes.ts # Investment categories
├── types/                # TypeScript type definitions
├── data/                 # Token mappings & static data
└── assets/               # Images, icons, fonts
```

## Key Concepts

### Portfolio Store
The `portfolioStore.tsx` manages all portfolio state including:
- Real-time asset fetching from Solana blockchain
- Portfolio change calculation vs. previous session
- Asset filtering (removed/custom assets)
- Investment type customization
- Optimistic UI with cached portfolio data

### Change Tracking
The app saves a snapshot of asset values when you close the app and calculates changes when you return:
- Shows value changes with color-coded indicators (green for gain, red for loss)
- Tracks changes at portfolio, investment type, and individual asset levels
- Persists using AsyncStorage

### Asset Categorization
Tokens are automatically categorized using `tokenMap.ts`:
- Maps token mint addresses to investment categories
- Supports cryptocurrency, stocks (xStocks), commodities, and more
- Unknown tokens default to "crypto" category

## Available Scripts

- `npm run dev` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run build` - TypeScript check + Android prebuild
- `npm run lint` - Run ESLint with auto-fix
- `npm run fmt` - Format code with Prettier
- `npm run doctor` - Check project health with expo-doctor

## Development Notes

### React Native New Architecture
This project uses React Native's New Architecture (Fabric):
- `newArchEnabled: true` in `app.json`
- Improved performance and concurrent rendering
- Uses modern React patterns (concurrent features)

### Mobile Wallet Adapter
For testing with Solana wallets:
- Use Mock MWA Wallet on Android emulator
- Ensure wallet is authenticated before connecting
- See Solana Mobile documentation for setup

## Contributing

This is a personal project for tracking Solana portfolios. Feel free to fork and customize for your needs.

## License

Private project - All rights reserved

## Acknowledgments

- Built with [Expo](https://expo.dev)
- Solana integration via [Solana Mobile](https://solanamobile.com/)
- Uses [Solana web3.js](https://solana-labs.github.io/solana-web3.js/)

---

**Note**: This app requires a Solana wallet with Mobile Wallet Adapter support for full functionality.
