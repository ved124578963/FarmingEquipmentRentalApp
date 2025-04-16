import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Invite = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="time-outline" size={80} color="#4CAF50" />
                <Text style={styles.title}>Coming Soon!</Text>
                <Text style={styles.subtitle}>
                    We're working hard to bring you an amazing invite feature.
                </Text>
                <Text style={styles.description}>
                    Soon you'll be able to invite your friends and family to
                    join our platform.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
        lineHeight: 24,
    },
    description: {
        fontSize: 16,
        color: "#888",
        textAlign: "center",
        lineHeight: 22,
    },
});

export default Invite;
