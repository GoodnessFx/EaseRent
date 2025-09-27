// Step 2: Plaid Integration - Create Link Token
// This endpoint creates a link token for Plaid Link initialization
// The link token is used to securely connect user's bank accounts

import { auth } from "@/auth";

export async function POST(request) {
  try {
    // Get authenticated user session
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // In production, you would use actual Plaid API keys
    // For now, we'll use environment variables that will be prompted for
    const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
    const PLAID_SECRET = process.env.PLAID_SECRET;
    const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'; // sandbox, development, or production

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return Response.json({ 
        error: "Plaid configuration missing. Please add PLAID_CLIENT_ID and PLAID_SECRET environment variables." 
      }, { status: 500 });
    }

    // Create link token request to Plaid API
    const linkTokenRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      client_name: "EaseRent",
      country_codes: ['US'],
      language: 'en',
      user: {
        client_user_id: userId.toString()
      },
      products: ['transactions', 'auth'], // We need transactions for round-ups and auth for account details
      redirect_uri: process.env.PLAID_REDIRECT_URI,
    };

    // Make request to Plaid API using environment-specific URL
    const plaidUrl = PLAID_ENV === 'production' 
      ? 'https://production.plaid.com' 
      : `https://${PLAID_ENV}.plaid.com`;
    
    const response = await fetch(`${plaidUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkTokenRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Plaid API error:', errorData);
      return Response.json({ 
        error: "Failed to create link token",
        details: errorData 
      }, { status: 500 });
    }

    const data = await response.json();
    
    return Response.json({ 
      link_token: data.link_token,
      expiration: data.expiration 
    });

  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    return Response.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}