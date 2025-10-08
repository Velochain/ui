# VeloChain - Cycle2Earn on VeChain

VeloChain is a cycle-to-earn app that rewards eco-friendly activities via Strava, syncing verified rides to VeChainThor for token rewards. Users link VeWorld wallets to claim balances, ensuring fairness and sustainability.

![VeloChain Hero](src/assets/hero-cycling.jpg)

## 🚴‍♂️ Overview

VeloChain is a cycle-to-earn platform that incentivizes sustainable mobility by rewarding users with blockchain-based tokens for cycling and other eco-friendly activities. By integrating with the Strava API, VeloChain securely records verified activities such as cycling, trekking, and walking, then syncs them with the VeChainThor blockchain to issue rewards.

Each user connects their VeWorld wallet to link their identity and claim accumulated rewards. Activities are processed off-chain for verification (distance, type, timestamps) and then signed to prevent double-claims. Users can later claim their balance directly on-chain, ensuring transparency and fairness.

VeloChain creates a bridge between healthy living, environmental impact, and blockchain innovation, promoting sustainability while showcasing how Web3 can drive real-world behavior change.

### Key Features

- **🔄 Strava Integration**: Seamlessly sync cycling activities from Strava
- **🤖 AI-Powered Verification**: Google Gemini AI analyzes activities for authenticity and human effort
- **💰 Token Rewards**: Earn tokens for every kilometer cycled based on AI-verified scores
- **🔗 VeChain Blockchain**: Secure and transparent reward distribution
- **📊 Activity Dashboard**: Track your rides and earnings in real-time
- **🏆 Gamification**: Compete with friends and earn bonus rewards
- **🔐 Wallet Integration**: Connect with VeChain-compatible wallets

## 🏗️ Architecture

The application consists of four main components:

1. **Frontend (Next.js)**: React-based web application with modern UI
2. **Backend API**: Next.js API routes for Strava integration and data processing
3. **AI Verification Layer**: Google Gemini AI for activity authenticity verification
4. **Smart Contract**: VeChain-based Cycle2Earn contract for reward management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- VeChain wallet (VeWorld, Sync2, etc.)
- Strava account
- Strava API credentials
- Google Gemini API key (for AI verification)

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
   
   # AI Verification
   GEMINI_API_KEY=your_google_gemini_api_key
   
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
- **AI Verification**: Google Gemini AI analyzes each activity for authenticity
- **Reward Calculation**: Tokens are calculated based on distance cycled and AI verification score (0-100)
- **Claim Process**: Select verified activities and claim your rewards
- **Transparent**: All transactions are recorded on VeChain blockchain

## 🔧 API Endpoints

### Authentication
- `GET /api/auth` - Initiate Strava OAuth flow
- `GET /api/auth/callback` - Handle Strava OAuth callback

### Strava Integration
- `GET /api/strava/athlete` - Get athlete profile data
- `GET /api/strava/activities` - Fetch recent activities (with AI verification)
- `GET /api/strava/stats` - Get athlete statistics
- `POST /api/strava/activities/claim` - Claim rewards for AI-verified activities
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

## 🤖 AI-Powered Activity Verification

VeloChain uses **Google Gemini 2.0 Flash** to verify the authenticity and quality of cycling activities before issuing rewards. This prevents fraud and ensures only genuine human efforts are rewarded.

### How It Works

1. **Activity Analysis**: When activities are synced from Strava, they're sent to Gemini AI for analysis
2. **Fraud Detection**: AI checks for unrealistic patterns like:
   - Impossible speeds or distances
   - Bot-like behavior patterns
   - Suspiciously short or long durations
   - Inconsistent GPS data
3. **Scoring System**: Each activity receives a score from **0-100** based on:
   - **Human Effort**: Realistic physical exertion
   - **Environmental Benefit**: Contribution to sustainable mobility
   - **Data Authenticity**: Consistency with real cycling patterns
4. **Reward Calculation**: Final token rewards are weighted by the AI verification score

### Implementation

```typescript
import { GoogleGenAI } from "@google/genai";

export async function analyzeActivity(activities: any[]): Promise<any> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });
  
  const completion = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [{
      role: "user",
      parts: [{
        text: `You are an AI verifier for VeloChain, a blockchain-powered "cycle-to-earn" platform.
        
        You will receive multiple Strava activity records in JSON format. 
        For each record, return a score from 0–100 representing human effort and environmental benefit.
        
        Rules:
        - If activity data looks unrealistic (e.g. too high/low speed, too short, or bot-like), return score: 0.
        - Do not skip or reorder activities — return one result per input.
        - Only include id and score in the response.
        - Return valid JSON only.`
      }]
    }]
  });

  const response = await completion.sendMessage({
    message: JSON.stringify(activities, null, 2),
  });

  return JSON.parse(
    response.text.replace(/^```json\n/, "").replace(/\n```$/, "")
  );
}
```

### Benefits

- **Fraud Prevention**: Blocks fake or manipulated activities
- **Fair Rewards**: Ensures genuine efforts are properly recognized
- **Sustainability Focus**: Prioritizes eco-friendly transportation
- **Scalability**: Handles high volumes of activity verification
- **Transparency**: Verification scores are visible to users

### API Configuration

To enable AI verification, obtain a Google Gemini API key:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

## 🔐 Security Features

- **OAuth 2.0**: Secure Strava authentication
- **AI Fraud Detection**: Google Gemini AI verifies activity authenticity
- **Signature Verification**: Cryptographic proof for rewards
- **Wallet Integration**: Non-custodial user control
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Secure data handling

## ⚙️ VeChain SDK Integration

### Private Key Management

The application uses the VeChain SDK to interact with smart contracts. Private keys are derived from a mnemonic phrase stored securely in environment variables.


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
   GEMINI_API_KEY=your_production_gemini_key
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
- ✅ AI-powered activity verification with Google Gemini
- ✅ Fraud detection and scoring system
- ✅ Basic reward system
- ✅ Wallet connection
- ✅ Activity tracking

### Phase 2 (Planned)
- 🔄 Enhanced AI models with image/GPS verification
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
- Ensure activities are unclaimed and AI-verified

**AI verification not working**
- Check GEMINI_API_KEY is properly set in .env.local
- Verify Google Gemini API quota and limits
- Check network connectivity to Google AI services
- Review activity data format from Strava

**Activities showing score of 0**
- Activity may look unrealistic to AI (check speed, distance, duration)
- Ensure GPS data is consistent and complete
- Verify activity type is supported (cycling, walking, trekking)

## 🙏 Acknowledgments

- **VeChain Foundation** for blockchain infrastructure
- **Google AI** for Gemini 2.0 Flash and activity verification capabilities
- **Strava** for fitness tracking API
- **OpenZeppelin** for smart contract security
- **Next.js** team for the amazing framework
- **Community contributors** for feedback and support

---

**Built with ❤️ for the cycling community**

*Ride more, earn more, build the future of fitness rewards.*