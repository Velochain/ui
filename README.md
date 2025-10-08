# VeloChain - Cycle2Earn on VeChain

A decentralized fitness rewards platform that connects Strava cycling activities with VeChain blockchain to reward cyclists with tokens for their physical activities.

![VeloChain Hero](src/assets/hero-cycling.jpg)

## 🚴‍♂️ Overview

VeloChain is a Web3 fitness application that bridges the gap between physical activity and blockchain rewards. Users connect their Strava accounts to automatically track cycling activities and earn tokens based on their performance. The platform leverages VeChain's blockchain technology to provide transparent, secure, and instant rewards.

### Key Features

- **🔄 Strava Integration**: Seamlessly sync cycling activities from Strava
- **💰 Token Rewards**: Earn tokens for every kilometer cycled
- **🔗 VeChain Blockchain**: Secure and transparent reward distribution
- **📊 Activity Dashboard**: Track your rides and earnings in real-time
- **🏆 Gamification**: Compete with friends and earn bonus rewards
- **🔐 Wallet Integration**: Connect with VeChain-compatible wallets

## 🏗️ Architecture

The application consists of three main components:

1. **Frontend (Next.js)**: React-based web application with modern UI
2. **Backend API**: Next.js API routes for Strava integration and data processing
3. **Smart Contract**: VeChain-based Cycle2Earn contract for reward management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- VeChain wallet (VeWorld, Sync2, etc.)
- Strava account
- Strava API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vechain/ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Strava API Configuration
   STRAVA_CLIENT_ID=your_strava_client_id
   STRAVA_CLIENT_SECRET=your_strava_client_secret
   STRAVA_REDIRECT_URI=http://localhost:3000/api/auth/callback
   
   # VeChain Configuration
   MNEMONIC=your_mnemonic_phrase_for_contract_interactions
   
   # Database (if using)
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started

1. **Connect Your Wallet**
   - Click "Connect Wallet" on the homepage
   - Select your preferred VeChain wallet
   - Approve the connection

2. **Link Strava Account**
   - Click "Connect Strava" 
   - Authorize the application on Strava
   - Your cycling activities will start syncing

3. **View Your Dashboard**
   - Track your recent activities
   - Monitor your earnings
   - Claim rewards for completed rides

### Earning Rewards

- **Automatic Tracking**: Activities are automatically synced from Strava
- **Reward Calculation**: Tokens are calculated based on distance cycled
- **Claim Process**: Select activities and claim your rewards
- **Transparent**: All transactions are recorded on VeChain blockchain

## 🔧 API Endpoints

### Authentication
- `GET /api/auth` - Initiate Strava OAuth flow
- `GET /api/auth/callback` - Handle Strava OAuth callback

### Strava Integration
- `GET /api/strava/athlete` - Get athlete profile data
- `GET /api/strava/activities` - Fetch recent activities
- `GET /api/strava/stats` - Get athlete statistics
- `POST /api/strava/activities/claim` - Claim rewards for activities
- `POST /api/strava/unlink` - Unlink Strava account

### Account Management
- `POST /api/link` - Link wallet address with Strava ID
- `GET /api/test-db` - Test database connection

## 🏗️ Smart Contract

The Cycle2Earn smart contract handles:

- **User Registration**: Connect Strava IDs to wallet addresses
- **Reward Distribution**: Manage token rewards for activities
- **Signature Verification**: Secure reward claiming process
- **Reward Pool Integration**: Interface with X2Earn rewards pool

### Contract Address
```
Testnet: 0x90ae6877c3fd0124f10a4e41042a97a61e25b765
```

### Key Functions
- `connectStrava(string stravaId)` - Link Strava account
- `addReward(address user, uint256 amount, bytes signature)` - Add rewards
- `claimReward(address user)` - Claim accumulated rewards
- `getUserRewards(address user)` - Get user's reward balance

## 🎨 UI Components

### Core Components
- **Hero**: Landing page with call-to-action
- **Features**: How the platform works
- **Dashboard**: Main user interface
- **ActivityCard**: Individual activity display
- **EarningsCard**: Reward balance and claiming
- **StravaIntegration**: Strava connection flow

### Design System
- Built with **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **Lucide React** icons for consistency
- **Responsive design** for all devices

