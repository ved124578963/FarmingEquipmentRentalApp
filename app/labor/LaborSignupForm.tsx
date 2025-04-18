import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";

const LaborSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    skills: "",
    experience: "",
    pricePerDay: "",
    location: "",
    pincode: "",
    longitude: "",
    latitude: "",
    imageIds: "", // comma-separated image IDs
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/labor/register",
        {
          ...formData,
          experience: Number(formData.experience),
          pricePerDay: parseFloat(formData.pricePerDay),
        }
      );

      Alert.alert("Success", "Laborer registered successfully!");
      router.push("/login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Registration failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Laborer Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(value) => handleChange("gender", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(value) => handleChange("phone", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={formData.skills}
        onChangeText={(value) => handleChange("skills", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Experience (in years)"
        keyboardType="numeric"
        value={formData.experience}
        onChangeText={(value) => handleChange("experience", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price Per Day"
        keyboardType="numeric"
        value={formData.pricePerDay}
        onChangeText={(value) => handleChange("pricePerDay", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={formData.location}
        onChangeText={(value) => handleChange("location", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        keyboardType="numeric"
        value={formData.pincode}
        onChangeText={(value) => handleChange("pincode", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={formData.longitude}
        onChangeText={(value) => handleChange("longitude", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={formData.latitude}
        onChangeText={(value) => handleChange("latitude", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Image IDs (comma-separated)"
        value={formData.imageIds}
        onChangeText={(value) => handleChange("imageIds", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4CAF50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LaborSignupForm;
