import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F97316',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  static async scheduleMilestoneNotification(goalName, percentage) {
    const messages = {
      25: `🎉 You're 25% closer to your ${goalName} goal! Keep it up!`,
      50: `🎊 Halfway there! You've saved 50% of your ${goalName} target!`,
      75: `🚀 Almost there! 75% of your ${goalName} goal is complete!`,
      100: `🏆 Congratulations! You've reached your ${goalName} goal! Time to celebrate!`,
    };

    const message = messages[percentage];
    if (message) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Milestone Unlocked! 🎉',
          body: message,
          data: { type: 'milestone', goalName, percentage },
        },
        trigger: null, // Send immediately
      });
    }
  }

  static async scheduleNudgeNotification(goalName, daysSinceLastDeposit) {
    const messages = {
      3: `⏰ It's been 3 days since your last deposit to ${goalName}. Ready to add more?`,
      7: `📅 A week has passed since you last contributed to ${goalName}. Let's get back on track!`,
      14: `💪 Two weeks without progress on ${goalName}. You've got this!`,
    };

    const message = messages[daysSinceLastDeposit];
    if (message) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Friendly Reminder 💡',
          body: message,
          data: { type: 'nudge', goalName, daysSinceLastDeposit },
        },
        trigger: null,
      });
    }
  }

  static async scheduleGroupNotification(groupName, message, type = 'group') {
    const titles = {
      group: 'Group Update 👥',
      contribution: 'New Contribution 💰',
      milestone: 'Group Milestone 🎊',
      celebration: 'Celebration Time 🎉',
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: titles[type] || 'ChopLife Update',
        body: message,
        data: { type, groupName },
      },
      trigger: null,
    });
  }

  static async scheduleWeeklyInsight(insight) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weekly Insight 💡',
        body: insight,
        data: { type: 'insight' },
      },
      trigger: null,
    });
  }

  static async scheduleRecurringDepositReminder(goalName, amount) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recurring Deposit 💰',
        body: `Your ₦${amount} deposit for ${goalName} is ready to be processed.`,
        data: { type: 'recurring', goalName, amount },
      },
      trigger: null,
    });
  }

  static async scheduleChallengeNotification(challengeName, timeLeft) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Challenge Update 🏁',
        body: `${challengeName} ends in ${timeLeft}. Keep pushing!`,
        data: { type: 'challenge', challengeName },
      },
      trigger: null,
    });
  }

  static async scheduleCelebrationNotification(achievement) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Achievement Unlocked! 🏆',
        body: achievement,
        data: { type: 'achievement' },
      },
      trigger: null,
    });
  }

  // AI-powered insights
  static async scheduleAIInsight(insight) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Smart Tip from ChopLife 🤖',
        body: insight,
        data: { type: 'ai_insight' },
      },
      trigger: null,
    });
  }

  // Social features
  static async scheduleSocialNotification(type, data) {
    const messages = {
      friend_joined: `${data.friendName} joined your group!`,
      friend_contributed: `${data.friendName} just contributed ₦${data.amount} to ${data.goalName}!`,
      leaderboard: `You're #${data.position} on this week's leaderboard!`,
      challenge_invite: `${data.friendName} challenged you to save ₦${data.amount} in ${data.days} days!`,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Social Update 👥',
        body: messages[type],
        data: { type: 'social', ...data },
      },
      trigger: null,
    });
  }

  // Cancel all notifications
  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get notification history
  static async getNotificationHistory() {
    return await Notifications.getPresentedNotificationsAsync();
  }
}
