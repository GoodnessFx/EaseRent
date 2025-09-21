import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

// Get round-up history for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const walletId = url.searchParams.get('wallet_id');
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    let query = `
      SELECT 
        r.id,
        r.original_amount,
        r.rounded_amount,
        r.roundup_amount,
        r.created_at,
        w.name as wallet_name,
        t.description as transaction_description,
        t.category as transaction_category,
        t.transaction_date
      FROM roundup_savings r
      JOIN savings_wallets w ON r.wallet_id = w.id
      LEFT JOIN transactions t ON r.transaction_id = t.id
      WHERE r.user_id = $1
    `;
    
    const values = [session.user.id];
    let paramCount = 2;

    if (walletId) {
      query += ` AND r.wallet_id = $${paramCount++}`;
      values.push(walletId);
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(limit, offset);

    const roundups = await sql(query, values);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM roundup_savings r
      WHERE r.user_id = $1
    `;
    const countValues = [session.user.id];
    
    if (walletId) {
      countQuery += ` AND r.wallet_id = $2`;
      countValues.push(walletId);
    }

    const [{ total }] = await sql(countQuery, countValues);

    return Response.json({ 
      roundups, 
      pagination: {
        total: parseInt(total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(total)
      }
    });
  } catch (error) {
    console.error('Error fetching roundups:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Process a round-up (typically called by webhook or transaction processor)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      wallet_id, 
      transaction_id, 
      original_amount, 
      roundup_to = 1.0 
    } = body;

    if (!wallet_id || !original_amount) {
      return Response.json({ 
        error: 'Wallet ID and original amount are required' 
      }, { status: 400 });
    }

    if (original_amount <= 0) {
      return Response.json({ error: 'Original amount must be positive' }, { status: 400 });
    }

    // Calculate round-up amount
    const rounded_amount = Math.ceil(original_amount / roundup_to) * roundup_to;
    const roundup_amount = rounded_amount - original_amount;

    if (roundup_amount <= 0) {
      return Response.json({ error: 'No round-up needed for this amount' }, { status: 400 });
    }

    // Verify wallet belongs to user
    const [wallet] = await sql`
      SELECT id, current_amount 
      FROM savings_wallets 
      WHERE id = ${wallet_id} AND user_id = ${session.user.id}
    `;

    if (!wallet) {
      return Response.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Create round-up record and update wallet balance in a transaction
    const [roundup, updatedWallet] = await sql.transaction([
      sql`
        INSERT INTO roundup_savings (
          user_id,
          wallet_id,
          transaction_id,
          original_amount,
          rounded_amount,
          roundup_amount
        ) VALUES (
          ${session.user.id},
          ${wallet_id},
          ${transaction_id || null},
          ${original_amount},
          ${rounded_amount},
          ${roundup_amount}
        )
        RETURNING *
      `,
      sql`
        UPDATE savings_wallets 
        SET 
          current_amount = current_amount + ${roundup_amount},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${wallet_id}
        RETURNING *
      `
    ]);

    return Response.json({ 
      roundup, 
      wallet: updatedWallet,
      message: `Saved $${roundup_amount.toFixed(2)} from round-up!`
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing roundup:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}