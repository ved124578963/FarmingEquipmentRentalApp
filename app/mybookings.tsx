import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";

// Define the booking type
interface Booking {
    id: number;
    equipment: {
        name: string;
        owner: {
            firstName: string;
            lastName: string;
        };
    };
    status: string;
    startDate: string;
    endDate: string;
}

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(
                    `https://famerequipmentrental-springboot-production.up.railway.app/booking/borrower-requests/${
                        user?.id || 10
                    }`
                );
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            {bookings.length === 0 ? (
                <Text style={styles.noBookings}>No bookings found</Text>
            ) : (
                bookings.map((booking) => (
                    <View key={booking.id} style={styles.card}>
                        <Text style={styles.equipmentName}>
                            {booking.equipment.name}
                        </Text>
                        <Text style={styles.ownerName}>
                            Owner: {booking.equipment.owner.firstName}{" "}
                            {booking.equipment.owner.lastName}
                        </Text>
                        <Text style={styles.dates}>
                            From:{" "}
                            {new Date(booking.startDate).toLocaleDateString()}{" "}
                            {"\n"}
                            To: {new Date(booking.endDate).toLocaleDateString()}
                        </Text>
                        <View style={styles.statusContainer}>
                            <Text
                                style={[
                                    styles.status,
                                    {
                                        backgroundColor:
                                            booking.status === "APPROVED"
                                                ? "#4CAF50"
                                                : booking.status === "PENDING"
                                                ? "#FFC107"
                                                : "#F44336",
                                    },
                                ]}
                            >
                                {booking.status}
                            </Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    equipmentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    ownerName: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    dates: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    noBookings: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 20,
    },
});

export default MyBookings;
