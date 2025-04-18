import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <ImageBackground
                source={require("../../assets/images/Hero.jpg")}
                style={styles.heroSection}
            >
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>Farm Equipment Rental</Text>
                    <Text style={styles.heroSubtitle}>
                        Empowering Farmers with Modern Solutions
                    </Text>
                </View>
            </ImageBackground>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/bookings")}
                >
                    <FontAwesome5 name="tractor" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Book Equipment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/labor/SearchLabor")}
                >
                    <FontAwesome5 name="users" size={24} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Hire Labour</Text>
                </TouchableOpacity>
            </View>

            {/* Feature Cards */}
            <View style={styles.featuresSection}>
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => router.push("/registerEquipment")}
                >
                    <FontAwesome5
                        name="clipboard-list"
                        size={32}
                        color="#4CAF50"
                    />
                    <Text style={styles.featureTitle}>Register Equipment</Text>
                    <Text style={styles.featureDescription}>
                        List your equipment for rental
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => router.push("/mybookings")}
                >
                    <FontAwesome5
                        name="calendar-check"
                        size={32}
                        color="#4CAF50"
                    />
                    <Text style={styles.featureTitle}>My Bookings</Text>
                    <Text style={styles.featureDescription}>
                        Track your rentals and bookings
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => router.push("/getrecommendation")}
                >
                    <FontAwesome5
                        name="map-marked-alt"
                        size={32}
                        color="#4CAF50"
                    />
                    <Text style={styles.featureTitle}>Nearby Equipment</Text>
                    <Text style={styles.featureDescription}>
                        Find equipment in your area
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.featureCard}>
                    <FontAwesome5 name="star" size={32} color="#4CAF50" />
                    <Text style={styles.featureTitle}>Top Rated</Text>
                    <Text style={styles.featureDescription}>
                        Best rated equipment and labor
                    </Text>
                </TouchableOpacity>

                {/* New Card - Chatbot */}
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => router.push("/chatbot")}
                >
                    <MaterialIcons name="chat-bubble-outline" size={32} color="#4CAF50" />
                    <Text style={styles.featureTitle}>Chatbot Assistant</Text>
                    <Text style={styles.featureDescription}>
                        Get quick help with your queries
                    </Text>
                </TouchableOpacity>

                {/* New Card - Voice Assistant */}
                <TouchableOpacity
                    style={styles.featureCard}
                    onPress={() => router.push("/voiceassistant")}
                >
                    <MaterialCommunityIcons name="microphone-outline" size={32} color="#4CAF50" />
                    <Text style={styles.featureTitle}>Voice Assistant</Text>
                    <Text style={styles.featureDescription}>
                        Speak to get help on the go
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    heroSection: {
        height: 200,
        justifyContent: "center",
    },
    heroOverlay: {
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 20,
        height: "100%",
        justifyContent: "center",
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    heroSubtitle: {
        fontSize: 16,
        color: "#ffffff",
        textAlign: "center",
        marginTop: 8,
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        backgroundColor: "#ffffff",
        marginTop: -20,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    actionButton: {
        alignItems: "center",
        padding: 15,
    },
    actionButtonText: {
        marginTop: 8,
        color: "#333",
        fontWeight: "600",
    },
    featuresSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
        justifyContent: "space-between",
        marginTop: 20,
    },
    featureCard: {
        backgroundColor: "#ffffff",
        width: "47%",
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    featureDescription: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
});

export default HomeScreen;
