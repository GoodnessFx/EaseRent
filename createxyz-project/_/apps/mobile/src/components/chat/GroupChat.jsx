import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Smile, Image as ImageIcon, Mic } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function GroupChat({ group, currentUser }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Welcome to the group! Let\'s start saving together 🎉',
      user: { name: 'System', avatar: null },
      timestamp: new Date().toISOString(),
      type: 'system',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        user: currentUser,
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const message = {
        id: Date.now().toString(),
        text: '',
        image: result.assets[0].uri,
        user: currentUser,
        timestamp: new Date().toISOString(),
        type: 'image',
      };
      setMessages([...messages, message]);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message) => {
    const isCurrentUser = message.user.id === currentUser.id;
    const isSystem = message.type === 'system';

    if (isSystem) {
      return (
        <View key={message.id} style={{ alignItems: 'center', marginVertical: 8 }}>
          <Text style={{ 
            fontSize: 12, 
            color: '#64748B', 
            backgroundColor: '#F1F5F9',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}>
            {message.text}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={message.id}
        style={{
          flexDirection: 'row',
          marginVertical: 4,
          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            maxWidth: '80%',
            backgroundColor: isCurrentUser ? '#F97316' : '#F1F5F9',
            borderRadius: 16,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          {!isCurrentUser && (
            <View style={{ marginRight: 8 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#E2E8F0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B' }}>
                  {message.user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          <View style={{ flex: 1 }}>
            {message.image ? (
              <Image
                source={{ uri: message.image }}
                style={{ width: 200, height: 150, borderRadius: 8 }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: isCurrentUser ? 'white' : '#1E293B',
                }}
              >
                {message.text}
              </Text>
            )}
            <Text
              style={{
                fontSize: 12,
                color: isCurrentUser ? 'rgba(255,255,255,0.7)' : '#64748B',
                marginTop: 4,
              }}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
          {group.name}
        </Text>
        <Text style={{ fontSize: 14, color: '#64748B' }}>
          {group.memberCount} members • {group.currentAmount.toLocaleString()} saved
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Message Input */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={handleImagePicker}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F1F5F9',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <ImageIcon size={20} color="#64748B" />
        </TouchableOpacity>

        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={{
            flex: 1,
            backgroundColor: '#F1F5F9',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            marginRight: 8,
          }}
          multiline
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F97316',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
