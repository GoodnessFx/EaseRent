import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PiggyBank, Target, Calendar, Lock, Unlock, Plus, X, DollarSign } from 'lucide-react-native';
import { useRequireAuth } from '@/utils/auth/useAuth';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function Savings() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletTarget, setNewWalletTarget] = useState('');
  const [newWalletDate, setNewWalletDate] = useState('');

  // Mock data for savings wallets
  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: 'Rent Savings',
      currentAmount: 410,
      targetAmount: 1200,
      targetDate: '2024-06-01',
      isLocked: true,
      penaltyPercentage: 10,
    },
    {
      id: 2,
      name: 'Emergency Fund',
      currentAmount: 250,
      targetAmount: 500,
      targetDate: '2024-08-01',
      isLocked: false,
      penaltyPercentage: 5,
    },
  ]);

  const handleCreateWallet = () => {
    if (!newWalletName || !newWalletTarget) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newWallet = {
      id: Date.now(),
      name: newWalletName,
      currentAmount: 0,
      targetAmount: parseFloat(newWalletTarget),
      targetDate: newWalletDate,
      isLocked: true,
      penaltyPercentage: 10,
    };

    setWallets([...wallets, newWallet]);
    setNewWalletName('');
    setNewWalletTarget('');
    setNewWalletDate('');
    setShowCreateWallet(false);
  };

  const toggleLock = (walletId) => {
    setWallets(wallets.map(wallet => 
      wallet.id === walletId 
        ? { ...wallet, isLocked: !wallet.isLocked }
        : wallet
    ));
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
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
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 32 
          }}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>
                Savings
              </Text>
              <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
                Manage your savings wallets
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCreateWallet(true)}
              style={{
                backgroundColor: '#2563EB',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Savings Wallets */}
          <View style={{ marginBottom: 32 }}>
            {wallets.map((wallet) => {
              const progressPercentage = (wallet.currentAmount / wallet.targetAmount) * 100;
              const daysUntilTarget = wallet.targetDate 
                ? Math.ceil((new Date(wallet.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <View
                  key={wallet.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  {/* Wallet Header */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: 16 
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B' }}>
                        {wallet.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        {wallet.isLocked ? (
                          <Lock size={16} color="#EF4444" />
                        ) : (
                          <Unlock size={16} color="#10B981" />
                        )}
                        <Text style={{ 
                          fontSize: 14, 
                          color: wallet.isLocked ? '#EF4444' : '#10B981',
                          marginLeft: 4 
                        }}>
                          {wallet.isLocked ? 'Locked' : 'Unlocked'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleLock(wallet.id)}
                      style={{
                        backgroundColor: wallet.isLocked ? '#FEE2E2' : '#DCFCE7',
                        borderRadius: 8,
                        padding: 8,
                      }}
                    >
                      {wallet.isLocked ? (
                        <Lock size={20} color="#EF4444" />
                      ) : (
                        <Unlock size={20} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Amount Display */}
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    marginBottom: 16 
                  }}>
                    <View>
                      <Text style={{ fontSize: 14, color: '#64748B' }}>Current Amount</Text>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                        ${wallet.currentAmount}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 14, color: '#64748B' }}>Target Amount</Text>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B' }}>
                        ${wallet.targetAmount}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={{ marginBottom: 16 }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      marginBottom: 8 
                    }}>
                      <Text style={{ fontSize: 14, color: '#64748B' }}>Progress</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#2563EB' }}>
                        {progressPercentage.toFixed(1)}%
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
                        width: `${Math.min(progressPercentage, 100)}%`,
                        backgroundColor: '#2563EB',
                        borderRadius: 4,
                      }} />
                    </View>
                  </View>

                  {/* Target Date */}
                  {wallet.targetDate && (
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      backgroundColor: '#F1F5F9',
                      borderRadius: 8,
                      padding: 12,
                    }}>
                      <Calendar size={16} color="#64748B" />
                      <Text style={{ fontSize: 14, color: '#64748B', marginLeft: 8 }}>
                        Target date: {new Date(wallet.targetDate).toLocaleDateString()}
                        {daysUntilTarget > 0 && ` (${daysUntilTarget} days left)`}
                      </Text>
                    </View>
                  )}

                  {/* Lock Warning */}
                  {wallet.isLocked && (
                    <View style={{
                      backgroundColor: '#FEF2F2',
                      borderRadius: 8,
                      padding: 12,
                      marginTop: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: '#EF4444',
                    }}>
                      <Text style={{ fontSize: 14, color: '#DC2626' }}>
                        Early withdrawal penalty: {wallet.penaltyPercentage}%
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Round-up Settings */}
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
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
              Round-up Settings
            </Text>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>
                Round up to nearest:
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {['$1', '$5', '$10'].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={{
                      flex: 1,
                      backgroundColor: amount === '$1' ? '#2563EB' : '#F1F5F9',
                      borderRadius: 8,
                      padding: 12,
                      marginHorizontal: 4,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '600',
                      color: amount === '$1' ? 'white' : '#64748B'
                    }}>
                      {amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{
              backgroundColor: '#F0F9FF',
              borderRadius: 8,
              padding: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#2563EB',
            }}>
              <Text style={{ fontSize: 14, color: '#1E40AF' }}>
                Every purchase will be rounded up to the nearest dollar, with the difference saved automatically.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Create Wallet Modal */}
        <Modal
          visible={showCreateWallet}
          transparent={true}
          animationType="slide"
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
            <View style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: insets.bottom + 20,
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 24 
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B' }}>
                  Create New Wallet
                </Text>
                <TouchableOpacity onPress={() => setShowCreateWallet(false)}>
                  <X size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Wallet Name *
                </Text>
                <TextInput
                  value={newWalletName}
                  onChangeText={setNewWalletName}
                  placeholder="e.g., Emergency Fund"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Target Amount *
                </Text>
                <TextInput
                  value={newWalletTarget}
                  onChangeText={setNewWalletTarget}
                  placeholder="1200"
                  keyboardType="numeric"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                  Target Date (Optional)
                </Text>
                <TextInput
                  value={newWalletDate}
                  onChangeText={setNewWalletDate}
                  placeholder="YYYY-MM-DD"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={handleCreateWallet}
                style={{
                  backgroundColor: '#2563EB',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  Create Wallet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}