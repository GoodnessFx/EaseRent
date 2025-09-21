import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

// Get all bank accounts for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await sql`
      SELECT 
        id,
        account_id,
        institution_name,
        account_name,
        account_type,
        mask,
        is_active,
        provider,
        created_at
      FROM bank_accounts 
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add a new bank account (would typically be called after Plaid Link)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      account_id, 
      institution_name, 
      account_name, 
      account_type, 
      mask, 
      provider = 'plaid',
      access_token 
    } = body;

    if (!account_id || !institution_name || !account_name) {
      return Response.json({ 
        error: 'Account ID, institution name, and account name are required' 
      }, { status: 400 });
    }

    // Check if account already exists
    const [existingAccount] = await sql`
      SELECT id FROM bank_accounts 
      WHERE user_id = ${session.user.id} AND account_id = ${account_id}
    `;

    if (existingAccount) {
      return Response.json({ error: 'Account already connected' }, { status: 409 });
    }

    const [account] = await sql`
      INSERT INTO bank_accounts (
        user_id,
        account_id,
        institution_name,
        account_name,
        account_type,
        mask,
        provider,
        access_token,
        is_active
      ) VALUES (
        ${session.user.id},
        ${account_id},
        ${institution_name},
        ${account_name},
        ${account_type || 'checking'},
        ${mask || ''},
        ${provider},
        ${access_token || ''},
        true
      )
      RETURNING id, account_id, institution_name, account_name, account_type, mask, provider, is_active, created_at
    `;

    return Response.json({ account }, { status: 201 });
  } catch (error) {
    console.error('Error adding account:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}