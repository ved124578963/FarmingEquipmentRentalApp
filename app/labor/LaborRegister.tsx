import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LaborRegister = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    experience: "",
    pricePerDay: "",
    location: "",
    pincode: "",
    email: "",
    password: "",
    imageIds: "",
    longitude: "",
    latitude: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFormData((prev) => ({
        ...prev,
        longitude: location.coords.longitude.toString(),
        latitude: location.coords.latitude.toString(),
      }));
    } catch (err) {
      setError("Failed to get location.");
      console.error(err);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.cancelled) {
      setSelectedFile(result);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return "";

    const uri = selectedFile.uri;
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const type = match ? `image/${match[1]}` : `image`;

    const formDataImg = new FormData();
    formDataImg.append("file", {
      uri,
      name: filename,
      type,
    });

    try {
      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/api/files/upload",
        formDataImg,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.imageId;
    } catch (error) {
      console.error("Image Upload Error:", error);
      setError("Failed to upload image.");
      return "";
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await getLocation();
      const imageId = await uploadImage();

      const finalData = {
        ...formData,
        imageIds: imageId ? imageId.toString() : "",
      };

      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/labor/register",
        finalData
      );

      if (response.status === 200) {
        setSuccess("Labor registered successfully!");
        setTimeout(() => navigation.navigate("Login"), 2000);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Labor Registration</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {[
          { name: "name", placeholder: "Full Name" },
          { name: "skills", placeholder: "Skills (comma-separated)" },
          { name: "experience", placeholder: "Experience (in years)", keyboardType: "numeric" },
          { name: "pricePerDay", placeholder: "Price per day (₹)", keyboardType: "numeric" },
          { name: "location", placeholder: "Location" },
          { name: "pincode", placeholder: "Pincode", keyboardType: "numeric" },
          { name: "email", placeholder: "Email", keyboardType: "email-address" },
          { name: "password", placeholder: "Password", secureTextEntry: true },
        ].map((field, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
            keyboardType={field.keyboardType || "default"}
            secureTextEntry={field.secureTextEntry || false}
          />
        ))}

        <TouchableOpacity onPress={handleFileChange} style={styles.uploadButton}>
          <Text style={styles.uploadText}>
            {selectedFile ? "Image Selected" : "Upload Profile Image"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.button, loading && { opacity: 0.6 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already registered?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Login here
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    backgroundColor: "#f0fdf4",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#d1fae5",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#065f46",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: "#000",
  },
  uploadButton: {
    backgroundColor: "#34d399",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#047857",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#4b5563",
  },
  link: {
    color: "#059669",
    fontWeight: "600",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LaborRegister;
