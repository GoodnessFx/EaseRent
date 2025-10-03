import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Target, Calendar, DollarSign, Users } from 'lucide-react-native';

export default function GoalCard({ goal, onPress }) {
  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <TouchableOpacity
      onPress={() => onPress(goal)}
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
      {/* Goal Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        {goal.image && (
          <Image
            source={{ uri: goal.image }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
            {goal.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>
            {goal.category}
          </Text>
        </View>
        {goal.isGroup && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Users size={16} color="#F97316" />
            <Text style={{ fontSize: 12, color: '#F97316', marginLeft: 4 }}>
              Group
            </Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#64748B' }}>Progress</Text>
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

      {/* Goal Details */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DollarSign size={16} color="#64748B" />
          <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
            ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
          </Text>
        </View>
        {goal.deadline && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={16} color="#64748B" />
            <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
              {new Date(goal.deadline).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
