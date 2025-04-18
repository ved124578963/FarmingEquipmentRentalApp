import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState("farmer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        selectedRole === "farmer"
          ? "https://famerequipmentrental-springboot-production.up.railway.app/farmer/register"
          : "https://famerequipmentrental-springboot-production.up.railway.app/labor/register";

      await axios.post(endpoint, formData);
      Alert.alert("Signup Successful", "Please login now.");
      router.replace("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>FarmRent</Text>
        <View style={styles.roleSelection}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === "farmer" && styles.selectedRoleButton]}
            onPress={() => setSelectedRole("farmer")}
          >
            <Text style={[styles.roleButtonText, selectedRole === "farmer" && styles.selectedRoleButtonText]}>Farmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === "labor" && styles.selectedRoleButton]}
            onPress={() => setSelectedRole("labor")}
          >
            <Text style={[styles.roleButtonText, selectedRole === "labor" && styles.selectedRoleButtonText]}>Laborer</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {selectedRole === "farmer" ? (
          <>
            {[
              "username",
              "password",
              "firstName",
              "middleName",
              "lastName",
              "country",
              "state",
              "district",
              "taluka",
              "village",
              "pincode",
              "longitude",
              "latitude",
              "dob",
              "landmark",
              "mobileNumber",
              "email",
              "profileImgId",
            ].map((field) => (
              <TextInput
                key={field}
                placeholder={field}
                style={styles.input}
                value={formData[field] || ""}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            ))}
          </>
        ) : (
          <>
            {[
              "name",
              "skills",
              "experience",
              "pricePerDay",
              "location",
              "pincode",
              "longitude",
              "latitude",
              "imageIds",
              "email",
              "password",
            ].map((field) => (
              <TextInput
                key={field}
                placeholder={field}
                style={styles.input}
                value={formData[field] || ""}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            ))}
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.linkText} onPress={() => router.replace("/login")}>Login</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4CAF50",
  },
  roleSelection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  selectedRoleButton: {
    backgroundColor: "#4CAF50",
  },
  roleButtonText: {
    color: "#000",
  },
  selectedRoleButtonText: {
    color: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
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
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
  linkText: {
    color: "#4CAF50",
    textDecorationLine: "underline",
  },
});

export default Signup;
