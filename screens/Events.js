import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { database, auth } from "../firebaseConfig";
import GlobalStyles, { Colors, Spacing } from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";


export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const userId = auth.currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      const fetchEventsAndFavorites = async () => {
        try {
          const snapshot = await database
            .collection("Events")
            .orderBy("datetime")
            .get();
          const eventsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);

          if (userId) {
            const userDoc = await database
              .collection("users")
              .doc(userId)
              .get();
            const userData = userDoc.data() || {};
            const favoriteIds = userData.favorites || [];

            const favoritesMap = {};
            favoriteIds.forEach((id) => {
              favoritesMap[id] = true;
            });
            setFavorites(favoritesMap);
          }
        } catch (error) {
          console.error("Erro ao atualizar favoritos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventsAndFavorites();
    }, [userId])
  );

  const handleFavorite = async (event) => {
    const eventId = event.id;
    const isFavorite = favorites[eventId];
    const updatedFavorites = { ...favorites, [eventId]: !isFavorite };
    setFavorites(updatedFavorites);

    try {
      if (!userId) return;

      const userRef = database.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data() || {};
      const currentFavorites = userData.favorites || [];

      let newFavorites;
      if (!isFavorite) {
        newFavorites = [...currentFavorites, eventId];
      } else {
        newFavorites = currentFavorites.filter((id) => id !== eventId);
      }

      await userRef.set({ favorites: newFavorites }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const renderEvent = ({ item }) => {
    const isFavorite = favorites[item.id];

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          marginBottom: 20,
          overflow: "hidden",
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}
      >
        <View style={{ position: "relative" }}>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
          )}
          <Pressable
            onPress={() => handleFavorite(item)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 6,
              elevation: 2,
            }}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#ff4e50" : "#999"}
            />
          </Pressable>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6, color: Colors.textPrimary }}>
            {item.title}
          </Text>

          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 8 }}>
            {item.description}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={{ fontSize: 14, color: Colors.textPrimary }}>{item.datetime}</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            <Text style={{ color: Colors.primary, fontWeight: "bold", fontSize: 14 }}>
              Ver Detalhes
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: Colors.textSecondary }}>
          A carregar eventos...
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <Text style={{ color: Colors.textSecondary }}>Nenhum evento encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 40,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
