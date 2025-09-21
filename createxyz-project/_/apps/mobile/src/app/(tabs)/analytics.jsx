import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineGraph } from 'react-native-graph';
import { BarChart3, TrendingUp, Calendar, DollarSign, PiggyBank, Target } from 'lucide-react-native';
import { useRequireAuth } from '@/utils/auth/useAuth';

export default function Analytics() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;
  const graphWidth = windowWidth - 64;
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock analytics data
  const savingsData = [
    { date: new Date('2024-01-01'), value: 0 },
    { date: new Date('2024-01-15'), value: 45 },
    { date: new Date('2024-02-01'), value: 120 },
    { date: new Date('2024-02-15'), value: 180 },
    { date: new Date('2024-03-01'), value: 250 },
    { date: new Date('2024-03-15'), value: 320 },
    { date: new Date('2024-04-01'), value: 410 },
  ];

  const roundupData = [
    { date: new Date('2024-01-01'), value: 0 },
    { date: new Date('2024-01-15'), value: 15 },
    { date: new Date('2024-02-01'), value: 35 },
    { date: new Date('2024-02-15'), value: 52 },
    { date: new Date('2024-03-01'), value: 78 },
    { date: new Date('2024-03-15'), value: 95 },
    { date: new Date('2024-04-01'), value: 125 },
  ];

  const monthlyStats = {
    totalSaved: 410,
    roundupSavings: 125,
    autoSavings: 285,
    averageDaily: 13.67,
    savingsRate: 8.5,
    goalProgress: 34.2,
  };

  const categoryBreakdown = [
    { category: 'Groceries', amount: 45.50, percentage: 36 },
    { category: 'Restaurants', amount: 32.25, percentage: 26 },
    { category: 'Gas', amount: 28.75, percentage: 23 },
    { category: 'Shopping', amount: 18.50, percentage: 15 },
  ];

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' },
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
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>
            Analytics
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
            Track your savings performance
          </Text>
        </View>

        {/* Period Selector */}
        <View style={{ marginBottom: 32 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                onPress={() => setSelectedPeriod(period.key)}
                style={{
                  backgroundColor: selectedPeriod === period.key ? '#2563EB' : 'white',
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  marginHorizontal: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{
                  color: selectedPeriod === period.key ? 'white' : '#64748B',
                  fontSize: 14,
                  fontWeight: '500',
                }}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            marginBottom: 16 
          }}>
            <View style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <PiggyBank size={20} color="#2563EB" />
                <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                  Total Saved
                </Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                ${monthlyStats.totalSaved}
              </Text>
              <Text style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
                +12.5% vs last month
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              marginLeft: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                  Daily Average
                </Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                ${monthlyStats.averageDaily}
              </Text>
              <Text style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
                +8.2% vs last month
              </Text>
            </View>
          </View>

          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between' 
          }}>
            <View style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <DollarSign size={20} color="#F59E0B" />
                <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                  Savings Rate
                </Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                {monthlyStats.savingsRate}%
              </Text>
              <Text style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
                +2.1% vs last month
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              marginLeft: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Target size={20} color="#8B5CF6" />
                <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                  Goal Progress
                </Text>
              </View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                {monthlyStats.goalProgress}%
              </Text>
              <Text style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>
                On track for June
              </Text>
            </View>
          </View>
        </View>

        {/* Savings Trend Chart */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <BarChart3 size={20} color="#2563EB" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              Savings Trend
            </Text>
          </View>
          <View style={{ height: 200, width: '100%' }}>
            <LineGraph
              points={savingsData}
              color="#2563EB"
              animated={true}
              enablePanGesture={true}
              style={{
                width: '100%',
                height: '100%',
              }}
              xLength={savingsData.length}
              height={200}
              width={graphWidth - 40}
              gradientFillColors={[
                'rgba(37, 99, 235, 0.2)',
                'rgba(37, 99, 235, 0)',
              ]}
            />
          </View>
        </View>

        {/* Round-up vs Auto-save Comparison */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 20 }}>
            Savings Breakdown
          </Text>
          
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Round-up Savings</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>
                ${monthlyStats.roundupSavings}
              </Text>
            </View>
            <View style={{
              height: 8,
              backgroundColor: '#E2E8F0',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <View style={{
                height: '100%',
                width: `${(monthlyStats.roundupSavings / monthlyStats.totalSaved) * 100}%`,
                backgroundColor: '#10B981',
                borderRadius: 4,
              }} />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Auto-save Deposits</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>
                ${monthlyStats.autoSavings}
              </Text>
            </View>
            <View style={{
              height: 8,
              backgroundColor: '#E2E8F0',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <View style={{
                height: '100%',
                width: `${(monthlyStats.autoSavings / monthlyStats.totalSaved) * 100}%`,
                backgroundColor: '#2563EB',
                borderRadius: 4,
              }} />
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 32,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 20 }}>
            Round-ups by Category
          </Text>
          
          {categoryBreakdown.map((item, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#64748B' }}>{item.category}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>
                  ${item.amount}
                </Text>
              </View>
              <View style={{
                height: 6,
                backgroundColor: '#E2E8F0',
                borderRadius: 3,
                overflow: 'hidden'
              }}>
                <View style={{
                  height: '100%',
                  width: `${item.percentage}%`,
                  backgroundColor: index === 0 ? '#2563EB' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#8B5CF6',
                  borderRadius: 3,
                }} />
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
            Insights & Tips
          </Text>
          
          <View style={{
            backgroundColor: '#F0F9FF',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#2563EB',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#1E40AF', marginBottom: 4 }}>
              🎯 Great Progress!
            </Text>
            <Text style={{ fontSize: 14, color: '#1E40AF' }}>
              You're saving 12.5% more than last month. Keep up the momentum!
            </Text>
          </View>

          <View style={{
            backgroundColor: '#F0FDF4',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#10B981',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#065F46', marginBottom: 4 }}>
              💡 Optimization Tip
            </Text>
            <Text style={{ fontSize: 14, color: '#065F46' }}>
              Your grocery round-ups are highest. Consider using a cashback card for extra savings.
            </Text>
          </View>

          <View style={{
            backgroundColor: '#FFFBEB',
            borderRadius: 8,
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: '#F59E0B',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#92400E', marginBottom: 4 }}>
              📈 Goal Projection
            </Text>
            <Text style={{ fontSize: 14, color: '#92400E' }}>
              At your current rate, you'll reach your rent goal 3 days early!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}