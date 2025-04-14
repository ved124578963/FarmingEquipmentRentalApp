import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";

const BookEquipment = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await axios.get(
                "https://famerequipmentrental-springboot-production.up.railway.app/admin/equipments"
            );
            setEquipmentList(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const renderEquipmentItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/rentEquipment/${item.equipment.id}`)} // Navigate to rentEquipment with ID
        >
            <Image
                source={{
                    uri:
                        item.imageUrls.length > 0
                            ? `https://famerequipmentrental-springboot-production.up.railway.app${item.imageUrls[0]}`
                            : "https://via.placeholder.com/150",
                }}
                style={styles.image}
            />
            <View style={styles.cardContent}>
                <Text style={styles.title}>
                    {item.equipment.name.toUpperCase()}
                </Text>
                <Text style={styles.brand}>{item.equipment.brand}</Text>
                <Text style={styles.price}>
                    Rs. {item.equipment.pricePerDay}/Day
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Equipment</Text>
            <FlatList
                data={equipmentList}
                renderItem={renderEquipmentItem}
                keyExtractor={(item) => item.equipment.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
        textAlign: "center",
    },
    listContainer: {
        padding: 8,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        maxWidth: (windowWidth - 48) / 2,
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
    },
    cardContent: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    brand: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        textAlign: "center",
    },
});

export default BookEquipment;
