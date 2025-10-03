import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TrendingUp, Target, Users, Lightbulb, BarChart3 } from 'lucide-react-native';
import { FinancialInsights } from '@/utils/insights';

export default function InsightsDashboard({ goals, transactions }) {
  const [insights, setInsights] = useState([]);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    // Generate insights based on current data
    const generatedInsights = FinancialInsights.generateInsights({}, goals, transactions);
    const report = FinancialInsights.generateWeeklyReport(goals, transactions);
    
    setInsights(generatedInsights);
    setWeeklyReport(report);
  }, [goals, transactions]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <TrendingUp size={20} color="#10B981" />;
      case 'suggestion':
        return <Lightbulb size={20} color="#F59E0B" />;
      case 'celebration':
        return <Target size={20} color="#8B5CF6" />;
      case 'reminder':
        return <Users size={20} color="#EF4444" />;
      default:
        return <BarChart3 size={20} color="#64748B" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return '#10B981';
      case 'suggestion':
        return '#F59E0B';
      case 'celebration':
        return '#8B5CF6';
      case 'reminder':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const renderInsight = (insight, index) => (
    <View
      key={index}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
        {getInsightIcon(insight.type)}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
            {insight.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', lineHeight: 20 }}>
            {insight.message}
          </Text>
        </View>
      </View>
      {insight.action && (
        <TouchableOpacity
          style={{
            backgroundColor: `${getInsightColor(insight.type)}20`,
            borderRadius: 8,
            padding: 8,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: getInsightColor(insight.type) }}>
            {insight.action}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRecommendation = (recommendation, index) => (
    <View
      key={index}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: recommendation.priority === 'urgent' ? '#EF4444' : 
                          recommendation.priority === 'high' ? '#F59E0B' : '#10B981',
          marginRight: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 }}>
          {recommendation.title}
        </Text>
        <Text style={{ fontSize: 12, color: '#64748B' }}>
          {recommendation.description}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1E293B' }}>
          Financial Insights
        </Text>
        <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
          AI-powered insights to help you save smarter
        </Text>
      </View>

      {/* Period Selector */}
      <View style={{ flexDirection: 'row', marginBottom: 24 }}>
        {['week', 'month', 'year'].map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={{
              flex: 1,
              backgroundColor: selectedPeriod === period ? '#F97316' : 'white',
              borderRadius: 12,
              padding: 12,
              marginHorizontal: 4,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: selectedPeriod === period ? '#F97316' : '#E2E8F0',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: selectedPeriod === period ? 'white' : '#64748B',
                textTransform: 'capitalize',
              }}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weekly Summary */}
      {weeklyReport && (
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
            <BarChart3 size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Summary
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                ₦{weeklyReport.summary.totalSaved.toLocaleString()}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Total Saved</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F97316' }}>
                {weeklyReport.summary.goalsActive}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Active Goals</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
                {weeklyReport.summary.goalsCompleted}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Completed</Text>
            </View>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 }}>
              Overall Progress
            </Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#F97316' }}>
              {(weeklyReport.summary.averageProgress * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      )}

      {/* AI Insights */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
          AI Insights
        </Text>
        {insights.length === 0 ? (
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
            <Lightbulb size={48} color="#E2E8F0" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginTop: 16, marginBottom: 8 }}>
              No Insights Yet
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>
              Start saving to get personalized insights
            </Text>
          </View>
        ) : (
          insights.map(renderInsight)
        )}
      </View>

      {/* Recommendations */}
      {weeklyReport?.recommendations && weeklyReport.recommendations.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
            Recommendations
          </Text>
          {weeklyReport.recommendations.map(renderRecommendation)}
        </View>
      )}

      {/* Quick Actions */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
          Quick Actions
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#F97316',
              borderRadius: 12,
              padding: 16,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            <Target size={20} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', marginTop: 4 }}>
              New Goal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#10B981',
              borderRadius: 12,
              padding: 16,
              marginHorizontal: 4,
              alignItems: 'center',
            }}
          >
            <Users size={20} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', marginTop: 4 }}>
              Join Group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#3B82F6',
              borderRadius: 12,
              padding: 16,
              marginLeft: 8,
              alignItems: 'center',
            }}
          >
            <TrendingUp size={20} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', marginTop: 4 }}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
