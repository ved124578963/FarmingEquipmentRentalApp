import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import axios from "axios";
import { useUser } from "./context/UserContext";

const RegisterEquipment = () => {
    const { user } = useUser();
    const userId = user?.id;

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        brand: "",
        price: "",
        pricePerDay: "",
        stock: "",
        description: "",
        equipmentCondition: "",
        warranty: "",
        equipmentType: "",
        farmSize: "",
        manufactureYear: "",
        usageDuration: "",
        location: "",
        pincode: "",
        longitude: "",
        latitude: "",
        imageIds: "",
        owner: { id: userId || 1 },
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location access is required");
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                setFormData((prev) => ({
                    ...prev,
                    latitude: location.coords.latitude.toString(),
                    longitude: location.coords.longitude.toString(),
                }));
            } catch (error) {
                Alert.alert("Error", "Failed to fetch location");
            }
        })();
    }, []);

    const handleImagePicker = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Camera roll permission is required"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const images = result.assets;
            setSelectedImages(images);

            try {
                const uploadedImageIds = [];
                for (const image of images) {
                    const formData = new FormData();
                    formData.append("file", {
                        uri: image.uri,
                        type: "image/jpeg",
                        name: "photo.jpg",
                    });

                    const response = await axios.post(
                        "https://famerequipmentrental-springboot-production.up.railway.app/api/files/upload",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    if (response.status === 200) {
                        uploadedImageIds.push(response.data.id);
                    }
                }

                setFormData((prev) => ({
                    ...prev,
                    imageIds: uploadedImageIds.join(","),
                }));
            } catch (error) {
                Alert.alert("Error", "Failed to upload images");
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "https://famerequipmentrental-springboot-production.up.railway.app/farmer/equipment/register",
                formData
            );

            if (response.status === 200) {
                Alert.alert("Success", "Equipment registered successfully!");
                router.push("/bookings");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to register equipment");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.title}>Register Equipment</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Equipment Name"
                    value={formData.name}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, name: value }))
                    }
                />

                <Picker
                    style={styles.picker}
                    selectedValue={formData.category}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                    }
                >
                    <Picker.Item label="Select Category" value="" />
                    <Picker.Item label="Plowing" value="Plowing" />
                    <Picker.Item label="Sowing" value="Sowing" />
                    <Picker.Item label="Irrigation" value="Irrigation" />
                    <Picker.Item label="Fertilizers" value="Fertilizers" />
                    <Picker.Item label="Pesticides" value="Pesticides" />
                    <Picker.Item label="Harvesting" value="Harvesting" />
                    <Picker.Item
                        label="Post-Harvesting"
                        value="Post-Harvesting"
                    />
                    <Picker.Item label="Land-Leveling" value="Land-Leveling" />
                    <Picker.Item label="Mulching" value="Mulching" />
                    <Picker.Item label="Transport" value="Transport" />
                    <Picker.Item label="Green House" value="Green House" />
                    <Picker.Item label="Orchard" value="Orchard" />
                    <Picker.Item
                        label="Fodder Cultivation"
                        value="Fodder Cultivation"
                    />
                    <Picker.Item
                        label="Livestock Farming"
                        value="Livestock Farming"
                    />
                    <Picker.Item label="Other" value="Other" />
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Brand"
                    value={formData.brand}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, brand: value }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    value={formData.price}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, price: value }))
                    }
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Price Per Day"
                    value={formData.pricePerDay}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, pricePerDay: value }))
                    }
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Stock"
                    value={formData.stock}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, stock: value }))
                    }
                    keyboardType="numeric"
                />

                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    placeholder="Description"
                    value={formData.description}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, description: value }))
                    }
                    multiline
                />

                <Picker
                    style={styles.picker}
                    selectedValue={formData.equipmentCondition}
                    onValueChange={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            equipmentCondition: value,
                        }))
                    }
                >
                    <Picker.Item label="Select Condition" value="" />
                    <Picker.Item
                        label="Best Equipment"
                        value="Best_Equipment"
                    />
                    <Picker.Item
                        label="Good Equipment"
                        value="Good_Equipment"
                    />
                    <Picker.Item
                        label="Average Equipment"
                        value="Average_Equipment"
                    />
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Warranty"
                    value={formData.warranty}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, warranty: value }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Equipment Type"
                    value={formData.equipmentType}
                    onChangeText={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            equipmentType: value,
                        }))
                    }
                />

                <Picker
                    style={styles.picker}
                    selectedValue={formData.farmSize}
                    onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, farmSize: value }))
                    }
                >
                    <Picker.Item label="Select Farm Size" value="" />
                    <Picker.Item label="Small" value="Small" />
                    <Picker.Item label="Medium" value="Medium" />
                    <Picker.Item label="Large" value="Large" />
                </Picker>

                <TextInput
                    style={styles.input}
                    placeholder="Manufacture Year"
                    value={formData.manufactureYear}
                    onChangeText={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            manufactureYear: value,
                        }))
                    }
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Usage Duration"
                    value={formData.usageDuration}
                    onChangeText={(value) =>
                        setFormData((prev) => ({
                            ...prev,
                            usageDuration: value,
                        }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Location"
                    value={formData.location}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, location: value }))
                    }
                />

                <TextInput
                    style={styles.input}
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChangeText={(value) =>
                        setFormData((prev) => ({ ...prev, pincode: value }))
                    }
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={handleImagePicker}
                >
                    <Text style={styles.imageButtonText}>Select Images</Text>
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    {selectedImages.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image.uri }}
                            style={styles.image}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>
                        Register Equipment
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
        color: "#2c3e50",
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#34495e",
        fontWeight: "500",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#bdc3c7",
        fontSize: 16,
    },
    picker: {
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#bdc3c7",
        marginBottom: 15,
    },
    imageButton: {
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    imageButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: "#2ecc71",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 20,
    },
    submitButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: "top",
    },
});

export default RegisterEquipment;
