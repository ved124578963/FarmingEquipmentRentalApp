import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: "#4CAF50",
                tabBarInactiveTintColor: "#666",
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    height: Platform.OS === "ios" ? 85 : 60,
                    paddingBottom: Platform.OS === "ios" ? 25 : 10,
                    paddingTop: 10,
                },
                headerStyle: {
                    backgroundColor: "#4CAF50",
                },
                headerTintColor: "#fff",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="user" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