## 🔐 Security Features

- **OAuth 2.0**: Secure Strava authentication
- **Signature Verification**: Cryptographic proof for rewards
- **Wallet Integration**: Non-custodial user control
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Secure data handling

## ⚙️ VeChain SDK Integration

### Private Key Management

The application uses the VeChain SDK to interact with smart contracts. Private keys are derived from a mnemonic phrase stored securely in environment variables.

**Important Notes:**
- Private keys are always 32 bytes (256 bits)
- Hex encoding produces exactly 64 characters (2 hex chars per byte)
- No padding is required for properly formatted keys
- The `0x` prefix is removed for compatibility with VeChain SDK

### Thor Client Configuration

The application connects to VeChain testnet using the Thor client:

```typescript
const thor = new ThorClient(
  new SimpleHttpClient("https://testnet.vechain.org/"),
  {
    isPollingEnabled: false,
  }
);
```

### Smart Contract Initialization

Smart contracts are loaded with a signer for transaction authorization:

```typescript
const cycle2earnContract = thor.contracts.load(
  "0x90ae6877c3fd0124f10a4e41042a97a61e25b765",
  cycle2earnAbi,
  new VeChainPrivateKeySigner(
    Buffer.from(privateKey),
    new VeChainProvider(thor)
  )
);
```

### Security Best Practices

1. **Environment Variables**: Never commit mnemonics or private keys to version control
2. **Key Derivation**: Use BIP39 mnemonics with proper derivation paths
3. **Hex Format**: Ensure private keys are properly formatted (64 hex characters)
4. **Network Selection**: Use testnet for development, mainnet for production
5. **Key Rotation**: Regularly rotate production keys and mnemonics

## 📊 Strava API Integration

### Setup Process

1. **Create Strava Application**
   - Visit [Strava API Settings](https://www.strava.com/settings/api)
   - Create a new application
   - Note your Client ID and Client Secret

2. **Configure Redirect URI**
   - Set callback domain to `localhost:3000` (development)
   - Update for production domain

3. **API Rate Limits**
   - Unauthenticated: 100 requests/15 minutes
   - Authenticated: 1000 requests/15 minutes
   - Premium users: Higher limits available

### Data Synced
- **Athlete Profile**: Name, profile picture, stats
- **Activities**: Distance, duration, elevation, type
- **Statistics**: Weekly/monthly totals, achievements

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   STRAVA_CLIENT_ID=your_production_client_id
   STRAVA_CLIENT_SECRET=your_production_client_secret
   STRAVA_REDIRECT_URI=https://yourdomain.com/api/auth/callback
   MNEMONIC=your_production_mnemonic
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Smart Contract Deployment

The smart contract is deployed using Hardhat:

```bash
cd ../sdk-hardhat-integration
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network testnet
```

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Strava integration
- ✅ Basic reward system
- ✅ Wallet connection
- ✅ Activity tracking

### Phase 2 (Planned)
- 🔄 Social features and challenges
- 🔄 NFT achievements
- 🔄 Advanced analytics
- 🔄 Mobile app

### Phase 3 (Future)
- 🔄 Cross-chain compatibility
- 🔄 DeFi integrations
- 🔄 Governance tokens
- 🔄 Enterprise partnerships

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**"Not authenticated with Strava"**
- Complete the OAuth flow
- Check environment variables
- Verify Strava app settings

**Wallet connection issues**
- Ensure you're using a VeChain-compatible wallet
- Check network configuration
- Clear browser cache

**Reward claiming fails**
- Verify wallet has sufficient gas
- Check smart contract status
- Ensure activities are unclaimed

### Getting Help
- 📧 Email: support@velochain.com
- 💬 Discord: [Join our community](https://discord.gg/velochain)
- 📖 Documentation: [docs.velochain.com](https://docs.velochain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/velochain/issues)

## 🙏 Acknowledgments

- **VeChain Foundation** for blockchain infrastructure
- **Strava** for fitness tracking API
- **OpenZeppelin** for smart contract security
- **Next.js** team for the amazing framework
- **Community contributors** for feedback and support

---

**Built with ❤️ for the cycling community**

*Ride more, earn more, build the future of fitness rewards.*