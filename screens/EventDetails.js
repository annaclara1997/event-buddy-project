import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles, { Colors } from "../styles/GlobalStyles";
import { database, auth } from "../firebaseConfig";
import { Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function EventDetails({ route, navigation }) {
  const { event: initialEvent } = route.params || {};
  const [eventData, setEventData] = useState({
    id: initialEvent?.id || "",
    title: initialEvent?.title || "Evento sem título",
    description: initialEvent?.description || "",
    datetime: initialEvent?.datetime || "",
    location: initialEvent?.location || "",
    imageUrl: initialEvent?.imageUrl || null,
    participants: initialEvent?.participants || [],
    favorites: initialEvent?.favorites || [],
  });

  const [isParticipating, setIsParticipating] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const loadData = async () => {
      if (!eventData.id || !userId) return;

      try {
        setLoading(true);

        const eventDoc = await database.collection("Events").doc(eventData.id).get();
        if (eventDoc.exists) {
          const data = eventDoc.data();
          setEventData(prev => ({
            ...prev,
            ...data,
            participants: Array.isArray(data.participants) ? data.participants : [],
            favorites: Array.isArray(data.favorites) ? data.favorites : [],
          }));
        }

        const userDoc = await database.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setIsFavorited(Array.isArray(userData.favorites) && userData.favorites.includes(eventData.id));
          setIsParticipating(Array.isArray(userData.participations) && userData.participations.includes(eventData.id));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Falha ao carregar dados do evento");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventData.id, userId]);

  const updateArrayField = async (collection, docId, field, item, shouldAdd) => {
    if (!item) return [];

    const docRef = database.collection(collection).doc(docId);
    const doc = await docRef.get();

    const currentArray = doc.exists && Array.isArray(doc.data()[field])
      ? doc.data()[field]
      : [];

    const updatedArray = shouldAdd
      ? currentArray.includes(item) ? currentArray : [...currentArray, item]
      : currentArray.filter(id => id !== item);

    await docRef.set({ [field]: updatedArray }, { merge: true });
    return updatedArray;
  };

  const handleParticipate = async () => {
    if (!userId || !eventData.id) return;

    try {
      setLoading(true);
      const newStatus = !isParticipating;

      await updateArrayField("users", userId, "participations", eventData.id, newStatus);
      const updated = await updateArrayField("Events", eventData.id, "participants", userId, newStatus);

      setIsParticipating(newStatus);
      setEventData(prev => ({ ...prev, participants: updated }));
    } catch (error) {
      console.error("Erro ao atualizar participação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a participação");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId || !eventData.id) return;

    try {
      setLoading(true);
      const newStatus = !isFavorited;

      await updateArrayField("users", userId, "favorites", eventData.id, newStatus);
      const updated = await updateArrayField("Events", eventData.id, "favorites", userId, newStatus);

      setIsFavorited(newStatus);
      setEventData(prev => ({ ...prev, favorites: updated }));
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>A carregar...</Text>
      </View>
    );
  }

  if (!eventData.id) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Evento não encontrado</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#f3e9ff", "#f9f4ff", "#ffffff"]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                elevation: 3,
                width: "100%",
                maxWidth: 500,
              }}
            >
              {/* Imagem com botão de favorito */}
              <View style={{ position: "relative" }}>
                {eventData.imageUrl && (
                  <Image
                    source={{ uri: eventData.imageUrl }}
                    style={{ width: "100%", height: 200 }}
                    resizeMode="cover"
                  />
                )}
                <Pressable
                  onPress={handleFavoriteToggle}
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
                    color={isFavorited ? "#ff4e50" : "#999"}
                  />
                </Pressable>
              </View>

              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
                  {eventData.title}
                </Text>

                <Text style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
                  {eventData.description}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14 }}>{eventData.datetime}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Ionicons name="location-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Pressable
                    onPress={() => {
                      const query = encodeURIComponent(eventData.location);
                      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={{ fontSize: 14, color: Colors.primary, textDecorationLine: "underline" }}>
                      {eventData.location}
                    </Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                  <Ionicons name="people-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14 }}>{eventData.participants?.length || 0} participantes</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <Ionicons name="heart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14 }}>{eventData.favorites?.length || 0} favoritos</Text>
                </View>

                <Pressable
                  onPress={handleParticipate}
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1, marginTop: 8 }}
                >
                  <View
                    style={{                      backgroundColor: isParticipating ? "#aaa" : "#4CAF50",
                      paddingVertical: 14,
                      paddingHorizontal: 32,
                      borderRadius: 30,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold"
                    }}>
                      {isParticipating ? "Cancelar Participação" : "Participar"}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Botão de voltar flutuante */}
           <View
  style={{
    position: "absolute",
    top: 60, // mais abaixo
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  }}
>
  <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
    <Ionicons name="arrow-back" size={24} color="#333" />
  </Pressable>
  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
    Detalhes do evento
  </Text>
</View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
