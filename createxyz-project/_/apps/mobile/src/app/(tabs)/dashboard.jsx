import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// NOTE: Temporarily remove native chart to avoid Expo Go issues
// import { LineGraph } from "react-native-graph";
import {
  PiggyBank,
  Target,
  TrendingUp,
  Plus,
  DollarSign,
} from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, signIn } = useAuth();
  const { data: user, loading } = useUser();
  const windowWidth = Dimensions.get("window").width;
  const graphWidth = windowWidth - 64;

  // Mock data for savings progress
  const [savingsData, setSavingsData] = useState([
    { date: new Date("2024-01-01"), value: 0 },
    { date: new Date("2024-01-15"), value: 45 },
    { date: new Date("2024-02-01"), value: 120 },
    { date: new Date("2024-02-15"), value: 180 },
    { date: new Date("2024-03-01"), value: 250 },
    { date: new Date("2024-03-15"), value: 320 },
    { date: new Date("2024-04-01"), value: 410 },
  ]);

  const currentSavings = 410;
  const targetAmount = 1200;
  const progressPercentage = (currentSavings / targetAmount) * 100;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={{ marginTop: 16, color: "#64748B" }}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
          paddingHorizontal: 32,
        }}
      >
        <StatusBar style="dark" />
        <PiggyBank size={80} color="#F97316" />
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#1E293B",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Welcome to ChopLife
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#64748B",
            marginTop: 12,
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          Chop Life Easy - Save, plan, and enjoy life together with friends
        </Text>
        <TouchableOpacity
          onPress={signIn}
          style={{
            backgroundColor: "#F97316",
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 12,
            marginTop: 32,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
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
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "#1E293B" }}>
            ChopLife
          </Text>
          <Text style={{ fontSize: 16, color: "#64748B", marginTop: 4 }}>
            Welcome back, {user?.name || user?.email || "there"}!
          </Text>
        </View>

        {/* Savings Overview Cards */}
        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 16,
                padding: 20,
                marginRight: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <PiggyBank size={20} color="#F97316" />
                <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                  Current Savings
                </Text>
              </View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#1E293B" }}
              >
                ₦{currentSavings}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 16,
                padding: 20,
                marginLeft: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Target size={20} color="#F97316" />
                <Text style={{ fontSize: 14, color: "#64748B", marginLeft: 8 }}>
                  Target Amount
                </Text>
              </View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#1E293B" }}
              >
                ₦{targetAmount}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#1E293B" }}
              >
                Progress to Goal
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#F97316" }}
              >
                {progressPercentage.toFixed(1)}%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#E2E8F0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(progressPercentage, 100)}%`,
                  backgroundColor: "#F97316",
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>
              ₦{targetAmount - currentSavings} remaining to reach your goal
            </Text>
          </View>
        </View>

        {/* Savings Chart */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TrendingUp size={20} color="#F97316" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1E293B",
                marginLeft: 8,
              }}
            >
              Savings Progress
            </Text>
          </View>
          <View style={{
            height: 200,
            width: "100%",
            backgroundColor: "#F1F5F9",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Text style={{ color: "#64748B" }}>Chart placeholder</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#1E293B",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginRight: 8,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Plus size={24} color="#F97316" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#1E293B",
                  marginTop: 8,
                }}
              >
                Add Money
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 4,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <DollarSign size={24} color="#F97316" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#1E293B",
                  marginTop: 8,
                }}
              >
                Set Goal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginLeft: 8,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <PiggyBank size={24} color="#F97316" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#1E293B",
                  marginTop: 8,
                }}
              >
                View History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#1E293B",
              marginBottom: 16,
            }}
          >
            Recent Activity
          </Text>
          <View style={{ space: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "500", color: "#1E293B" }}
                >
                  Round-up from Coffee Shop
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B" }}>
                  Today, 2:30 PM
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#10B981" }}
              >
                +₦0.75
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "500", color: "#1E293B" }}
                >
                  Auto-save deposit
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B" }}>
                  Yesterday, 12:00 PM
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#10B981" }}
              >
                +₦25.00
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: "#E2E8F0" }} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 14, fontWeight: "500", color: "#1E293B" }}
                >
                  Round-up from Grocery Store
                </Text>
                <Text style={{ fontSize: 12, color: "#64748B" }}>
                  2 days ago, 6:45 PM
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#10B981" }}
              >
                +₦1.25
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
