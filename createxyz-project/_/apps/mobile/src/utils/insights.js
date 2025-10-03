export class FinancialInsights {
  static analyzeSavingsPattern(transactions) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= lastMonth);
    const weeklyTransactions = transactions.filter(t => new Date(t.date) >= lastWeek);

    const monthlyTotal = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const weeklyTotal = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      monthlyTotal,
      weeklyTotal,
      averageDaily: monthlyTotal / 30,
      averageWeekly: monthlyTotal / 4,
      transactionCount: monthlyTransactions.length,
    };
  }

  static generateInsights(userData, goals, transactions) {
    const insights = [];
    const patterns = this.analyzeSavingsPattern(transactions);

    // Savings velocity insights
    if (patterns.averageDaily > 1000) {
      insights.push({
        type: 'positive',
        title: 'Great Savings Velocity! 🚀',
        message: `You're saving ₦${patterns.averageDaily.toLocaleString()} daily on average. Keep up the momentum!`,
        action: 'Keep saving at this rate',
      });
    } else if (patterns.averageDaily < 500) {
      insights.push({
        type: 'suggestion',
        title: 'Boost Your Savings 💪',
        message: `Try increasing your daily savings to ₦1,000 to reach your goals faster.`,
        action: 'Set up recurring deposits',
      });
    }

    // Goal completion insights
    const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
    const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount);

    if (completedGoals.length > 0) {
      insights.push({
        type: 'celebration',
        title: 'Goal Achiever! 🏆',
        message: `You've completed ${completedGoals.length} goal${completedGoals.length > 1 ? 's' : ''}! Your dedication is paying off.`,
        action: 'Set new goals',
      });
    }

    // Consistency insights
    const daysSinceLastDeposit = this.getDaysSinceLastDeposit(transactions);
    if (daysSinceLastDeposit > 7) {
      insights.push({
        type: 'reminder',
        title: 'Get Back on Track 📈',
        message: `It's been ${daysSinceLastDeposit} days since your last deposit. Small, consistent contributions add up!`,
        action: 'Make a deposit today',
      });
    }

    // Group vs individual performance
    const groupGoals = goals.filter(g => g.isGroup);
    const individualGoals = goals.filter(g => !g.isGroup);

    if (groupGoals.length > 0 && individualGoals.length > 0) {
      const groupProgress = this.calculateAverageProgress(groupGoals);
      const individualProgress = this.calculateAverageProgress(individualGoals);

      if (groupProgress > individualProgress) {
        insights.push({
          type: 'insight',
          title: 'Team Power! 👥',
          message: `You save ${((groupProgress - individualProgress) * 100).toFixed(1)}% faster in groups. Social saving works!`,
          action: 'Join more groups',
        });
      }
    }

    // Time-based insights
    const shortTermGoals = goals.filter(g => this.getDaysToDeadline(g.deadline) < 30);
    const longTermGoals = goals.filter(g => this.getDaysToDeadline(g.deadline) > 365);

    if (shortTermGoals.length > 0) {
      insights.push({
        type: 'tip',
        title: 'Short-term Focus 🎯',
        message: `You have ${shortTermGoals.length} goal${shortTermGoals.length > 1 ? 's' : ''} due soon. Consider prioritizing these.`,
        action: 'Review deadlines',
      });
    }

    // Spending pattern insights
    const spendingInsights = this.analyzeSpendingPatterns(transactions);
    if (spendingInsights.weekendSpending > spendingInsights.weekdaySpending * 1.5) {
      insights.push({
        type: 'tip',
        title: 'Weekend Spending Alert 📊',
        message: `You spend ${((spendingInsights.weekendSpending / spendingInsights.weekdaySpending - 1) * 100).toFixed(0)}% more on weekends.`,
        action: 'Plan weekend activities',
      });
    }

    return insights;
  }

  static calculateAverageProgress(goals) {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => {
      return sum + (goal.currentAmount / goal.targetAmount);
    }, 0);
    return totalProgress / goals.length;
  }

  static getDaysSinceLastDeposit(transactions) {
    if (transactions.length === 0) return 0;
    const lastTransaction = transactions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const daysDiff = (new Date() - new Date(lastTransaction.date)) / (1000 * 60 * 60 * 24);
    return Math.floor(daysDiff);
  }

  static getDaysToDeadline(deadline) {
    if (!deadline) return Infinity;
    const daysDiff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
    return Math.ceil(daysDiff);
  }

  static analyzeSpendingPatterns(transactions) {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= lastMonth);
    
    let weekendSpending = 0;
    let weekdaySpending = 0;
    let weekendCount = 0;
    let weekdayCount = 0;

    monthlyTransactions.forEach(transaction => {
      const dayOfWeek = new Date(transaction.date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (isWeekend) {
        weekendSpending += transaction.amount;
        weekendCount++;
      } else {
        weekdaySpending += transaction.amount;
        weekdayCount++;
      }
    });

    return {
      weekendSpending: weekendCount > 0 ? weekendSpending / weekendCount : 0,
      weekdaySpending: weekdayCount > 0 ? weekdaySpending / weekdayCount : 0,
      totalSpending: weekendSpending + weekdaySpending,
    };
  }

  static generateWeeklyReport(goals, transactions) {
    const patterns = this.analyzeSavingsPattern(transactions);
    const insights = this.generateInsights({}, goals, transactions);
    
    return {
      summary: {
        totalSaved: patterns.monthlyTotal,
        goalsActive: goals.filter(g => g.currentAmount < g.targetAmount).length,
        goalsCompleted: goals.filter(g => g.currentAmount >= g.targetAmount).length,
        averageProgress: this.calculateAverageProgress(goals),
      },
      insights: insights.slice(0, 3), // Top 3 insights
      recommendations: this.generateRecommendations(goals, patterns),
    };
  }

  static generateRecommendations(goals, patterns) {
    const recommendations = [];

    // Recurring deposit recommendation
    if (patterns.averageDaily > 0) {
      recommendations.push({
        type: 'automation',
        title: 'Set Up Recurring Deposits',
        description: `Automate ₦${Math.round(patterns.averageDaily)} daily deposits to maintain your savings momentum.`,
        priority: 'high',
      });
    }

    // Group savings recommendation
    const individualGoals = goals.filter(g => !g.isGroup);
    if (individualGoals.length > 2) {
      recommendations.push({
        type: 'social',
        title: 'Try Group Savings',
        description: 'Create a group goal with friends to save faster and stay motivated.',
        priority: 'medium',
      });
    }

    // Goal prioritization
    const overdueGoals = goals.filter(g => {
      if (!g.deadline) return false;
      return this.getDaysToDeadline(g.deadline) < 0;
    });

    if (overdueGoals.length > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Review Overdue Goals',
        description: `${overdueGoals.length} goal${overdueGoals.length > 1 ? 's' : ''} ${overdueGoals.length > 1 ? 'are' : 'is'} past deadline. Consider adjusting targets.`,
        priority: 'urgent',
      });
    }

    return recommendations;
  }

  static predictGoalCompletion(goal, currentRate) {
    if (currentRate <= 0) return null;
    
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const daysToComplete = Math.ceil(remainingAmount / currentRate);
    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + daysToComplete);
    
    return {
      daysToComplete,
      predictedDate,
      isOnTrack: !goal.deadline || predictedDate <= new Date(goal.deadline),
    };
  }
}
