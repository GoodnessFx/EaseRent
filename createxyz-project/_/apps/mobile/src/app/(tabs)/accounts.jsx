import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Plus, Building, Eye, EyeOff, Trash2, CheckCircle } from 'lucide-react-native';
import { useRequireAuth } from '@/utils/auth/useAuth';

export default function Accounts() {
  useRequireAuth();
  const insets = useSafeAreaInsets();
  const [showBalances, setShowBalances] = useState(false);

  // Mock data for connected bank accounts
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      accountId: 'acc_123456',
      institutionName: 'Chase Bank',
      accountName: 'Chase Checking',
      accountType: 'checking',
      mask: '1234',
      balance: 2450.75,
      isActive: true,
      provider: 'plaid',
      lastSync: '2024-04-01T10:30:00Z',
    },
    {
      id: 2,
      accountId: 'acc_789012',
      institutionName: 'Bank of America',
      accountName: 'BofA Savings',
      accountType: 'savings',
      mask: '5678',
      balance: 8920.50,
      isActive: true,
      provider: 'plaid',
      lastSync: '2024-04-01T09:15:00Z',
    },
    {
      id: 3,
      accountId: 'acc_345678',
      institutionName: 'Wells Fargo',
      accountName: 'Wells Credit Card',
      accountType: 'credit',
      mask: '9012',
      balance: -1250.25,
      isActive: false,
      provider: 'plaid',
      lastSync: '2024-03-28T14:20:00Z',
    },
  ]);

  const handleConnectAccount = () => {
    Alert.alert(
      'Connect Bank Account',
      'This would open Plaid Link to connect your bank account securely.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Opening Plaid Link...') },
      ]
    );
  };

  const handleDisconnectAccount = (accountId) => {
    Alert.alert(
      'Disconnect Account',
      'Are you sure you want to disconnect this account? This will stop automatic round-ups.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: () => {
            setAccounts(accounts.map(acc => 
              acc.id === accountId ? { ...acc, isActive: false } : acc
            ));
          }
        },
      ]
    );
  };

  const handleReconnectAccount = (accountId) => {
    setAccounts(accounts.map(acc => 
      acc.id === accountId ? { ...acc, isActive: true, lastSync: new Date().toISOString() } : acc
    ));
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking': return '#2563EB';
      case 'savings': return '#10B981';
      case 'credit': return '#F59E0B';
      default: return '#64748B';
    }
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'checking': return <CreditCard size={20} color="#2563EB" />;
      case 'savings': return <Building size={20} color="#10B981" />;
      case 'credit': return <CreditCard size={20} color="#F59E0B" />;
      default: return <CreditCard size={20} color="#64748B" />;
    }
  };

  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    return balance < 0 ? `-₦${absBalance.toFixed(2)}` : `₦${absBalance.toFixed(2)}`;
  };

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
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 32 
        }}>
          <View>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>
              Accounts
            </Text>
            <Text style={{ fontSize: 16, color: '#64748B', marginTop: 4 }}>
              Manage your connected bank accounts
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowBalances(!showBalances)}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {showBalances ? (
              <EyeOff size={24} color="#64748B" />
            ) : (
              <Eye size={24} color="#64748B" />
            )}
          </TouchableOpacity>
        </View>

        {/* Connect New Account Button */}
        <TouchableOpacity
          onPress={handleConnectAccount}
          style={{
            backgroundColor: '#2563EB',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Plus size={24} color="white" />
          <Text style={{ 
            color: 'white', 
            fontSize: 16, 
            fontWeight: '600',
            marginLeft: 8 
          }}>
            Connect Bank Account
          </Text>
        </TouchableOpacity>

        {/* Connected Accounts */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 16 }}>
            Connected Accounts
          </Text>
          {accounts.map((account) => (
            <View
              key={account.id}
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
                opacity: account.isActive ? 1 : 0.6,
              }}
            >
              {/* Account Header */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16 
              }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    {getAccountTypeIcon(account.accountType)}
                    <Text style={{ 
                      fontSize: 18, 
                      fontWeight: '600', 
                      color: '#1E293B',
                      marginLeft: 8 
                    }}>
                      {account.institutionName}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#64748B' }}>
                    {account.accountName} •••• {account.mask}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {account.isActive ? (
                    <CheckCircle size={20} color="#10B981" />
                  ) : (
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#EF4444',
                    }} />
                  )}
                </View>
              </View>

              {/* Account Type Badge */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                marginBottom: 16 
              }}>
                <View style={{
                  backgroundColor: `${getAccountTypeColor(account.accountType)}20`,
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '500',
                    color: getAccountTypeColor(account.accountType),
                    textTransform: 'capitalize'
                  }}>
                    {account.accountType}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#64748B', marginLeft: 12 }}>
                  via {account.provider}
                </Text>
              </View>

              {/* Balance */}
              {showBalances && (
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 4 }}>
                    Current Balance
                  </Text>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: 'bold', 
                    color: account.balance < 0 ? '#EF4444' : '#1E293B'
                  }}>
                    {formatBalance(account.balance)}
                  </Text>
                </View>
              )}

              {/* Last Sync */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, color: '#64748B' }}>
                  Last synced: {new Date(account.lastSync).toLocaleDateString()} at{' '}
                  {new Date(account.lastSync).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>

              {/* Account Actions */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {account.isActive ? (
                  <>
                    <TouchableOpacity
                      onPress={() => handleDisconnectAccount(account.id)}
                      style={{
                        flex: 1,
                        backgroundColor: '#FEE2E2',
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 8,
                      }}
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={{ 
                        color: '#EF4444', 
                        fontSize: 14, 
                        fontWeight: '500',
                        marginLeft: 4 
                      }}>
                        Disconnect
                      </Text>
                    </TouchableOpacity>
                    <View style={{
                      flex: 1,
                      backgroundColor: '#DCFCE7',
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      marginLeft: 8,
                    }}>
                      <Text style={{ 
                        color: '#10B981', 
                        fontSize: 14, 
                        fontWeight: '500' 
                      }}>
                        Round-ups Active
                      </Text>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleReconnectAccount(account.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#2563EB',
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      color: 'white', 
                      fontSize: 14, 
                      fontWeight: '500' 
                    }}>
                      Reconnect Account
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Status Message */}
              {!account.isActive && (
                <View style={{
                  backgroundColor: '#FEF2F2',
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: '#EF4444',
                }}>
                  <Text style={{ fontSize: 14, color: '#DC2626' }}>
                    Account disconnected. Round-ups are paused for this account.
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Security Info */}
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
            Security & Privacy
          </Text>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
              🔒 Bank-level encryption
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B' }}>
              Your banking data is protected with 256-bit encryption
            </Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
              🏦 Read-only access
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B' }}>
              We can only view your transactions, never move money
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
              🛡️ Powered by Plaid
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B' }}>
              Trusted by thousands of financial apps worldwide
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}