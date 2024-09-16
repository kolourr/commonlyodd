# Commonly Odd - Trivia Game

Welcome to Commonly Odd, an engaging trivia game that offers a unique and fun experience for players of all levels!

## Getting Started

### API Setup

1. Set up the environment:
   ```bash
   export APP_ENV=local  # For local development
   # or
   export APP_ENV=production  # For production environment
   ```

2. Install CompileDaemon:
   ```bash
   go get github.com/githubnemo/CompileDaemon
   export PATH=$PATH:$(go env GOPATH)/bin
   source ~/.zshrc  # or ~/.bashrc
   ```

3. Run the API:
   ```bash
   CompileDaemon -command="./main" -build="go build cmd/server/main.go"
   ```

4. Build the API:
   ```bash
   go build -o ./main cmd/server/main.go
   ```

### UI Setup

1. Install dependencies:
   ```bash
   npm install  # or pnpm install or yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev  # or npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. Build for production:
   ```bash
   npm run build
   ```
   This creates a `dist` folder ready for deployment.

## Deployment

Deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## Game Features

- **Free Trial**: Try Commonly Odd for free! No credit card required, just sign in.
- **Diverse Categories**: Choose from baseball, hockey, basketball, football, 80's, Harry Potter, Bible, and random topics.
- **Group Play**: Up to 10 participants in voice chat, with no limit on total players per session.
- **AI-Generated Images**: Unique, AI-created images for each question.
- **Unlimited Games**: Play as many games as you want in a single session.

## FAQ

### Gameplay

- **Q: How many people can play?**
  A: There's no limit to players joining via link, but voice calls are limited to 10 participants.

- **Q: How many games can I play?**
  A: You can play unlimited games within each session.

- **Q: What if I can't start my game?**
  A: Try ending the current session and starting a new one.

### Account Management

- **Q: Can I update or cancel my membership?**
  A: Yes, use 'Manage Subscription' on our website to access Stripe's billing page.

- **Q: How do I delete my account?**
  A: Go to 'Delete Account' in the settings menu and follow the prompts.

### Support and Community

- **Q: How can I report errors or make suggestions?**
  A: Email bruce@commonlyodd.com or contact @kolourrmusic on Twitter.

- **Q: Is there a community forum?**
  A: Yes! Join our [Subreddit](https://www.reddit.com/r/commonlyoddtrivia/).

For more information or inquiries, please contact bruce@commonlyodd.com.
