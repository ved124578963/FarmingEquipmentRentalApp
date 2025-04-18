import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import LaborInfo from "./LaborInfo"; // Make sure this is a React Native component

const SearchLabors = () => {
  const [searchType, setSearchType] = useState("skill");
  const [searchQuery, setSearchQuery] = useState("");
  const [labors, setLabors] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllLabors();
  }, []);

  const fetchAllLabors = async () => {
    try {
      const response = await fetch(
        "https://famerequipmentrental-springboot-production.up.railway.app/labor/all"
      );
      if (!response.ok) throw new Error("Failed to fetch labor data.");
      const data = await response.json();
      setLabors(data);
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLaborsByQuery = async () => {
    setError("");
    setLabors([]);
    setSearched(true);

    if (!searchQuery.trim()) {
      setError(`Please enter a ${searchType}.`);
      return;
    }

    try {
      setLoading(true);
      const encodedQuery = encodeURIComponent(searchQuery);
      const apiEndpoint =
        searchType === "skill"
          ? `https://famerequipmentrental-springboot-production.up.railway.app/labor/skill/${encodedQuery}`
          : `https://famerequipmentrental-springboot-production.up.railway.app/labor/location/${encodedQuery}`;

      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`No labor found with ${searchType}: ${searchQuery}`);
      }

      const data = await response.json();
      setLabors(data);
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedLabor) {
    return <LaborInfo labor={selectedLabor} onBack={() => setSelectedLabor(null)} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search for Labors</Text>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === "skill" ? styles.active : styles.inactive,
          ]}
          onPress={() => setSearchType("skill")}
        >
          <Text style={styles.toggleText}>Search by Skill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === "location" ? styles.active : styles.inactive,
          ]}
          onPress={() => setSearchType("location")}
        >
          <Text style={styles.toggleText}>Search by Location</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder={`Enter ${searchType} (e.g., ${
            searchType === "skill" ? "Ploughing" : "Pune"
          })`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />
        <TouchableOpacity onPress={fetchLaborsByQuery} style={styles.searchButton}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Labor Cards */}
      <View style={styles.cardsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : labors.length > 0 ? (
          labors.map((labor) => (
            <TouchableOpacity
              key={labor.id}
              style={styles.card}
              onPress={() => setSelectedLabor(labor)}
            >
              <Text style={styles.cardTitle}>{labor.name}</Text>
              <Text>Skills: {labor.skills}</Text>
              <Text>Experience: {labor.experience} years</Text>
              <Text style={styles.cardPrice}>₹{labor.pricePerDay} / day</Text>
              <Text>Location: {labor.location}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>No labors found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "600",
  },
  active: {
    backgroundColor: "#2E7D32",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  inactive: {
    backgroundColor: "#A5D6A7",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  searchButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  searchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  cardsContainer: {
    marginTop: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  cardPrice: {
    fontWeight: "bold",
    color: "#2E7D32",
    marginVertical: 4,
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default SearchLabors;
