import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    ActivityIndicator,
    StyleSheet,
    Alert,
    FlatList,
    Dimensions,
} from "react-native";
import axios from "axios";
import { useUser } from "./context/UserContext";

const MyEquipments = () => {
    const [equipmentList, setEquipmentList] = useState([]);
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
                    `https://famerequipmentrental-springboot-production.up.railway.app/farmer/equipment/all/${user.id}`
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

    const renderEquipmentImages = (imageUrls) => {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageContainer}
            >
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <Image
                            key={index}
                            source={{
                                uri: `https://famerequipmentrental-springboot-production.up.railway.app${url}`,
                            }}
                            style={styles.equipmentImage}
                        />
                    ))
                ) : (
                    <Text style={styles.noImageText}>No images available</Text>
                )}
            </ScrollView>
        );
    };

    const renderEquipmentItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.equipmentName}>{item.equipment.name}</Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Category: </Text>
                {item.equipment.category}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Brand: </Text>
                {item.equipment.brand}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Price: </Text>₹
                {item.equipment.price.toLocaleString()}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Stock: </Text>
                {item.equipment.stock}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Condition: </Text>
                {item.equipment.equipmentCondition}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Warranty: </Text>
                {item.equipment.warranty}
            </Text>
            <Text style={styles.detail}>
                <Text style={styles.label}>Location: </Text>
                {item.equipment.location} ({item.equipment.pincode})
            </Text>
            {renderEquipmentImages(item.imageUrls)}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Equipment</Text>

            {equipmentList.length === 0 ? (
                <Text style={styles.emptyText}>No equipment available.</Text>
            ) : (
                <FlatList
                    data={equipmentList}
                    renderItem={renderEquipmentItem}
                    keyExtractor={(item) => item.equipment.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
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
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    equipmentName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    detail: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
        color: "#444",
    },
    imageContainer: {
        marginTop: 12,
        flexDirection: "row",
    },
    equipmentImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 8,
    },
    noImageText: {
        color: "#999",
        fontStyle: "italic",
    },
});

export default MyEquipments;
