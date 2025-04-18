import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LaborRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const laborId = user?.id;

      const response = await axios.get(
        `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/requests/${laborId}`
      );
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to fetch labor requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (bookingId, status) => {
    try {
      await axios.put(
        `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/update/${bookingId}/${status}`
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.id === bookingId ? { ...req, status, actionTaken: true } : req
        )
      );
    } catch (err) {
      console.error(`Error updating request:`, err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="green" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Labor Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.noRequests}>No requests available.</Text>
      ) : (
        requests.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text>
              <Text style={styles.bold}>Farmer Email:</Text> {request.farmerEmail}
            </Text>
            <Text>
              <Text style={styles.bold}>Start Date:</Text> {request.startDate}
            </Text>
            <Text>
              <Text style={styles.bold}>End Date:</Text> {request.endDate}
            </Text>
            <Text>
              <Text style={styles.bold}>Payment Method:</Text> {request.paymentMethod}
            </Text>
            <Text>
              <Text style={styles.bold}>Status:</Text>{" "}
              <Text style={styles.status}>{request.status}</Text>
            </Text>

            {!request.actionTaken && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAction(request.id, "APPROVED")}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleAction(request.id, "REJECTED")}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  noRequests: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  bold: {
    fontWeight: "600",
  },
  status: {
    fontWeight: "bold",
    color: "#555",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  acceptButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default LaborRequests;
