import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from "react-native";
import { useUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Profile = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>User not logged in.</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.contentContainer}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri:
                                    user.avatarUrl ||
                                    "https://www.gravatar.com/avatar/default?s=200",
                            }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editButton}>
                            <Ionicons name="pencil" size={18} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>02</Text>
                            <Text style={styles.statLabel}>Rentals</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>5</Text>
                            <Text style={styles.statLabel}>Active</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>4.8</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Action Cards */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/myEquipments")}
                    >
                        <Ionicons name="cart-outline" size={24} color="#4CAF50" />
                        <Text style={styles.actionText}>My Rentals</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/bookingrequests")}
                    >
                        <Ionicons name="time-outline" size={24} color="#4CAF50" />
                        <Text style={styles.actionText}>My Requests</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/invite")}
                    >
                        <Ionicons name="share-social-outline" size={24} color="#4CAF50" />
                        <Text style={styles.actionText}>Invite Others</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/labor/MyProfile")}
                    >
                        <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
                        <Text style={styles.actionText}>My Profile</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/settings")}
                    >
                        <Ionicons name="settings-outline" size={24} color="#4CAF50" />
                        <Text style={styles.actionText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, styles.logout]}
                        onPress={() => router.push("/login")}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
                        <Text style={[styles.actionText, styles.logoutText]}>
                            Logout
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color="#d32f2f" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginBottom: 24,
        elevation: 2,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#4CAF50",
    },
    editButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "#eee",
    },
    actionsContainer: {
        gap: 12,
    },
    actionCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        elevation: 1,
    },
    actionText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
        marginLeft: 12,
    },
    logout: {
        backgroundColor: "#fff5f5",
        marginTop: 12,
    },
    logoutText: {
        color: "#d32f2f",
        fontWeight: "500",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
});

export default Profile;
