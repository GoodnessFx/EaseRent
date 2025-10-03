import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Target, TrendingUp } from 'lucide-react-native';
import GoalCard from '@/components/funding/GoalCard';
import GoalTemplates from '@/components/funding/GoalTemplates';
import CreateGoalForm from '@/components/funding/CreateGoalForm';

export default function SavingsScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('goals'); // 'goals', 'templates', 'create'
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Mock data - in real app, this would come from state management
  const [goals, setGoals] = useState([
    {
      id: '1',
      name: 'Trip to Paris',
      category: 'Travel',
      targetAmount: 500000,
      currentAmount: 150000,
      deadline: '2024-06-15',
      image: null,
      isGroup: false,
    },
    {
      id: '2',
      name: 'New MacBook',
      category: 'Technology',
      targetAmount: 800000,
      currentAmount: 320000,
      deadline: '2024-08-01',
      image: null,
      isGroup: false,
    },
    {
      id: '3',
      name: 'Wedding Fund',
      category: 'Events',
      targetAmount: 2000000,
      currentAmount: 800000,
      deadline: '2024-12-31',
      image: null,
      isGroup: true,
    },
  ]);

  const handleCreateGoal = (template) => {
    setSelectedTemplate(template);
    setView('create');
  };

  const handleCreateCustom = () => {
    setSelectedTemplate(null);
    setView('create');
  };

  const handleSaveGoal = (goalData) => {
    setGoals([...goals, goalData]);
    setView('goals');
  };

  const handleCancelCreate = () => {
    setView('goals');
    setSelectedTemplate(null);
  };

  const handleGoalPress = (goal) => {
    // Navigate to goal details
    console.log('Goal pressed:', goal);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (view === 'templates') {
    return (
      <GoalTemplates
        onSelectTemplate={handleCreateGoal}
        onCreateCustom={handleCreateCustom}
      />
    );
  }

  if (view === 'create') {
    return (
      <CreateGoalForm
        template={selectedTemplate}
        onSave={handleSaveGoal}
        onCancel={handleCancelCreate}
      />
    );
  }

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
            My Goals
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
            Track your progress and achieve your dreams
          </Text>
        </View>

        {/* Overall Progress */}
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
            <TrendingUp size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              Overall Progress
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#64748B' }}>Total Saved</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#F97316' }}>
              {overallProgress.toFixed(1)}%
            </Text>
          </View>
          
          <View
            style={{
              height: 8,
              backgroundColor: '#E2E8F0',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 12,
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${Math.min(overallProgress, 100)}%`,
                backgroundColor: '#F97316',
                borderRadius: 4,
              }}
            />
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
              ₦{totalSaved.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 16, color: '#64748B' }}>
              of ₦{totalTarget.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Goals List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B' }}>
            Your Goals ({goals.length})
          </Text>
          <TouchableOpacity
            onPress={() => setView('templates')}
            style={{
              backgroundColor: '#F97316',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Plus size={16} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', marginLeft: 4 }}>
              New Goal
            </Text>
          </TouchableOpacity>
        </View>

        {goals.length === 0 ? (
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
            <Target size={48} color="#E2E8F0" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginTop: 16, marginBottom: 8 }}>
              No Goals Yet
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>
              Create your first savings goal and start your journey to financial freedom
            </Text>
            <TouchableOpacity
              onPress={() => setView('templates')}
              style={{
                backgroundColor: '#F97316',
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                Create Your First Goal
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onPress={handleGoalPress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}