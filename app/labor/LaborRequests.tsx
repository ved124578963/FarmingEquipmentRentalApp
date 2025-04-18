import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LaborRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = await fetchUser();
        const farmerId = user?.id;

        const response = await axios.get(
          `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/requests/${farmerId}`
        );
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching labor requests:", err);
        setError("Failed to fetch labor requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const markComplete = async (bookingId) => {
    try {
      await axios.put(
        `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/mark-completed/${bookingId}`
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.id === bookingId ? { ...req, status: "COMPLETED" } : req
        )
      );
      Alert.alert("Success", "Marked as Completed");
    } catch (err) {
      console.error("Error marking as complete:", err);
      Alert.alert("Error", "Failed to update request status");
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color="#4B9CD3" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Labor Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.noRequests}>No labor requests found.</Text>
      ) : (
        requests.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text><Text style={styles.label}>Labor Name:</Text> {request.labor.name}</Text>
            <Text><Text style={styles.label}>Skills:</Text> {request.labor.skills}</Text>
            <Text><Text style={styles.label}>Start Date:</Text> {request.startDate}</Text>
            <Text><Text style={styles.label}>End Date:</Text> {request.endDate}</Text>
            <Text>
              <Text style={styles.label}>Status:</Text>{" "}
              <Text style={styles.status}>{request.status}</Text>
            </Text>
            {request.status !== "COMPLETED" && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Mark Complete"
                  onPress={() => markComplete(request.id)}
                  color="#007BFF"
                />
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noRequests: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
    color: "#555",
  },
  buttonContainer: {
    marginTop: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 30,
  },
});

export default LaborRequest;
