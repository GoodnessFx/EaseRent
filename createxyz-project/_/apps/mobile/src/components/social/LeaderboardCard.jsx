import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Trophy, Medal, Award, Crown } from 'lucide-react-native';

export default function LeaderboardCard({ user, rank, onPress }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Award size={24} color="#CD7F32" />;
      default:
        return <Trophy size={24} color="#64748B" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#64748B';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(user)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Rank */}
      <View style={{ alignItems: 'center', marginRight: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: getRankColor(rank) }}>
          #{rank}
        </Text>
        {getRankIcon(rank)}
      </View>

      {/* User Info */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
            />
          ) : (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B' }}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
            {user.name}
          </Text>
          {user.isCurrentUser && (
            <View
              style={{
                backgroundColor: '#F97316',
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 2,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '600', color: 'white' }}>
                YOU
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 14, color: '#64748B' }}>
          {user.goalsCompleted} goals • {user.groupsJoined} groups
        </Text>
      </View>

      {/* Stats */}
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F97316' }}>
          ₦{user.totalSaved.toLocaleString()}
        </Text>
        <Text style={{ fontSize: 12, color: '#64748B' }}>
          saved this week
        </Text>
      </View>
    </TouchableOpacity>
  );
}
