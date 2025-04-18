import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // This matches IoChatboxEllipsesOutline
import ChatWindow from "./ChatWindow"; // Make sure this is a React Native component

const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatWindow = () => {
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.chatButton} onPress={toggleChatWindow}>
                <Ionicons name="chatbox-ellipses-outline" size={32} color="#fff" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleChatWindow}
            >
                <ChatWindow onClose={toggleChatWindow} />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 100,
    },
    chatButton: {
        backgroundColor: "#3B82F6",
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default ChatButton;
