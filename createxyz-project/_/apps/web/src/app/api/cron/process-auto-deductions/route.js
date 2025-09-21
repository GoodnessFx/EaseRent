// Step 5: Auto-Deduction Processor (CRON Job)
// This endpoint should be called regularly (e.g., daily) to process scheduled auto-deductions
// It finds due deductions and transfers money from bank accounts to savings wallets

import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Get current date
    const now = new Date();
    
    console.log(`Starting auto-deduction processing at ${now.toISOString()}`);

    // Find all auto-deductions that are due for processing
    const dueDeductions = await sql`
      SELECT 
        ad.id,
        ad.user_id,
        ad.wallet_id,
        ad.amount,
        ad.frequency,
        ad.next_deduction_date,
        sw.name as wallet_name,
        sw.current_amount as wallet_current_amount,
        ba.account_id,
        ba.institution_name,
        ba.access_token
      FROM auto_deductions ad
      JOIN savings_wallets sw ON ad.wallet_id = sw.id
      JOIN bank_accounts ba ON ad.user_id = ba.user_id AND ba.is_active = true
      WHERE ad.is_active = true 
        AND ad.next_deduction_date <= ${now}
      ORDER BY ad.next_deduction_date ASC
    `;

    console.log(`Found ${dueDeductions.length} due auto-deductions to process`);

    const processedDeductions = [];
    const failedDeductions = [];

    for (const deduction of dueDeductions) {
      try {
        // In a real implementation, you would:
        // 1. Use Plaid API to transfer money from bank account
        // 2. Handle bank API responses and errors
        // 3. Update wallet balance only if transfer succeeds
        
        // For this demo, we'll simulate successful transfers
        console.log(`Processing deduction ${deduction.id}: $${deduction.amount} for user ${deduction.user_id}`);

        // Update wallet balance (simulate successful transfer)
        await sql`
          UPDATE savings_wallets 
          SET 
            current_amount = current_amount + ${deduction.amount},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${deduction.wallet_id}
        `;

        // Calculate next deduction date based on frequency
        let nextDeductionDate;
        const currentDate = new Date(deduction.next_deduction_date);
        
        switch (deduction.frequency) {
          case 'daily':
            nextDeductionDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
            break;
          case 'weekly':
            nextDeductionDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case 'bi-weekly':
            nextDeductionDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            break;
          case 'monthly':
            nextDeductionDate = new Date(currentDate);
            nextDeductionDate.setMonth(nextDeductionDate.getMonth() + 1);
            break;
          default:
            nextDeductionDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        // Update auto-deduction with next scheduled date
        await sql`
          UPDATE auto_deductions 
          SET next_deduction_date = ${nextDeductionDate}
          WHERE id = ${deduction.id}
        `;

        // Record the transaction for history
        // Note: In production, you'd get actual transaction data from bank
        await sql`
          INSERT INTO transactions (
            user_id,
            bank_account_id,
            transaction_id,
            amount,
            description,
            category,
            transaction_date
          ) VALUES (
            ${deduction.user_id},
            (SELECT id FROM bank_accounts WHERE user_id = ${deduction.user_id} AND is_active = true LIMIT 1),
            ${'auto_' + deduction.id + '_' + Date.now()},
            ${-deduction.amount}, -- Negative because it's leaving the bank account
            ${'Auto-deduction to ' + deduction.wallet_name},
            'Auto-save',
            ${now}
          )
          ON CONFLICT (transaction_id) DO NOTHING
        `;

        processedDeductions.push({
          id: deduction.id,
          amount: deduction.amount,
          wallet_name: deduction.wallet_name,
          next_deduction: nextDeductionDate
        });

        console.log(`Successfully processed deduction ${deduction.id}`);

      } catch (deductionError) {
        console.error(`Failed to process deduction ${deduction.id}:`, deductionError);
        
        failedDeductions.push({
          id: deduction.id,
          amount: deduction.amount,
          error: deductionError.message
        });

        // Optionally: Mark deduction as failed or retry later
        // For now, we'll just log the error and continue
      }
    }

    const summary = {
      processed_count: processedDeductions.length,
      failed_count: failedDeductions.length,
      processed_deductions: processedDeductions,
      failed_deductions: failedDeductions,
      processed_at: now.toISOString()
    };

    console.log('Auto-deduction processing summary:', summary);

    return Response.json({ 
      success: true,
      summary,
      message: `Processed ${processedDeductions.length} auto-deductions, ${failedDeductions.length} failed`
    });

  } catch (error) {
    console.error('Error in auto-deduction processing:', error);
    return Response.json({ 
      error: "Failed to process auto-deductions",
      details: error.message 
    }, { status: 500 });
  }
}

// GET - Get processing status and next due deductions
export async function GET(request) {
  try {
    const now = new Date();
    
    // Get upcoming auto-deductions
    const upcomingDeductions = await sql`
      SELECT 
        ad.id,
        ad.amount,
        ad.frequency,
        ad.next_deduction_date,
        ad.is_active,
        sw.name as wallet_name,
        u.email as user_email
      FROM auto_deductions ad
      JOIN savings_wallets sw ON ad.wallet_id = sw.id
      JOIN users u ON ad.user_id = u.id
      WHERE ad.is_active = true
      ORDER BY ad.next_deduction_date ASC
      LIMIT 20
    `;

    // Get count of overdue deductions
    const [overdueCount] = await sql`
      SELECT COUNT(*) as count
      FROM auto_deductions
      WHERE is_active = true AND next_deduction_date < ${now}
    `;

    // Get processing statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_active_deductions,
        SUM(amount) as total_monthly_amount,
        COUNT(DISTINCT user_id) as users_with_auto_deductions
      FROM auto_deductions
      WHERE is_active = true
    `;

    return Response.json({ 
      upcoming_deductions: upcomingDeductions,
      overdue_count: overdueCount.count,
      statistics: stats[0] || {},
      current_time: now.toISOString()
    });

  } catch (error) {
    console.error('Error getting auto-deduction status:', error);
    return Response.json({ 
      error: "Failed to get processing status" 
    }, { status: 500 });
  }
}