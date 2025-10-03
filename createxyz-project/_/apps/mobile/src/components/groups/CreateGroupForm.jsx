import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Users, DollarSign, Calendar, Image as ImageIcon, Lock, Globe } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreateGroupForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    avatar: null,
    isPrivate: true,
    inviteCode: '',
  });

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, inviteCode: code });
  };

  const handleSave = () => {
    if (!formData.name || !formData.targetAmount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const groupData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      memberCount: 1,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
      inviteCode: formData.inviteCode || generateInviteCode(),
    };

    onSave(groupData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 24 }}>
          Create ChopLife Group
        </Text>

        {/* Group Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#E2E8F0',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#F97316',
              borderStyle: 'dashed',
            }}
          >
            {formData.avatar ? (
              <Image
                source={{ uri: formData.avatar }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            ) : (
              <ImageIcon size={32} color="#F97316" />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>
            Tap to add group avatar
          </Text>
        </View>

        {/* Group Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Group Name *
          </Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Paris Trip Squad"
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Description
          </Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="What's this group saving for?"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              textAlignVertical: 'top',
            }}
          />
        </View>

        {/* Target Amount */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Target Amount *
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DollarSign size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={formData.targetAmount}
              onChangeText={(text) => setFormData({ ...formData, targetAmount: text })}
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

        {/* Deadline */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Target Date
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calendar size={20} color="#64748B" style={{ marginRight: 8 }} />
            <TextInput
              value={formData.deadline}
              onChangeText={(text) => setFormData({ ...formData, deadline: text })}
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

        {/* Privacy Setting */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Privacy
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, isPrivate: true })}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: formData.isPrivate ? '#F97316' : 'white',
                borderRadius: 12,
                padding: 16,
                marginRight: 8,
                borderWidth: 1,
                borderColor: formData.isPrivate ? '#F97316' : '#E2E8F0',
              }}
            >
              <Lock size={20} color={formData.isPrivate ? 'white' : '#64748B'} />
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: formData.isPrivate ? 'white' : '#64748B',
                marginLeft: 8 
              }}>
                Private
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormData({ ...formData, isPrivate: false })}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: !formData.isPrivate ? '#F97316' : 'white',
                borderRadius: 12,
                padding: 16,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: !formData.isPrivate ? '#F97316' : '#E2E8F0',
              }}
            >
              <Globe size={20} color={!formData.isPrivate ? 'white' : '#64748B'} />
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                color: !formData.isPrivate ? 'white' : '#64748B',
                marginLeft: 8 
              }}>
                Public
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Code */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Invite Code
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={formData.inviteCode}
              onChangeText={(text) => setFormData({ ...formData, inviteCode: text })}
              placeholder="Auto-generated"
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                marginRight: 8,
              }}
            />
            <TouchableOpacity
              onPress={generateInviteCode}
              style={{
                backgroundColor: '#F97316',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                Generate
              </Text>
            </TouchableOpacity>
          </View>
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
              Create Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
