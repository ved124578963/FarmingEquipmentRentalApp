import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        country: "India",
        state: "",
        district: "",
        taluka: "",
        village: "",
        pincode: "",
        longitude: "",
        latitude: "",
        dob: "",
        landmark: "",
        mobileNumber: "",
        email: "",
        profileImgId: null,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Prepare data for registration
            const registrationData = {
                ...formData,
                totalEquipment: 0,
                ratingAsGiver: 0.0,
                ratingAsTaker: 0.0,
                totalRentalsGiven: 0,
                totalRentalsTaken: 0,
                totalRewards: 0,
            };

            // Register the farmer
            const response = await axios.post(
                "https://famerequipmentrental-springboot-production.up.railway.app/farmer/register",
                registrationData
            );

            Alert.alert("Success", "Registration successful!");
            setFormData({
                username: "",
                password: "",
                firstName: "",
                middleName: "",
                lastName: "",
                country: "India",
                state: "",
                district: "",
                taluka: "",
                village: "",
                pincode: "",
                longitude: "",
                latitude: "",
                dob: "",
                landmark: "",
                mobileNumber: "",
                email: "",
                profileImgId: null,
            });
            router.push("/login"); // Navigate to the login page
        } catch (err) {
            Alert.alert("Error", "Error registering farmer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Signup</Text>

            {/* Name Section */}
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(value) => handleChange("firstName", value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Middle Name"
                    value={formData.middleName}
                    onChangeText={(value) => handleChange("middleName", value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) => handleChange("lastName", value)}
                />
            </View>

            {/* Username and Password */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(value) => handleChange("username", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
            />

            {/* Date of Birth */}
            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={formData.dob}
                onChangeText={(value) => handleChange("dob", value)}
            />

            {/* Email and Mobile Number */}
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChangeText={(value) => handleChange("mobileNumber", value)}
            />

            {/* Address Section */}
            <Text style={styles.sectionTitle}>Address</Text>
            <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(value) => handleChange("state", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="District"
                value={formData.district}
                onChangeText={(value) => handleChange("district", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Taluka"
                value={formData.taluka}
                onChangeText={(value) => handleChange("taluka", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Village"
                value={formData.village}
                onChangeText={(value) => handleChange("village", value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Landmark"
                value={formData.landmark}
                onChangeText={(value) => handleChange("landmark", value)}
            />

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.linkText}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#4CAF50",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#4CAF50",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        flex: 1,
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: "#a5d6a7",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    linkText: {
        color: "#4CAF50",
        textAlign: "center",
        marginTop: 20,
        textDecorationLine: "underline",
    },
});

export default SignupForm;
