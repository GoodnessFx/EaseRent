import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Lock
} from 'lucide-react-native';
import { useRequireAuth, useAuth } from '@/utils/auth/useAuth';
import useUser from '@/utils/auth/useUser';

export default function Settings() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { data: user } = useUser();
  
  const [notifications, setNotifications] = useState({
    milestones: true,
    roundups: false,
    weeklyReports: true,
    marketing: false,
  });

  const [security, setSecurity] = useState({
    biometric: true,
    twoFactor: false,
  });

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => signOut()
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, showChevron = true }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#1E293B' }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: '#64748B', marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (showChevron && <ChevronRight size={20} color="#94A3B8" />)}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={{
      fontSize: 14,
      fontWeight: '600',
      color: '#64748B',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#F8FAFC',
    }}>
      {title}
    </Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar style="dark" />
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>
            Settings
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Section */}
        <SectionHeader title="Profile" />
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<User size={20} color="#2563EB" />}
            title="Personal Information"
            subtitle={user?.email || 'Update your profile details'}
            onPress={() => Alert.alert('Profile', 'Profile editing would open here')}
          />
          <SettingItem
            icon={<Mail size={20} color="#10B981" />}
            title="Email Address"
            subtitle={user?.email || 'No email set'}
            onPress={() => Alert.alert('Email', 'Email editing would open here')}
          />
          <SettingItem
            icon={<Phone size={20} color="#F59E0B" />}
            title="Phone Number"
            subtitle="Add your phone number"
            onPress={() => Alert.alert('Phone', 'Phone number editing would open here')}
          />
        </View>

        {/* Notifications Section */}
        <SectionHeader title="Notifications" />
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<Bell size={20} color="#8B5CF6" />}
            title="Milestone Alerts"
            subtitle="Get notified when you reach savings goals"
            rightElement={
              <Switch
                value={notifications.milestones}
                onValueChange={(value) => setNotifications({...notifications, milestones: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={notifications.milestones ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Bell size={20} color="#8B5CF6" />}
            title="Round-up Notifications"
            subtitle="Get notified for each round-up transaction"
            rightElement={
              <Switch
                value={notifications.roundups}
                onValueChange={(value) => setNotifications({...notifications, roundups: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={notifications.roundups ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Bell size={20} color="#8B5CF6" />}
            title="Weekly Reports"
            subtitle="Receive weekly savings summaries"
            rightElement={
              <Switch
                value={notifications.weeklyReports}
                onValueChange={(value) => setNotifications({...notifications, weeklyReports: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={notifications.weeklyReports ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Bell size={20} color="#8B5CF6" />}
            title="Marketing Updates"
            subtitle="Receive product updates and tips"
            rightElement={
              <Switch
                value={notifications.marketing}
                onValueChange={(value) => setNotifications({...notifications, marketing: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={notifications.marketing ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
        </View>

        {/* Security Section */}
        <SectionHeader title="Security & Privacy" />
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<Lock size={20} color="#EF4444" />}
            title="Biometric Authentication"
            subtitle="Use Face ID or fingerprint to unlock"
            rightElement={
              <Switch
                value={security.biometric}
                onValueChange={(value) => setSecurity({...security, biometric: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={security.biometric ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Shield size={20} color="#10B981" />}
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightElement={
              <Switch
                value={security.twoFactor}
                onValueChange={(value) => setSecurity({...security, twoFactor: value})}
                trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
                thumbColor={security.twoFactor ? '#FFFFFF' : '#FFFFFF'}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={<Shield size={20} color="#10B981" />}
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy', 'Privacy policy would open here')}
          />
          <SettingItem
            icon={<Shield size={20} color="#10B981" />}
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Terms', 'Terms of service would open here')}
          />
        </View>

        {/* Banking Section */}
        <SectionHeader title="Banking & Payments" />
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<CreditCard size={20} color="#2563EB" />}
            title="Connected Accounts"
            subtitle="Manage your linked bank accounts"
            onPress={() => Alert.alert('Accounts', 'This would navigate to accounts tab')}
          />
          <SettingItem
            icon={<CreditCard size={20} color="#2563EB" />}
            title="Round-up Settings"
            subtitle="Configure automatic round-ups"
            onPress={() => Alert.alert('Round-ups', 'Round-up settings would open here')}
          />
          <SettingItem
            icon={<CreditCard size={20} color="#2563EB" />}
            title="Auto-save Settings"
            subtitle="Configure automatic deposits"
            onPress={() => Alert.alert('Auto-save', 'Auto-save settings would open here')}
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="Support" />
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<HelpCircle size={20} color="#F59E0B" />}
            title="Help Center"
            subtitle="Get answers to common questions"
            onPress={() => Alert.alert('Help', 'Help center would open here')}
          />
          <SettingItem
            icon={<HelpCircle size={20} color="#F59E0B" />}
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => Alert.alert('Support', 'Contact form would open here')}
          />
          <SettingItem
            icon={<HelpCircle size={20} color="#F59E0B" />}
            title="App Version"
            subtitle="1.0.0 (Build 1)"
            showChevron={false}
          />
        </View>

        {/* Sign Out */}
        <View style={{ backgroundColor: 'white', marginBottom: 24 }}>
          <SettingItem
            icon={<LogOut size={20} color="#EF4444" />}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            showChevron={false}
          />
        </View>

        {/* App Info */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <Text style={{ 
            fontSize: 14, 
            color: '#94A3B8', 
            textAlign: 'center',
            lineHeight: 20 
          }}>
            EaseRent helps you save for rent with automatic round-ups and smart savings.
          </Text>
          <Text style={{ 
            fontSize: 12, 
            color: '#CBD5E1', 
            textAlign: 'center',
            marginTop: 8 
          }}>
            Made with ❤️ for renters everywhere
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}