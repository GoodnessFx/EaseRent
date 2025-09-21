import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all wallets for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all wallets for the user with enhanced lock status information
    const wallets = await sql`
      SELECT 
        sw.id,
        sw.name,
        sw.target_amount,
        sw.current_amount,
        sw.target_date,
        sw.is_locked,
        sw.penalty_percentage,
        sw.created_at,
        sw.updated_at,
        COUNT(ad.id) as auto_deduction_count,
        COALESCE(SUM(CASE WHEN ad.is_active THEN ad.amount ELSE 0 END), 0) as total_auto_deduction_amount
      FROM savings_wallets sw
      LEFT JOIN auto_deductions ad ON sw.id = ad.wallet_id
      WHERE sw.user_id = ${session.user.id}
      GROUP BY sw.id, sw.name, sw.target_amount, sw.current_amount, sw.target_date, 
               sw.is_locked, sw.penalty_percentage, sw.created_at, sw.updated_at
      ORDER BY sw.created_at DESC
    `;

    // Add calculated fields for each wallet
    const enrichedWallets = wallets.map((wallet) => {
      const now = new Date();
      const targetDate = new Date(wallet.target_date);

      // Calculate time remaining and penalty info
      const timeRemaining = Math.max(0, targetDate.getTime() - now.getTime());
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

      const penaltyAmount =
        wallet.is_locked && targetDate > now
          ? (wallet.current_amount * wallet.penalty_percentage) / 100
          : 0;

      const progressPercentage =
        wallet.target_amount > 0
          ? Math.min(100, (wallet.current_amount / wallet.target_amount) * 100)
          : 0;

      return {
        ...wallet,
        progress_percentage: progressPercentage,
        days_remaining: wallet.is_locked ? daysRemaining : 0,
        can_withdraw_without_penalty: !wallet.is_locked || targetDate <= now,
        potential_penalty: penaltyAmount,
        target_date_formatted: targetDate.toLocaleDateString(),
        is_past_target_date: targetDate <= now,
        remaining_amount: Math.max(
          0,
          wallet.target_amount - wallet.current_amount,
        ),
        lock_status: wallet.is_locked
          ? targetDate > now
            ? "locked"
            : "unlocked_past_date"
          : "unlocked",
      };
    });

    return Response.json({ wallets: enrichedWallets });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create a new savings wallet
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      target_amount,
      target_date,
      penalty_percentage = 10.0,
    } = body;

    if (!name || !target_amount) {
      return Response.json(
        { error: "Name and target amount are required" },
        { status: 400 },
      );
    }

    if (target_amount <= 0) {
      return Response.json(
        { error: "Target amount must be positive" },
        { status: 400 },
      );
    }

    const [wallet] = await sql`
      INSERT INTO savings_wallets (
        user_id,
        name,
        target_amount,
        target_date,
        penalty_percentage,
        is_locked,
        current_amount
      ) VALUES (
        ${session.user.id},
        ${name},
        ${target_amount},
        ${target_date || null},
        ${penalty_percentage},
        true,
        0.00
      )
      RETURNING *
    `;

    return Response.json({ wallet }, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
