import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { database, auth } from "../firebaseConfig";
import GlobalStyles, { Colors } from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function ParticipatesScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const userId = auth.currentUser?.uid;

  // Buscar participações do utilizador
  const fetchParticipations = async () => {
    try {
      setLoading(true);
      const userDoc = await database.collection("users").doc(userId).get();
      const participations = userDoc.data()?.participations || [];
      const favs = userDoc.data()?.favorites || [];
      setFavorites(favs);

      if (participations.length === 0) {
        setEvents([]);
        return;
      }

      const eventDocs = await Promise.all(
        participations.map((id) => database.collection("Events").doc(id).get())
      );

      const validEvents = eventDocs
        .filter((doc) => doc.exists)
        .map((doc) => ({ id: doc.id, ...doc.data() }));

      setEvents(validEvents);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!userId) {
        Alert.alert(
          "Erro",
          "Necessitas de estar autenticado para ver sua agenda."
        );
        setLoading(false);
        return;
      }

      fetchParticipations();
    }, [userId])
  );

  // Adicionar ou remover favorito
  const toggleFavorite = async (eventId) => {
    try {
      const userRef = database.collection("users").doc(userId);
      let updatedFavorites;

      if (favorites.includes(eventId)) {
        updatedFavorites = favorites.filter((id) => id !== eventId);
      } else {
        updatedFavorites = [...favorites, eventId];
      }

      await userRef.set({ favorites: updatedFavorites }, { merge: true });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      Alert.alert("Erro", "Não foi possível atualizar os favoritos.");
    }
  };

  const renderHeader = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 20,
        zIndex: 2,
      }}
    >
      <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
        <Ionicons name="arrow-back" size={24} color={Colors.primary} />
      </Pressable>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.primary }}>
        Eventos que participo
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    const isFavorited = favorites.includes(item.id);

    return (
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
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 180,
                backgroundColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="image-outline" size={48} color="#888" />
            </View>
          )}
          {/* Ícone do coração para favoritar */}
          <Pressable
            onPress={() => toggleFavorite(item.id)}
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
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color={isFavorited ? "#ff4e50" : "#888"}
            />
          </Pressable>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
            {item.title}
          </Text>

          <Text style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
            {item.description}
          </Text>

          {item.datetime && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={{ fontSize: 14, color: "#333" }}>{item.datetime}</Text>
            </View>
          )}

          <Pressable onPress={() => navigation.navigate("EventDetails", { event: item })}>
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
          Carregando eventos...
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            zIndex: 1,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={48}
            color={Colors.primary}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              fontSize: 16,
              color: Colors.primary,
              textAlign: "center",
            }}
          >
            Você ainda não está participando de nenhum evento.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, zIndex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {renderHeader()}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 30 }}
              />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
