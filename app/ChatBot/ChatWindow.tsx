import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { width, height } = Dimensions.get("window");

const genAI = new GoogleGenerativeAI("AIzaSyCMhuhudG9S33XEF8ThLZYAFrrbK1ZVzLM");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "text/plain",
  },
});

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { sender: "user", text: input }];
      setMessages(newMessages);

      const customPrompt = `Please provied the answer upto 10 line only. related to agriculture and equipments used. Question: "${input}"`;

      try {
        const result = await model.generateContent(customPrompt);
        const response = result.response.text();
        setMessages([...newMessages, { sender: "bot", text: response }]);
      } catch (error) {
        console.error("Error generating response:", error);
        setMessages([
          ...newMessages,
          { sender: "bot", text: "Sorry, I couldn't process that." },
        ]);
      }

      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FarmEquip</Text>
        <Text style={styles.subtitle}>I am AgroBot,{"\n"}How can I help you?</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === "user" ? styles.userBubble : styles.botBubble,
              msg.sender === "user" ? styles.alignRight : styles.alignLeft,
            ]}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 16,
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    zIndex: 100,
  },
  header: {
    backgroundColor: "#1e3a8a",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    color: "#e0e7ff",
    marginTop: 5,
  },
  messagesContainer: {
    padding: 10,
    flex: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "#bfdbfe",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#e5e7eb",
    alignSelf: "flex-start",
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f9fafb",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
});

export default ChatWindow;
