import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Users, Crown, Search } from 'lucide-react-native';
import GroupCard from '@/components/groups/GroupCard';
import CreateGroupForm from '@/components/groups/CreateGroupForm';

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState('groups'); // 'groups', 'create'
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from state management
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Paris Trip Squad',
      description: 'Saving for our dream vacation to Paris',
      targetAmount: 2000000,
      currentAmount: 800000,
      deadline: '2024-06-15',
      memberCount: 4,
      avatar: null,
      isPrivate: true,
      recentActivity: 'Sarah contributed ₦50,000',
    },
    {
      id: '2',
      name: 'Wedding Fund',
      description: 'Our special day savings',
      targetAmount: 5000000,
      currentAmount: 2500000,
      deadline: '2024-12-31',
      memberCount: 2,
      avatar: null,
      isPrivate: true,
      recentActivity: 'Milestone: 50% complete!',
    },
    {
      id: '3',
      name: 'Tech Upgrade Crew',
      description: 'Latest gadgets and tech gear',
      targetAmount: 1000000,
      currentAmount: 300000,
      deadline: '2024-09-01',
      memberCount: 6,
      avatar: null,
      isPrivate: false,
      recentActivity: 'Mike joined the group',
    },
  ]);

  const handleCreateGroup = (groupData) => {
    setGroups([...groups, groupData]);
    setView('groups');
  };

  const handleCancelCreate = () => {
    setView('groups');
  };

  const handleGroupPress = (group) => {
    // Navigate to group details/chat
    console.log('Group pressed:', group);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (view === 'create') {
    return (
      <CreateGroupForm
        onSave={handleCreateGroup}
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
            ChopLife Groups
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
            Save together, achieve more
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Search size={20} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search groups..."
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: '#1E293B',
            }}
          />
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
            <Users size={20} color="#F97316" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginLeft: 8 }}>
              Your Groups
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                {groups.length}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Active Groups</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F97316' }}>
                {groups.reduce((sum, group) => sum + group.memberCount, 0)}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Total Members</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
                ₦{groups.reduce((sum, group) => sum + group.currentAmount, 0).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>Group Savings</Text>
            </View>
          </View>
        </View>

        {/* Groups List */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B' }}>
            Your Groups ({filteredGroups.length})
          </Text>
          <TouchableOpacity
            onPress={() => setView('create')}
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
              Create Group
            </Text>
          </TouchableOpacity>
        </View>

        {filteredGroups.length === 0 ? (
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
            <Users size={48} color="#E2E8F0" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginTop: 16, marginBottom: 8 }}>
              {searchQuery ? 'No Groups Found' : 'No Groups Yet'}
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first group and start saving with friends'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => setView('create')}
                style={{
                  backgroundColor: '#F97316',
                  borderRadius: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                  Create Your First Group
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onPress={handleGroupPress}
              isAdmin={true} // Mock - in real app, check user role
            />
          ))
        )}

        {/* Join Public Groups Section */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
            Discover Public Groups
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
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
                backgroundColor: '#F9731620',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Search size={24} color="#F97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
                Browse Public Groups
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>
                Join groups created by other ChopLife users
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}