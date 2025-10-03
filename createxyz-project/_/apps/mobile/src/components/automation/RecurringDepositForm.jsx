import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar, DollarSign, Repeat, Target } from 'lucide-react-native';

export default function RecurringDepositForm({ goal, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    frequency: 'weekly', // weekly, monthly
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const frequencyOptions = [
    { id: 'weekly', label: 'Weekly', description: 'Every week' },
    { id: 'monthly', label: 'Monthly', description: 'Every month' },
  ];

  const handleSave = () => {
    if (!formData.amount || !formData.startDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const depositData = {
      ...formData,
      amount: parseFloat(formData.amount),
      goalId: goal.id,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
    };

    onSave(depositData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 24 }}>
          Set Up Recurring Deposit
        </Text>

        {/* Goal Info */}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Target size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              {goal.name}
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Target: ₦{goal.targetAmount.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Current: ₦{goal.currentAmount.toLocaleString()}
          </Text>
        </View>

        {/* Amount */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Deposit Amount *
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DollarSign size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              placeholder="0"
              keyboardType="numeric"
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
            />
          </View>
        </View>

        {/* Frequency */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Frequency *
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {frequencyOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFormData({ ...formData, frequency: option.id })}
                style={{
                  flex: 1,
                  backgroundColor: formData.frequency === option.id ? '#F97316' : 'white',
                  borderRadius: 12,
                  padding: 16,
                  marginHorizontal: 4,
                  borderWidth: 1,
                  borderColor: formData.frequency === option.id ? '#F97316' : '#E2E8F0',
                  alignItems: 'center',
                }}
              >
                <Repeat size={20} color={formData.frequency === option.id ? 'white' : '#64748B'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: formData.frequency === option.id ? 'white' : '#64748B',
                    marginTop: 4,
                  }}
                >
                  {option.label}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: formData.frequency === option.id ? 'rgba(255,255,255,0.8)' : '#9CA3AF',
                    textAlign: 'center',
                  }}
                >
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Date */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Start Date *
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
              placeholder="YYYY-MM-DD"
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
            />
          </View>
        </View>

        {/* End Date (Optional) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            End Date (Optional)
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={formData.endDate}
              onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              placeholder="YYYY-MM-DD (Leave empty for ongoing)"
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
            />
          </View>
        </View>

        {/* Summary */}
        <View
          style={{
            backgroundColor: '#F9731620',
            borderRadius: 12,
            padding: 16,
            marginBottom: 32,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Deposit Summary
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 4 }}>
            ₦{formData.amount || '0'} every {formData.frequency === 'weekly' ? 'week' : 'month'}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B' }}>
            Starting: {formData.startDate || 'Not set'}
          </Text>
          {formData.endDate && (
            <Text style={{ fontSize: 14, color: '#64748B' }}>
              Ending: {formData.endDate}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: '#E2E8F0',
              borderRadius: 12,
              padding: 16,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748B' }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              flex: 1,
              backgroundColor: '#F97316',
              borderRadius: 12,
              padding: 16,
              marginLeft: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
              Set Up Deposit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
