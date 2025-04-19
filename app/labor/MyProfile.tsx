import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const MyProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDataString = await AsyncStorage.getItem("user");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>User data not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>My Profile</Text>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Text style={styles.text}>
            Full Name: {`${user.firstName} ${user.middleName} ${user.lastName}`}
          </Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.mobileNumber}</Text>
          <Text style={styles.text}>Date of Birth: {user.dob}</Text>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          <Text style={styles.text}>Country: {user.country}</Text>
          <Text style={styles.text}>State: {user.state}</Text>
          <Text style={styles.text}>District: {user.district}</Text>
          <Text style={styles.text}>Taluka: {user.taluka}</Text>
          <Text style={styles.text}>Village: {user.village}</Text>
          <Text style={styles.text}>Pincode: {user.pincode}</Text>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Text style={styles.text}>Username: {user.username}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  container: {
    padding: 16,
    backgroundColor: "#0f172a",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 4,
  },
  heading: {
    fontSize: 24,
    color: "#4ade80",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
  },
  text: {
    color: "#f1f5f9",
    marginBottom: 4,
  },
});

export default MyProfile;
