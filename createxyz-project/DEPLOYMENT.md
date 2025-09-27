# EaseRent - Deployment Guide

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/easerent

# Authentication Configuration
AUTH_SECRET=your-auth-secret-key-here
AUTH_URL=http://localhost:4000

# Plaid Configuration (for bank account integration)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox
PLAID_REDIRECT_URI=http://localhost:4000/api/plaid/success

# reCAPTCHA Configuration (optional)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Create.xyz Configuration (for development)
NEXT_PUBLIC_CREATE_ENV=DEVELOPMENT
NEXT_PUBLIC_PROJECT_GROUP_ID=your-project-group-id
NEXT_PUBLIC_CREATE_BASE_URL=https://www.create.xyz

# CORS Configuration (optional)
CORS_ORIGINS=http://localhost:3000,http://localhost:4000

# Stripe Configuration (for payments - if needed)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## Database Setup

1. Create a PostgreSQL database
2. Run the following SQL commands to create the required tables:

```sql
-- Users table (handled by auth system)
-- This will be created automatically by the auth system

-- Bank accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL,
    mask TEXT,
    provider TEXT DEFAULT 'plaid',
    access_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, account_id)
);

-- Savings wallets table
CREATE TABLE IF NOT EXISTS savings_wallets (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0.00,
    target_date DATE,
    is_locked BOOLEAN DEFAULT true,
    penalty_percentage DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto deductions table
CREATE TABLE IF NOT EXISTS auto_deductions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    wallet_id INTEGER REFERENCES savings_wallets(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly')),
    next_deduction_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roundups table
CREATE TABLE IF NOT EXISTS roundups (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    wallet_id INTEGER REFERENCES savings_wallets(id) ON DELETE CASCADE,
    transaction_id TEXT,
    original_amount DECIMAL(10,2) NOT NULL,
    roundup_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_wallets_user_id ON savings_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_deductions_user_id ON auto_deductions(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_deductions_next_date ON auto_deductions(next_deduction_date);
CREATE INDEX IF NOT EXISTS idx_roundups_user_id ON roundups(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
```

## Development Setup

### Web App
```bash
cd createxyz-project/_/apps/web
npm install
npm run dev
```

### Mobile App
```bash
cd createxyz-project/_/apps/mobile
npm install
npx expo start
```

## Production Deployment

### Web App (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Set all environment variables in the deployment platform
3. Deploy

### Mobile App (Expo)
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Login to Expo: `eas login`
3. Configure EAS: `eas build:configure`
4. Build for production: `eas build --platform all`

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database**: Use connection pooling and SSL in production
3. **Authentication**: Ensure AUTH_SECRET is cryptographically secure
4. **API Keys**: Rotate Plaid and other API keys regularly
5. **CORS**: Configure CORS origins properly for production domains

## Monitoring and Logging

1. Set up error monitoring (Sentry, LogRocket, etc.)
2. Configure database monitoring
3. Set up uptime monitoring
4. Monitor API rate limits and usage

## Performance Optimization

1. Enable database connection pooling
2. Use CDN for static assets
3. Implement caching strategies
4. Monitor and optimize database queries
5. Use image optimization for mobile app

## Backup Strategy

1. Regular database backups
2. Environment variable backups
3. Code repository backups
4. Test restore procedures regularly
