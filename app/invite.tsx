import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const EmailInvite = () => {
  const [formData, setFormData] = useState({
    invitedName: "",
    invitedEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  const handleInvite = async () => {
    if (!formData.invitedName || !formData.invitedEmail) {
      Alert.alert(t("error"), t("pleaseFillAllFields"));
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://famerequipmentrental-springboot-production.up.railway.app/farmer/invitemail",
        { ...formData, id: user?.id }
      );

      if (response.status === 200) {
        setMessage(t("invitationSent"));
        setFormData({ invitedName: "", invitedEmail: "" });
      } else {
        setMessage(t("invitationFailed"));
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      setMessage(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>{t("inviteOthers")}</Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Text style={styles.label}>{t("name")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("enterName")}
          placeholderTextColor="#ccc"
          value={formData.invitedName}
          onChangeText={(text) =>
            setFormData({ ...formData, invitedName: text })
          }
        />

        <Text style={styles.label}>{t("email")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("enterEmail")}
          placeholderTextColor="#ccc"
          value={formData.invitedEmail}
          onChangeText={(text) =>
            setFormData({ ...formData, invitedEmail: text })
          }
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleInvite}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t("sendInvitation")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmailInvite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  heading: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    color: "#10b981",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  label: {
    color: "#d1d5db",
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
