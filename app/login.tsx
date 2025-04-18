import React, { useState } from "react";
import { router } from "expo-router";
import { useUser } from "./context/UserContext";
import { Feather } from "@expo/vector-icons";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
const Login = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [selected, setSelected] = useState("farmer"); // Default role is "farmer"
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const userContext = useUser();
    const setUser = userContext?.setUser;

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const endpoint =
                selected === "farmer"
                    ? "https://famerequipmentrental-springboot-production.up.railway.app/farmer/login"
                    : "https://famerequipmentrental-springboot-production.up.railway.app/labor/login";

            const response =
                selected === "farmer"
                    ? await axios.post(endpoint, { username, password })
                    : await axios.post(endpoint, { email, password });

            if (response.status === 200) {
                // Store user data and role
                setUser(response.data);
                Alert.alert("Login Successful", "Welcome back!");
                if (selected === "farmer") {
                    router.replace("/(tabs)"); // Replace "Home" with your farmer home screen
                } else {
                    // navigation.navigate("LaborProfile"); // Replace with your labor profile screen
                }
            }
        } catch (err) {
            setError(
                // err.response?.data?.message ||
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>FarmRent</Text>
                <View style={styles.roleSelection}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            selected === "farmer" && styles.selectedRoleButton,
                        ]}
                        onPress={() => setSelected("farmer")}
                    >
                        <Text
                            style={[
                                styles.roleButtonText,
                                selected === "farmer" &&
                                    styles.selectedRoleButtonText,
                            ]}
                        >
                            Farmer
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            selected === "laborer" && styles.selectedRoleButton,
                        ]}
                        onPress={() => setSelected("laborer")}
                    >
                        <Text
                            style={[
                                styles.roleButtonText,
                                selected === "laborer" &&
                                    styles.selectedRoleButtonText,
                            ]}
                        >
                            Laborer
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.roleDescription}>
                    {selected === "farmer" ? "Farmer Login" : "Laborer Login"}
                </Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {selected === "farmer" ? (
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                )}
                <View style={styles.passwordContainer}>
    <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
    />
    <TouchableOpacity
        style={styles.togglePassword}
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
    >
        <Feather
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={20}
            color="#777"
        />
    </TouchableOpacity>
</View>

                <TouchableOpacity
                    style={styles.forgotPassword}
                    //onPress={() => navigation.navigate("ForgotPassword")}
                >
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, loading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    Don't have an account?{" "}
                    <Text
                        style={styles.linkText}
                        onPress={() => router.push("/signup")}
                    >
                        Sign Up
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    formContainer: {
        width: "90%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#4CAF50",
    },
    roleSelection: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    roleButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 5,
    },
    selectedRoleButton: {
        backgroundColor: "#4CAF50",
    },
    roleButtonText: {
        color: "#000",
    },
    selectedRoleButtonText: {
        color: "#fff",
    },
    roleDescription: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 16,
        color: "#4CAF50",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    passwordContainer: {
        position: "relative",
    },
    togglePassword: {
        position: "absolute",
        right: 10,
        top: 15,
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    linkText: {
        color: "#4CAF50",
        textDecorationLine: "underline",
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#a5d6a7",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    footerText: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
    },
});

export default Login;
