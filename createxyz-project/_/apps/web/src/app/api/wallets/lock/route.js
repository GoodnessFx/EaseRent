// Step 4: Wallet Locking Management API
// This handles locking and unlocking savings wallets with penalty system
// Locked wallets cannot be withdrawn from until the target date

import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// POST - Lock or unlock a wallet
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { wallet_id, action, target_date, penalty_percentage } = await request.json();
    
    if (!wallet_id || !action) {
      return Response.json({ 
        error: "Missing required fields: wallet_id, action" 
      }, { status: 400 });
    }

    if (!['lock', 'unlock'].includes(action)) {
      return Response.json({ 
        error: "Invalid action. Must be 'lock' or 'unlock'" 
      }, { status: 400 });
    }

    const userId = session.user.id;

    // Get the wallet details
    const [wallet] = await sql`
      SELECT * FROM savings_wallets 
      WHERE id = ${wallet_id} AND user_id = ${userId}
    `;

    if (!wallet) {
      return Response.json({ 
        error: "Wallet not found or not accessible" 
      }, { status: 404 });
    }

    if (action === 'lock') {
      // Locking the wallet
      if (!target_date) {
        return Response.json({ 
          error: "Target date is required for locking" 
        }, { status: 400 });
      }

      const lockDate = new Date(target_date);
      const now = new Date();
      
      // Validate target date is in the future
      if (lockDate <= now) {
        return Response.json({ 
          error: "Target date must be in the future" 
        }, { status: 400 });
      }

      // Validate penalty percentage (default to 10% if not provided)
      let penaltyPercent = penalty_percentage || 10.0;
      if (penaltyPercent < 0 || penaltyPercent > 50) {
        return Response.json({ 
          error: "Penalty percentage must be between 0 and 50" 
        }, { status: 400 });
      }

      // Update wallet to be locked
      const [lockedWallet] = await sql`
        UPDATE savings_wallets 
        SET 
          is_locked = true,
          target_date = ${lockDate},
          penalty_percentage = ${penaltyPercent},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${wallet_id} AND user_id = ${userId}
        RETURNING *
      `;

      return Response.json({ 
        success: true,
        wallet: lockedWallet,
        message: `Wallet locked until ${lockDate.toLocaleDateString()} with ${penaltyPercent}% early withdrawal penalty`
      });

    } else {
      // Unlocking the wallet
      const now = new Date();
      const targetDate = new Date(wallet.target_date);
      let penaltyAmount = 0;
      let isEarlyWithdrawal = false;

      // Check if it's an early withdrawal (before target date)
      if (targetDate > now && wallet.is_locked) {
        isEarlyWithdrawal = true;
        penaltyAmount = (wallet.current_amount * wallet.penalty_percentage) / 100;
        
        // Apply penalty by reducing current amount
        if (penaltyAmount > 0) {
          await sql`
            UPDATE savings_wallets 
            SET current_amount = current_amount - ${penaltyAmount}
            WHERE id = ${wallet_id}
          `;
        }
      }

      // Unlock the wallet
      const [unlockedWallet] = await sql`
        UPDATE savings_wallets 
        SET 
          is_locked = false,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${wallet_id} AND user_id = ${userId}
        RETURNING *
      `;

      let message = "Wallet unlocked successfully";
      if (isEarlyWithdrawal && penaltyAmount > 0) {
        message = `Wallet unlocked with early withdrawal penalty of $${penaltyAmount.toFixed(2)}`;
      }

      return Response.json({ 
        success: true,
        wallet: unlockedWallet,
        early_withdrawal: isEarlyWithdrawal,
        penalty_applied: penaltyAmount,
        message
      });
    }

  } catch (error) {
    console.error('Error managing wallet lock:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Check wallet lock status and penalty info
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const wallet_id = searchParams.get('wallet_id');
    
    if (!wallet_id) {
      return Response.json({ error: "Missing wallet_id parameter" }, { status: 400 });
    }

    const userId = session.user.id;

    const [wallet] = await sql`
      SELECT 
        id,
        name,
        current_amount,
        target_amount,
        target_date,
        is_locked,
        penalty_percentage,
        created_at,
        updated_at
      FROM savings_wallets 
      WHERE id = ${wallet_id} AND user_id = ${userId}
    `;

    if (!wallet) {
      return Response.json({ 
        error: "Wallet not found or not accessible" 
      }, { status: 404 });
    }

    const now = new Date();
    const targetDate = new Date(wallet.target_date);
    
    // Calculate time remaining and penalty info
    const timeRemaining = Math.max(0, targetDate.getTime() - now.getTime());
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    
    const penaltyAmount = wallet.is_locked && targetDate > now 
      ? (wallet.current_amount * wallet.penalty_percentage) / 100 
      : 0;

    const lockStatus = {
      ...wallet,
      days_remaining: wallet.is_locked ? daysRemaining : 0,
      can_withdraw_without_penalty: !wallet.is_locked || targetDate <= now,
      potential_penalty: penaltyAmount,
      target_date_formatted: targetDate.toLocaleDateString(),
      is_past_target_date: targetDate <= now
    };

    return Response.json({ lockStatus });

  } catch (error) {
    console.error('Error checking wallet lock status:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}