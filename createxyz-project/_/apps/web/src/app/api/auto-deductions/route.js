// Step 3: Auto-Deduction Management API
// This handles creating, reading, updating and deleting automatic deductions
// Auto-deductions automatically transfer money from bank account to savings wallet

import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// GET - Fetch user's auto-deductions
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all auto-deductions for the user with wallet and bank account info
    const autoDeductions = await sql`
      SELECT 
        ad.id,
        ad.amount,
        ad.frequency,
        ad.next_deduction_date,
        ad.is_active,
        ad.created_at,
        sw.name as wallet_name,
        sw.target_amount as wallet_target,
        ba.institution_name,
        ba.account_name,
        ba.mask
      FROM auto_deductions ad
      LEFT JOIN savings_wallets sw ON ad.wallet_id = sw.id
      LEFT JOIN bank_accounts ba ON ad.user_id = ba.user_id AND ba.is_active = true
      WHERE ad.user_id = ${userId}
      ORDER BY ad.created_at DESC
    `;

    return Response.json({ autoDeductions });

  } catch (error) {
    console.error('Error fetching auto-deductions:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new auto-deduction
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { wallet_id, amount, frequency } = await request.json();
    
    // Validate required fields
    if (!wallet_id || !amount || !frequency) {
      return Response.json({ 
        error: "Missing required fields: wallet_id, amount, frequency" 
      }, { status: 400 });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return Response.json({ 
        error: "Amount must be greater than 0" 
      }, { status: 400 });
    }

    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'bi-weekly', 'monthly'];
    if (!validFrequencies.includes(frequency)) {
      return Response.json({ 
        error: "Invalid frequency. Must be: daily, weekly, bi-weekly, or monthly" 
      }, { status: 400 });
    }

    const userId = session.user.id;

    // Verify the wallet belongs to the user
    const [wallet] = await sql`
      SELECT id FROM savings_wallets WHERE id = ${wallet_id} AND user_id = ${userId}
    `;

    if (!wallet) {
      return Response.json({ 
        error: "Wallet not found or not accessible" 
      }, { status: 404 });
    }

    // Verify user has at least one active bank account
    const [bankAccount] = await sql`
      SELECT id FROM bank_accounts WHERE user_id = ${userId} AND is_active = true LIMIT 1
    `;

    if (!bankAccount) {
      return Response.json({ 
        error: "Please connect a bank account first" 
      }, { status: 400 });
    }

    // Calculate next deduction date based on frequency
    const now = new Date();
    let nextDeductionDate;
    
    switch (frequency) {
      case 'daily':
        nextDeductionDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        nextDeductionDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'bi-weekly':
        nextDeductionDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextDeductionDate = new Date(now);
        nextDeductionDate.setMonth(nextDeductionDate.getMonth() + 1);
        break;
      default:
        nextDeductionDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    // Create the auto-deduction
    const [autoDeduction] = await sql`
      INSERT INTO auto_deductions (
        user_id,
        wallet_id,
        amount,
        frequency,
        next_deduction_date,
        is_active
      ) VALUES (
        ${userId},
        ${wallet_id},
        ${amount},
        ${frequency},
        ${nextDeductionDate},
        true
      )
      RETURNING *
    `;

    return Response.json({ 
      success: true,
      autoDeduction,
      message: `Auto-deduction of $${amount} set up for ${frequency} transfers`
    });

  } catch (error) {
    console.error('Error creating auto-deduction:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update auto-deduction
export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, amount, frequency, is_active } = await request.json();
    
    if (!id) {
      return Response.json({ error: "Missing auto-deduction ID" }, { status: 400 });
    }

    const userId = session.user.id;

    // Verify the auto-deduction belongs to the user
    const [existingDeduction] = await sql`
      SELECT id FROM auto_deductions WHERE id = ${id} AND user_id = ${userId}
    `;

    if (!existingDeduction) {
      return Response.json({ 
        error: "Auto-deduction not found or not accessible" 
      }, { status: 404 });
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let values = [];
    
    if (amount !== undefined) {
      if (amount <= 0) {
        return Response.json({ error: "Amount must be greater than 0" }, { status: 400 });
      }
      updateFields.push('amount = $' + (values.length + 1));
      values.push(amount);
    }
    
    if (frequency !== undefined) {
      const validFrequencies = ['daily', 'weekly', 'bi-weekly', 'monthly'];
      if (!validFrequencies.includes(frequency)) {
        return Response.json({ 
          error: "Invalid frequency" 
        }, { status: 400 });
      }
      updateFields.push('frequency = $' + (values.length + 1));
      values.push(frequency);
      
      // Recalculate next deduction date if frequency changed
      const now = new Date();
      let nextDeductionDate;
      
      switch (frequency) {
        case 'daily':
          nextDeductionDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
          nextDeductionDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'bi-weekly':
          nextDeductionDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          nextDeductionDate = new Date(now);
          nextDeductionDate.setMonth(nextDeductionDate.getMonth() + 1);
          break;
      }
      
      updateFields.push('next_deduction_date = $' + (values.length + 1));
      values.push(nextDeductionDate);
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = $' + (values.length + 1));
      values.push(is_active);
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add ID as last parameter
    values.push(id);

    const query = `
      UPDATE auto_deductions 
      SET ${updateFields.join(', ')} 
      WHERE id = $${values.length}
      RETURNING *
    `;

    const [updatedDeduction] = await sql(query, values);

    return Response.json({ 
      success: true,
      autoDeduction: updatedDeduction,
      message: "Auto-deduction updated successfully"
    });

  } catch (error) {
    console.error('Error updating auto-deduction:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove auto-deduction
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: "Missing auto-deduction ID" }, { status: 400 });
    }

    const userId = session.user.id;

    // Verify the auto-deduction belongs to the user and delete it
    const [deletedDeduction] = await sql`
      DELETE FROM auto_deductions 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (!deletedDeduction) {
      return Response.json({ 
        error: "Auto-deduction not found or not accessible" 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true,
      message: "Auto-deduction deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting auto-deduction:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}