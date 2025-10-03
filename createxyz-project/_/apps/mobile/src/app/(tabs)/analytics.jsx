import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Activity, 
  TrendingUp, 
  Bell, 
  Trophy, 
  MessageCircle, 
  DollarSign,
  Calendar,
  Target
} from 'lucide-react-native';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'notifications', 'transactions', 'achievements'

  // Mock data - in real app, this would come from state management
  const activities = [
    {
      id: '1',
      type: 'milestone',
      title: 'Milestone Unlocked! 🎉',
      description: 'You\'ve hit 50% of your Paris Trip goal!',
      timestamp: '2 hours ago',
      icon: Target,
      color: '#F97316',
    },
    {
      id: '2',
      type: 'contribution',
      title: 'New Contribution',
      description: 'Sarah contributed ₦50,000 to Paris Trip Squad',
      timestamp: '4 hours ago',
      icon: DollarSign,
      color: '#10B981',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked! 🏆',
      description: 'First Group Goal - You completed your first group savings goal!',
      timestamp: '1 day ago',
      icon: Trophy,
      color: '#8B5CF6',
    },
    {
      id: '4',
      type: 'notification',
      title: 'Friendly Reminder 💡',
      description: 'It\'s been 3 days since your last deposit to MacBook fund',
      timestamp: '2 days ago',
      icon: Bell,
      color: '#F59E0B',
    },
    {
      id: '5',
      type: 'chat',
      title: 'New Message',
      description: 'Mike: "Great progress everyone! We\'re almost there!"',
      timestamp: '3 days ago',
      icon: MessageCircle,
      color: '#3B82F6',
    },
    {
      id: '6',
      type: 'insight',
      title: 'Weekly Insight 💡',
      description: 'You save 25% faster when you\'re part of a group',
      timestamp: '1 week ago',
      icon: TrendingUp,
      color: '#EC4899',
    },
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true;
    return activity.type === activeTab;
  });

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return (
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${activity.color}20`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconComponent size={20} color={activity.color} />
      </View>
    );
  };

  const renderActivity = (activity) => (
    <TouchableOpacity
      key={activity.id}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {getActivityIcon(activity)}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
          {activity.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 20 }}>
          {activity.description}
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
          {activity.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const tabs = [
    { id: 'all', label: 'All', count: activities.length },
    { id: 'notifications', label: 'Notifications', count: activities.filter(a => a.type === 'notification').length },
    { id: 'transactions', label: 'Transactions', count: activities.filter(a => a.type === 'contribution').length },
    { id: 'achievements', label: 'Achievements', count: activities.filter(a => a.type === 'achievement').length },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E293B' }}>
            Activity
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
            Your savings journey and achievements
          </Text>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Activity size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              This Week
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                {activities.filter(a => a.type === 'contribution').length}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Contributions</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F97316' }}>
                {activities.filter(a => a.type === 'milestone').length}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Milestones</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
                {activities.filter(a => a.type === 'achievement').length}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? '#F97316' : 'white',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: activeTab === tab.id ? 'white' : '#64748B',
                }}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={{
                    backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : '#F97316',
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: activeTab === tab.id ? 'white' : 'white',
                    }}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Activities List */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
            Recent Activity
          </Text>
          
          {filteredActivities.length === 0 ? (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 40,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Activity size={48} color="#E2E8F0" />
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginTop: 16, marginBottom: 8 }}>
                No Activity Yet
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>
                Start saving to see your activity here
              </Text>
            </View>
          ) : (
            filteredActivities.map(renderActivity)
          )}
        </View>

        {/* Insights Section */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <TrendingUp size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              Weekly Insights
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 20 }}>
            You're saving 25% faster this week compared to last week. 
            Your group contributions are driving this improvement!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}