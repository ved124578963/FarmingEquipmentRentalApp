import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Picker,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LaborInfo = ({ labor, onBack }) => {
  if (!labor) return null;

  const navigation = useNavigation();  // Hook to handle navigation after booking
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookedDates, setBookedDates] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const fetchLaborAvailability = async () => {
      try {
        const response = await axios.get(
          `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/calendar/${labor.id}`
        );
        const marked = {};
        response.data.bookedDates.forEach((date) => {
          marked[date] = {
            marked: true,
            dotColor: "red",
            disableTouchEvent: true,
            selectedColor: "red",
            selected: true,
          };
        });
        setBookedDates(marked);
      } catch (error) {
        console.error("Error fetching labor availability:", error);
        Alert.alert("Error", "Failed to fetch labor availability. Please try again.");
      }
    };

    fetchLaborAvailability();
  }, [labor.id]);

  const handleBookLabor = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const token = await AsyncStorage.getItem("token");

      const requestBody = {
        labor: { id: labor.id },
        farmerId: user.id,
        farmerEmail: user.email,
        startDate,
        endDate,
        paymentMethod,
      };

      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/request",
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const bookingId = response.data.id;

      // Download the receipt PDF
      const receiptResponse = await axios.get(
        `https://famerequipmentrental-springboot-production.up.railway.app/booking/labor/download-receipt/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const uri = FileSystem.documentDirectory + `Labor_Booking_Receipt_${bookingId}.pdf`;
      await FileSystem.writeAsStringAsync(uri, receiptResponse.data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri);

      Alert.alert("Success", "Labor booking request sent successfully!");

      // Navigate to the Home screen or refresh after success
      navigation.navigate("Home"); // Adjust with your route name if different

      // Reset form
      setStartDate("");
      setEndDate("");
      setPaymentMethod("COD");
    } catch (error) {
      console.error("Error during labor booking:", error);
      Alert.alert("Error", "Failed to book labor. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Image
          source={
            labor.profileImage
              ? { uri: labor.profileImage }
              : require("../../assets/images/profile.png")
          }
          style={styles.profileImage}
        />

        <View style={styles.info}>
          <Text style={styles.name}>{labor.name}</Text>
          <Text>
            <Text style={styles.bold}>Skills:</Text> {labor.skills}
          </Text>
          <Text>
            <Text style={styles.bold}>Experience:</Text> {labor.experience} years
          </Text>
          <Text>
            <Text style={styles.bold}>Price Per Day:</Text> ₹{labor.pricePerDay}
          </Text>
          <Text>
            <Text style={styles.bold}>Location:</Text> {labor.location}
          </Text>
          <Text>
            <Text style={styles.bold}>Contact:</Text> {labor.contact}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability Calendar</Text>
        <Calendar
          markedDates={bookedDates}
          theme={{
            selectedDayBackgroundColor: "red",
            todayTextColor: "green",
          }}
        />
      </View>

      <View style={styles.bookingForm}>
        <Text style={styles.sectionTitle}>Book This Labor</Text>

        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />

        <Text style={styles.label}>Payment Method</Text>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="COD" value="COD" />
          <Picker.Item label="Online" value="Online" />
        </Picker>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookLabor}>
          <Text style={styles.bookButtonText}>Hire Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LaborInfo;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    paddingBottom: 100,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#333",
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#444",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  bookingForm: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 10,
  },
  label: {
    marginTop: 10,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
