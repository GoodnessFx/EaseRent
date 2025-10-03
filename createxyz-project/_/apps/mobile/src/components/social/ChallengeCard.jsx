import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Trophy, Users, Clock, Target } from 'lucide-react-native';

export default function ChallengeCard({ challenge, onPress, onJoin }) {
  const timeLeft = challenge.daysLeft;
  const progressPercentage = (challenge.currentAmount / challenge.targetAmount) * 100;
  
  return (
    <TouchableOpacity
      onPress={() => onPress(challenge)}
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
      {/* Challenge Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#F9731620',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Trophy size={24} color="#F97316" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
            {challenge.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>
            {challenge.description}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={16} color="#F59E0B" />
            <Text style={{ fontSize: 12, color: '#F59E0B', marginLeft: 4 }}>
              {timeLeft} days left
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#64748B' }}>Challenge Progress</Text>
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

      {/* Challenge Details */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Target size={16} color="#64748B" />
          <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
            ₦{challenge.currentAmount.toLocaleString()} / ₦{challenge.targetAmount.toLocaleString()}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Users size={16} color="#64748B" />
          <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 4 }}>
            {challenge.participantCount} participants
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        onPress={() => onJoin(challenge)}
        style={{
          backgroundColor: challenge.isJoined ? '#10B981' : '#F97316',
          borderRadius: 12,
          padding: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
          {challenge.isJoined ? 'Joined' : 'Join Challenge'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
