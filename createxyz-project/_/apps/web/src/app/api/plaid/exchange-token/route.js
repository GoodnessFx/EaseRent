// Step 2: Plaid Integration - Exchange Public Token for Access Token
// This endpoint exchanges the public token from Plaid Link for a permanent access token
// and stores the connected bank account information in our database

import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Get authenticated user session
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { public_token, metadata } = await request.json();
    
    if (!public_token) {
      return Response.json({ error: "Missing public_token" }, { status: 400 });
    }

    const userId = session.user.id;
    const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
    const PLAID_SECRET = process.env.PLAID_SECRET;

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return Response.json({ 
        error: "Plaid configuration missing" 
      }, { status: 500 });
    }

    // Exchange public token for access token
    const exchangeRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      public_token: public_token
    };

    // Use environment-specific Plaid URL
    const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
    const plaidUrl = PLAID_ENV === 'production' 
      ? 'https://production.plaid.com' 
      : `https://${PLAID_ENV}.plaid.com`;
    
    const response = await fetch(`${plaidUrl}/link/token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exchangeRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Plaid token exchange error:', errorData);
      return Response.json({ 
        error: "Failed to exchange token" 
      }, { status: 500 });
    }

    const data = await response.json();
    const { access_token, item_id } = data;

    // Get account information using the access token
    const accountsRequest = {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: access_token
    };

    const accountsResponse = await fetch(`${plaidUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountsRequest)
    });

    if (!accountsResponse.ok) {
      const errorData = await accountsResponse.json();
      console.error('Plaid accounts error:', errorData);
      return Response.json({ 
        error: "Failed to get account info" 
      }, { status: 500 });
    }

    const accountsData = await accountsResponse.json();
    
    // Store bank accounts in our database
    const savedAccounts = [];
    
    for (const account of accountsData.accounts) {
      try {
        // Insert or update bank account in database
        const [savedAccount] = await sql`
          INSERT INTO bank_accounts (
            user_id, 
            account_id, 
            institution_name, 
            account_name, 
            account_type, 
            mask, 
            provider, 
            access_token
          ) VALUES (
            ${userId},
            ${account.account_id},
            ${metadata?.institution?.name || 'Unknown Institution'},
            ${account.name},
            ${account.subtype || account.type},
            ${account.mask},
            'plaid',
            ${access_token}
          )
          ON CONFLICT (user_id, account_id) 
          DO UPDATE SET 
            institution_name = EXCLUDED.institution_name,
            account_name = EXCLUDED.account_name,
            account_type = EXCLUDED.account_type,
            mask = EXCLUDED.mask,
            access_token = EXCLUDED.access_token,
            is_active = true
          RETURNING *
        `;
        
        savedAccounts.push(savedAccount);
      } catch (dbError) {
        console.error('Database error saving account:', dbError);
        // Continue with other accounts even if one fails
      }
    }

    // Create a default savings wallet if user doesn't have one
    try {
      const [existingWallet] = await sql`
        SELECT id FROM savings_wallets WHERE user_id = ${userId} LIMIT 1
      `;

      if (!existingWallet) {
        await sql`
          INSERT INTO savings_wallets (
            user_id, 
            name, 
            target_amount, 
            target_date,
            is_locked,
            penalty_percentage
          ) VALUES (
            ${userId},
            'Rent Savings',
            1200.00,
            ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}, -- 30 days from now
            true,
            10.00
          )
        `;
      }
    } catch (walletError) {
      console.error('Error creating default wallet:', walletError);
      // Don't fail the whole request if wallet creation fails
    }

    return Response.json({ 
      success: true,
      accounts: savedAccounts.length,
      message: `Successfully connected ${savedAccounts.length} bank account(s)`
    });

  } catch (error) {
    console.error('Error in token exchange:', error);
    return Response.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}