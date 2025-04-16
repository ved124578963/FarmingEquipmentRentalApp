import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";
import { useUser } from "./context/UserContext";

const BookingRequests = () => {
    interface Equipment {
        id: number;
        equipment: {
            name: string;
            category: string;
            brand: string;
        };
        borrower: {
            firstName: string;
        };
        status: string;
    }

    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            Alert.alert("Error", "User not found. Please log in again.");
            return;
        }

        const fetchEquipment = async () => {
            try {
                const response = await axios.get(
                    `https://famerequipmentrental-springboot-production.up.railway.app/booking/requests/${user.id}`
                );
                setEquipmentList(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
                Alert.alert(
                    "Error",
                    "Failed to fetch equipment. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [user]);

    const updateStatus = async (itemId, newStatus) => {
        try {
            await axios.put(
                `https://famerequipmentrental-springboot-production.up.railway.app/booking/update/${itemId}/${newStatus}`
            );
            Alert.alert("Success", `Status updated to ${newStatus}`);

            setEquipmentList((prevList) =>
                prevList.map((item) =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            Alert.alert("Error", "Failed to update status. Please try again.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Requests</Text>

            {equipmentList.length === 0 ? (
                <Text style={styles.emptyText}>No equipment available.</Text>
            ) : (
                <View style={styles.cardContainer}>
                    {equipmentList.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.equipmentName}>
                                {item.equipment.name}
                            </Text>
                            <Text style={styles.detail}>
                                <Text style={styles.label}>Category: </Text>
                                {item.equipment.category}
                            </Text>
                            <Text style={styles.detail}>
                                <Text style={styles.label}>Borrower: </Text>
                                {item.borrower.firstName}
                            </Text>
                            <Text style={styles.detail}>
                                <Text style={styles.label}>Brand: </Text>
                                {item.equipment.brand}
                            </Text>
                            <Text style={styles.detail}>
                                <Text style={styles.label}>Status: </Text>
                                <Text
                                    style={[
                                        styles.status,
                                        item.status === "APPROVED"
                                            ? styles.approvedStatus
                                            : item.status === "REJECTED"
                                            ? styles.rejectedStatus
                                            : styles.pendingStatus,
                                    ]}
                                >
                                    {item.status}
                                </Text>
                            </Text>

                            {item.status !== "APPROVED" && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.approveButton}
                                        onPress={() =>
                                            updateStatus(item.id, "APPROVED")
                                        }
                                    >
                                        <Text style={styles.buttonText}>
                                            Approve
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.rejectButton}
                                        onPress={() =>
                                            updateStatus(item.id, "REJECTED")
                                        }
                                    >
                                        <Text style={styles.buttonText}>
                                            Reject
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
        textAlign: "center",
        marginVertical: 16,
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 16,
    },
    cardContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    equipmentName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        color: "#333",
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
    },
    status: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    approvedStatus: {
        color: "#2E7D32",
        backgroundColor: "#E8F5E9",
    },
    rejectedStatus: {
        color: "#C62828",
        backgroundColor: "#FFEBEE",
    },
    pendingStatus: {
        color: "#F57F17",
        backgroundColor: "#FFF8E1",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    approveButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    rejectButton: {
        backgroundColor: "#D32F2F",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
    },
});

export default BookingRequests;
