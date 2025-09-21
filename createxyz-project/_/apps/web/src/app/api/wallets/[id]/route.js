import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

// Get a specific wallet
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const [wallet] = await sql`
      SELECT 
        id,
        name,
        target_amount,
        current_amount,
        target_date,
        is_locked,
        penalty_percentage,
        created_at,
        updated_at
      FROM savings_wallets 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (!wallet) {
      return Response.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return Response.json({ wallet });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update a wallet
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, target_amount, target_date, is_locked, penalty_percentage } = body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (target_amount !== undefined) {
      if (target_amount <= 0) {
        return Response.json({ error: 'Target amount must be positive' }, { status: 400 });
      }
      updates.push(`target_amount = $${paramCount++}`);
      values.push(target_amount);
    }
    if (target_date !== undefined) {
      updates.push(`target_date = $${paramCount++}`);
      values.push(target_date);
    }
    if (is_locked !== undefined) {
      updates.push(`is_locked = $${paramCount++}`);
      values.push(is_locked);
    }
    if (penalty_percentage !== undefined) {
      updates.push(`penalty_percentage = $${paramCount++}`);
      values.push(penalty_percentage);
    }

    if (updates.length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, session.user.id);

    const query = `
      UPDATE savings_wallets 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const [wallet] = await sql(query, values);

    if (!wallet) {
      return Response.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return Response.json({ wallet });
  } catch (error) {
    console.error('Error updating wallet:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a wallet
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if wallet has any savings before deleting
    const [wallet] = await sql`
      SELECT current_amount 
      FROM savings_wallets 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (!wallet) {
      return Response.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (wallet.current_amount > 0) {
      return Response.json({ 
        error: 'Cannot delete wallet with savings. Please withdraw funds first.' 
      }, { status: 400 });
    }

    await sql`
      DELETE FROM savings_wallets 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    return Response.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}