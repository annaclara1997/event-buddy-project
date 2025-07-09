import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { auth, database } from '../firebaseConfig';
import GlobalStyles, { Colors, Spacing } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const userId = user?.uid;
  const userEmail = user?.email;

  const [userInfo, setUserInfo] = useState({ name: "", photoUrl: "" });
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(true);

  const logout = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
        Alert.alert('Erro', 'Não foi possível fazer logout.');
      });
  };

  const fetchAgenda = async () => {
    try {
      const userDoc = await database.collection("users").doc(userId).get();
      const data = userDoc.data() || {};
      setUserInfo({ name: data.name || "", photoUrl: data.photoUrl || "" });

      const participations = data.participations || [];
      setParticipatedEvents(participations);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar suas informações.");
    } finally {
      setLoadingAgenda(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        setLoadingAgenda(true);
        fetchAgenda();
      }
    }, [userId])
  );

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
          <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
            {/* Cabeçalho */}
            <View style={{
              backgroundColor: Colors.primary,
              paddingTop: 60,
              paddingBottom: 30,
              paddingHorizontal: 20,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4
            }}>
              {userInfo.photoUrl ? (
                <Image
                  source={{ uri: userInfo.photoUrl }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: "#fff",
                    marginBottom: 10,
                    backgroundColor: "#fff"
                  }}
                />
              ) : (
                <Ionicons name="person-circle-outline" size={100} color="#fff" style={{ marginBottom: 10 }} />
              )}

              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#fff" }}>
                {userInfo.name || "Utilizador sem nome"}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Ionicons name="mail-outline" size={16} color="#e0d6f5" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 14, color: "#e0d6f5" }}>
                  {userEmail || "Email não disponível"}
                </Text>
              </View>

              {userId && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <Ionicons name="key-outline" size={16} color="#e0d6f5" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 12, color: "#e0d6f5" }}>
                    {userId}
                  </Text>
                </View>
              )}
            </View>

            {/* Conteúdo */}
            <View style={{ padding: 20 }}>
              {/* Ações */}
              <View style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 16,
                marginBottom: 20,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4
              }}>
                <Pressable onPress={() => navigation.navigate("EditProfile")} style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <Ionicons name="create-outline" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 15, color: Colors.textPrimary }}>Editar perfil</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("ChangePassword")} style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 15, color: Colors.textPrimary }}>Mudar password</Text>
                </Pressable>
              </View>

              {/* Agenda */}
              <Pressable
                onPress={() => navigation.navigate("Participates")}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  marginBottom: 40
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.primary} style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.primary }}>
                    Minha Agenda
                  </Text>
                </View>
                {loadingAgenda ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.textPrimary }}>
                    {participatedEvents.length} evento(s)
                  </Text>
                )}
              </Pressable>

              {/* Botão Logout */}
              <Pressable
                onPress={logout}
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 40,
                  backgroundColor: Colors.danger,
                  borderRadius: 30,
                  marginTop: 10,
                  elevation: 3
                }}
              >
                <Ionicons name="log-out-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                  Sair da conta
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
