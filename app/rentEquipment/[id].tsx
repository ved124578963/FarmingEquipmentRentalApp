import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Calendar } from "react-native-calendars";

const RentEquipment = () => {
    const { id } = useLocalSearchParams(); // Equipment ID from route
    const [equipment, setEquipment] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();
    const userId = user?.id; // Replace with actual logged-in user ID

    useEffect(() => {
        fetchEquipmentDetails();
    }, [id]);

    const fetchEquipmentDetails = async () => {
        try {
            const response = await axios.get(
                `https://famerequipmentrental-springboot-production.up.railway.app/farmer/equipment/${id}`
            );
            setEquipment(response.data);
            setMainImage(response.data.imageUrls[0]);

            const calendarResponse = await axios.get(
                `https://famerequipmentrental-springboot-production.up.railway.app/booking/calendar/${id}`
            );
            setBookedDates(calendarResponse.data.bookedDates);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch equipment details.");
        } finally {
            setLoading(false);
        }
    };

    const handleRentNow = async () => {
        if (!startDate || !endDate) {
            return Alert.alert(
                "Missing Dates",
                "Please select both start and end dates."
            );
        }

        const requestBody = {
            equipmentId: id,
            borrowerId: userId,
            startDate,
            endDate,
            paymentMethod,
        };

        try {
            await axios.post(
                "https://famerequipmentrental-springboot-production.up.railway.app/booking/request",
                requestBody
            );
            Alert.alert("Success", "Booking request submitted.");
        } catch (error) {
            Alert.alert("Error", "Failed to book equipment.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (!equipment) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Equipment not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{
                    uri: `https://famerequipmentrental-springboot-production.up.railway.app${mainImage}`,
                }}
                style={styles.image}
            />

            <ScrollView horizontal style={styles.thumbnailContainer}>
                {equipment.imageUrls.map((url, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setMainImage(url)}
                    >
                        <Image
                            source={{
                                uri: `https://famerequipmentrental-springboot-production.up.railway.app${url}`,
                            }}
                            style={styles.thumbnail}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{equipment.equipment.name}</Text>
                <Text style={styles.detail}>
                    Brand: {equipment.equipment.brand}
                </Text>
                <Text style={styles.detail}>
                    Price: ₹{equipment.equipment.pricePerDay}/Day
                </Text>
                <Text style={styles.detail}>
                    Description: {equipment.equipment.description}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Select Rental Dates</Text>
            <Calendar
                onDayPress={(day) => {
                    if (!startDate || (startDate && endDate)) {
                        setStartDate(day.dateString);
                        setEndDate("");
                    } else if (!endDate) {
                        setEndDate(day.dateString);
                    }
                }}
                markedDates={{
                    ...(startDate && {
                        [startDate]: { selected: true, selectedColor: "blue" },
                    }),
                    ...(endDate && {
                        [endDate]: { selected: true, selectedColor: "green" },
                    }),
                    ...bookedDates.reduce((acc, date) => {
                        acc[date] = { marked: true, dotColor: "red" };
                        return acc;
                    }, {}),
                }}
                style={{ marginVertical: 10 }}
            />

            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
                onPress={() => setPaymentMethod("COD")}
                style={styles.radioButton}
            >
                <Text style={styles.radioText}>
                    {paymentMethod === "COD" ? "●" : "○"} Cash on Delivery
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setPaymentMethod("Online")}
                style={styles.radioButton}
            >
                <Text style={styles.radioText}>
                    {paymentMethod === "Online" ? "●" : "○"} Online Payment
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rentButton} onPress={handleRentNow}>
                <Text style={styles.rentButtonText}>Rent Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "cover",
    },
    thumbnailContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
    detailsContainer: {
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
    },
    radioButton: {
        paddingVertical: 8,
    },
    radioText: {
        fontSize: 16,
        color: "#333",
    },
    rentButton: {
        backgroundColor: "#4CAF50",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
    },
    rentButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default RentEquipment;
