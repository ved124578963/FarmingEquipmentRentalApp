import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

const GetRecommendation = () => {
  const [formData, setFormData] = useState({
    typeOfWork: "",
    farmSize: "",
    latitude: "",
    longitude: "",
  });

  const [recommendations, setRecommendations] = useState([]);
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoordinates();
  }, []);

  const fetchCoordinates = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
    } catch (err) {
      console.error("Location error:", err);
      Alert.alert("Error", "Failed to get location");
    }
  };

  const fetchEquipmentDetails = async (ids) => {
    try {
      const promises = ids.map((id) =>
        axios.get(
          `https://famerequipmentrental-springboot-production.up.railway.app/farmer/equipment/${id}`
        )
      );
      const results = await Promise.all(promises);
      const details = results.map((res) => res.data);
      setEquipmentDetails(details);
    } catch (err) {
      console.error("Equipment fetch error:", err);
      Alert.alert("Error", "Failed to fetch equipment details.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/farmer/equipment/recommend",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const recs = response.data;
        if (!Array.isArray(recs)) {
          throw new Error("Invalid response format: expected an array");
        }
        setRecommendations(recs);
        const ids = recs.map((r) => r.id);
        await fetchEquipmentDetails(ids);
        Alert.alert("Success", "Recommendations fetched successfully!");
      } else {
        throw new Error("Failed to fetch recommendations");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Get Equipment Recommendation</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Type of Work</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.typeOfWork}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, typeOfWork: itemValue })
          }
        >
          <Picker.Item label="Select Type of Work" value="" />
          {[
            "Plowing",
            "Sowing",
            "Irrigation",
            "Fertilizers",
            "Pesticides",
            "Harvesting",
            "Post-Harvesting",
            "Land-Leveling",
            "Mulching",
            "Transport",
            "Green House",
            "Orchard",
            "Fodder Cultivation",
            "Livestock Farming",
            "Other",
          ].map((work) => (
            <Picker.Item key={work} label={work} value={work} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Farm Size</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.farmSize}
          onValueChange={(itemValue) =>
            setFormData({ ...formData, farmSize: itemValue })
          }
        >
          <Picker.Item label="Select Farm Size" value="" />
          <Picker.Item label="Small" value="Small" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Large" value="Large" />
        </Picker>
      </View>

      <Button
        title={loading ? "Loading..." : "Get Recommendation"}
        onPress={handleSubmit}
        color="#4CAF50"
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.spinner}
        />
      )}

      {equipmentDetails.length > 0 && !loading && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.subHeading}>Recommendations:</Text>
          {equipmentDetails.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text>
                <Text style={styles.bold}>Name:</Text> {item.equipment.name}
              </Text>
              <Text>
                <Text style={styles.bold}>Type:</Text>{" "}
                {item.equipment.equipmentType}
              </Text>
              <Text>
                <Text style={styles.bold}>Location:</Text>{" "}
                {item.equipment.location}
              </Text>
              <Text>
                <Text style={styles.bold}>Contact:</Text>{" "}
                {item.equipment.owner.mobileNumber}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    overflow: "hidden",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  recommendationContainer: {
    marginTop: 20,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  bold: {
    fontWeight: "bold",
  },
  spinner: {
    marginTop: 20,
  },
});

export default GetRecommendation;
