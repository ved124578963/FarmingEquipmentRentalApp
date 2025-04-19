import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VoiceAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission denied", "Microphone access is required.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      if (uri) {
        uploadAudio(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const uploadAudio = async (uri: string) => {
    try {
      setLoading(true);
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
  
      if (!user || !user.id) {
        Alert.alert("Error", "User information is missing.");
        setLoading(false);
        return;
      }
  
      const fileName = uri.split("/").pop();
      const formData = new FormData();
  
      formData.append("file", {
        uri,
        type: "audio/x-m4a", // or "audio/x-wav" based on backend support
        name: fileName || "recording.webm",
      });
      formData.append("data", JSON.stringify({ farmerId: user.id }));
  
      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/voice-assistant/audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );
  
      const { writeAsStringAsync, documentDirectory } = require("expo-file-system");
      const { Buffer } = require("buffer"); // Import Buffer to handle ArrayBuffer to Base64 conversion

      // Convert ArrayBuffer to Base64
      const base64Data = Buffer.from(response.data).toString("base64");

      const filePath = `${documentDirectory}${fileName || "response.mp3"}`;
      await writeAsStringAsync(filePath, base64Data, {
        encoding: "base64",
      });
  
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: filePath });
      await soundObject.playAsync();
      Alert.alert("Success", "Response played successfully!");
    } catch (error) {
      console.error("Upload error", error);
      Alert.alert("Error", "Failed to upload audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isExpanded ? (
        <TouchableOpacity onPress={toggleExpansion} style={styles.micButton}>
          <FontAwesome name="microphone" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.expandedBox}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isRecording ? "Recording..." : "Voice Assistant"}
            </Text>
            <TouchableOpacity onPress={toggleExpansion}>
              <Text style={styles.closeButton}>✖</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : (
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={[
                styles.recordButton,
                { backgroundColor: isRecording ? "#FF0000" : "#4CAF50" },
              ]}
            >
              <FontAwesome
                name="microphone"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1000,
  },
  micButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  expandedBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    width: 250,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    fontSize: 16,
    color: "#333",
  },
  recordButton: {
    marginTop: 10,
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VoiceAssistant;
