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
import { Calendar, DollarSign, Target, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreateGoalForm({ template, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    targetAmount: template?.defaultTarget || '',
    deadline: '',
    category: template?.category || '',
    image: null,
    isGroup: false,
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
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.targetAmount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      id: Date.now().toString(),
    };

    onSave(goalData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 24 }}>
          {template ? 'Customize Your Goal' : 'Create Custom Goal'}
        </Text>

        {/* Goal Image */}
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
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            ) : (
              <ImageIcon size={32} color="#F97316" />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 8 }}>
            Tap to add goal image
          </Text>
        </View>

        {/* Goal Name */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Goal Name *
          </Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Trip to Paris"
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
            placeholder="Describe your goal..."
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

        {/* Category */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>
            Category
          </Text>
          <TextInput
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
            placeholder="e.g., Travel, Education, Gadgets"
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

        {/* Group Goal Toggle */}
        <View style={{ marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, isGroup: !formData.isGroup })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: formData.isGroup ? '#F97316' : '#E2E8F0',
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: formData.isGroup ? '#F97316' : '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              {formData.isGroup && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#F97316',
                  }}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>
                Group Goal
              </Text>
              <Text style={{ fontSize: 14, color: '#64748B' }}>
                Save together with friends
              </Text>
            </View>
          </TouchableOpacity>
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
              Create Goal
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
