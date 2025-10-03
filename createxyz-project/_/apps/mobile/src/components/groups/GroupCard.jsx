import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Users, Target, DollarSign, Calendar, Crown } from 'lucide-react-native';

export default function GroupCard({ group, onPress, isAdmin = false }) {
  const progressPercentage = (group.currentAmount / group.targetAmount) * 100;
  
  return (
    <TouchableOpacity
      onPress={() => onPress(group)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Group Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {group.avatar && (
          <Image
            source={{ uri: group.avatar }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
              {group.name}
            </Text>
            {isAdmin && (
              <Crown size={16} color="#F97316" style={{ marginLeft: 8 }} />
            )}
          </View>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>
            {group.description}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Users size={16} color="#F97316" />
          <Text style={{ fontSize: 12, color: '#F97316', marginLeft: 4 }}>
            {group.memberCount}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#64748B' }}>Group Progress</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#F97316' }}>
            {progressPercentage.toFixed(1)}%
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: '#E2E8F0',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${Math.min(progressPercentage, 100)}%`,
              backgroundColor: '#F97316',
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* Group Details */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DollarSign size={16} color="#64748B" />
          <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
            ₦{group.currentAmount.toLocaleString()} / ₦{group.targetAmount.toLocaleString()}
          </Text>
        </View>
        {group.deadline && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={16} color="#64748B" />
            <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
              {new Date(group.deadline).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {/* Recent Activity */}
      {group.recentActivity && (
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
          <Text style={{ fontSize: 12, color: '#64748B' }}>
            {group.recentActivity}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
