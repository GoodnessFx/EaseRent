import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { 
  Plane, 
  Heart, 
  GraduationCap, 
  Home, 
  Car, 
  Smartphone, 
  Gamepad2, 
  Camera,
  Plus
} from 'lucide-react-native';

const goalTemplates = [
  {
    id: 'vacation',
    name: 'Vacation Fund',
    icon: Plane,
    color: '#3B82F6',
    description: 'Save for your dream vacation',
    category: 'Travel',
    defaultTarget: 500000,
  },
  {
    id: 'wedding',
    name: 'Wedding Goals',
    icon: Heart,
    color: '#EC4899',
    description: 'Plan your perfect wedding',
    category: 'Events',
    defaultTarget: 2000000,
  },
  {
    id: 'education',
    name: 'Education Fund',
    icon: GraduationCap,
    color: '#8B5CF6',
    description: 'Invest in your future',
    category: 'Education',
    defaultTarget: 1000000,
  },
  {
    id: 'house',
    name: 'Home Purchase',
    icon: Home,
    color: '#10B981',
    description: 'Save for your dream home',
    category: 'Housing',
    defaultTarget: 5000000,
  },
  {
    id: 'car',
    name: 'Car Fund',
    icon: Car,
    color: '#F59E0B',
    description: 'Get your dream car',
    category: 'Transportation',
    defaultTarget: 3000000,
  },
  {
    id: 'gadgets',
    name: 'Tech Gadgets',
    icon: Smartphone,
    color: '#6366F1',
    description: 'Latest tech and gadgets',
    category: 'Technology',
    defaultTarget: 200000,
  },
  {
    id: 'gaming',
    name: 'Gaming Setup',
    icon: Gamepad2,
    color: '#EF4444',
    description: 'Build your gaming rig',
    category: 'Entertainment',
    defaultTarget: 150000,
  },
  {
    id: 'photography',
    name: 'Photography Gear',
    icon: Camera,
    color: '#84CC16',
    description: 'Professional camera equipment',
    category: 'Hobbies',
    defaultTarget: 300000,
  },
];

export default function GoalTemplates({ onSelectTemplate, onCreateCustom }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 }}>
          Choose Your Goal
        </Text>
        <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 24 }}>
          Pick a template or create your own custom goal
        </Text>

        {/* Custom Goal Option */}
        <TouchableOpacity
          onPress={onCreateCustom}
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: '#F97316',
            borderStyle: 'dashed',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Plus size={32} color="#F97316" />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#F97316', marginTop: 8 }}>
            Create Custom Goal
          </Text>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
            Set your own unique savings target
          </Text>
        </TouchableOpacity>

        {/* Template Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {goalTemplates.map((template) => {
            const IconComponent = template.icon;
            return (
              <TouchableOpacity
                key={template.id}
                onPress={() => onSelectTemplate(template)}
                style={{
                  width: '48%',
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${template.color}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <IconComponent size={24} color={template.color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B', textAlign: 'center' }}>
                  {template.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4 }}>
                  {template.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#F97316', marginTop: 4 }}>
                  ₦{template.defaultTarget.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
