import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { database, auth } from "../firebaseConfig";
import GlobalStyles, { Colors } from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";


export default function Favorites({ navigation }) {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const userDoc = await database.collection("users").doc(userId).get();

      if (!userDoc.exists) {
        setFavoriteEvents([]);
        return;
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];

      if (favorites.length === 0) {
        setFavoriteEvents([]);
        return;
      }

      const eventsPromises = favorites.map(eventId =>
        database.collection("Events").doc(eventId).get()
      );
      const eventsSnapshots = await Promise.all(eventsPromises);

      const events = eventsSnapshots
        .filter(doc => doc.exists)
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setFavoriteEvents(events);
    } catch (error) {
      console.error("Erro ao buscar eventos favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        setLoading(false);
        return;
      }

      fetchFavorites();
    }, [userId])
  );

  const handleRemoveFavorite = async (eventId) => {
    try {
      const userRef = database.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data() || {};
      const currentFavorites = userData.favorites || [];

      const updatedFavorites = currentFavorites.filter(id => id !== eventId);
      await userRef.set({ favorites: updatedFavorites }, { merge: true });

      const updatedList = favoriteEvents.filter(event => event.id !== eventId);
      setFavoriteEvents(updatedList);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 20,
        overflow: "hidden",
        elevation: 3,
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
          onPress={() => handleRemoveFavorite(item.id)}
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
          <Ionicons name="heart" size={20} color="#ff4e50" />
        </Pressable>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
          {item.title}
        </Text>

        <Text style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
          {item.description}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={Colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={{ fontSize: 14, color: "#333" }}>{item.datetime}</Text>
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

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={GlobalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10, color: Colors.textSecondary }}>
                  Carregando favoritos...
                </Text>
              </View>
            ) : favoriteEvents.length === 0 ? (
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20
              }}>
                <Ionicons name="heart-dislike-outline" size={48} color={Colors.primary} style={{ marginBottom: 12 }} />
                <Text style={{
                  fontSize: 16,
                  color: Colors.primary,
                  textAlign: "center"
                }}>
                  Não tens eventos favoritos.
                </Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 20 }}>
                <FlatList
                  data={favoriteEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingBottom: 30 }}
                />
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
