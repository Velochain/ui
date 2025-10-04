# Strava API Integration Setup

This guide will help you set up the Strava API integration for your VeChain project.

## Prerequisites

1. A Strava account
2. Node.js and npm installed
3. Your VeChain project running

## Step 1: Create a Strava Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click "Create App" or "My API Application"
3. Fill in the application details:
   - **Application Name**: Your app name (e.g., "VeChain Fitness App")
   - **Category**: Choose appropriate category
   - **Club**: Leave blank unless you have a specific club
   - **Website**: Your website URL (can be localhost for development)
   - **Authorization Callback Domain**: `localhost:3000` (for development)

4. After creating the app, you'll get:
   - **Client ID**
   - **Client Secret**

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Strava credentials:
   ```
   STRAVA_CLIENT_ID=your_actual_client_id_here
   STRAVA_CLIENT_SECRET=your_actual_client_secret_here
   STRAVA_REDIRECT_URI=http://localhost:3000/api/auth
   ```

## Step 3: Install Dependencies

The required dependencies are already included in your `package.json`:
- `@tanstack/react-query` for data fetching
- `@vechain/dapp-kit-react` for VeChain wallet integration

## Step 4: Run the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

## Step 5: Test the Integration

1. Click "Connect Strava" to authenticate with Strava
2. You'll be redirected to Strava's authorization page
3. After authorization, you'll be redirected back to your app
4. Your Strava data (profile, activities, stats) will be displayed

## API Endpoints

The integration includes the following API endpoints:

- `GET /api/auth` - Initiates Strava OAuth flow
- `GET /api/strava/athlete` - Fetches athlete profile data
- `GET /api/strava/activities` - Fetches recent activities
- `GET /api/strava/stats` - Fetches athlete statistics

## Features

- **OAuth Authentication**: Secure Strava login
- **Athlete Profile**: Display user profile information
- **Activity Feed**: Show recent activities with details
- **Statistics**: Display fitness statistics and totals
- **VeChain Integration**: Ready for blockchain integration

## Troubleshooting

### Common Issues

1. **"Not authenticated with Strava" error**:
   - Make sure you've completed the OAuth flow
   - Check that your environment variables are correct
   - Verify your Strava app settings

2. **CORS errors**:
   - Ensure your redirect URI matches exactly in Strava settings
   - Check that you're using the correct domain

3. **Token expiration**:
   - Strava tokens expire after 6 hours
   - The app will handle token refresh automatically

### Development Tips

- Use Strava's sandbox mode for testing
- Check Strava API rate limits (100 requests per 15 minutes)
- Monitor your API usage in the Strava developer dashboard

## Next Steps

Now that you have Strava integration working, you can:

1. **Store data on VeChain**: Create smart contracts to store fitness achievements
2. **NFT Integration**: Mint NFTs for fitness milestones
3. **Token Rewards**: Create a token system for fitness activities
4. **Social Features**: Build community features around fitness data

## API Rate Limits

- **Unauthenticated**: 100 requests per 15 minutes
- **Authenticated**: 1000 requests per 15 minutes
- **Premium users**: Higher limits available

Make sure to implement proper caching and rate limiting in production.