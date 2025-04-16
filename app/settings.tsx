import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="construct-outline" size={80} color="#4CAF50" />
                <Text style={styles.title}>Under Construction</Text>
                <Text style={styles.subtitle}>
                    We're building something amazing!
                </Text>
                <Text style={styles.description}>
                    Our team is working hard to bring you a complete settings
                    experience. Check back soon for updates.
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
        maxWidth: 300,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4CAF50",
        marginTop: 20,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        color: "#555",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        lineHeight: 22,
    },
});

export default Settings;
