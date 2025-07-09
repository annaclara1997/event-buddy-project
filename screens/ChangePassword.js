import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import { auth } from "../firebaseConfig";
import GlobalStyles, { Colors } from "../styles/GlobalStyles";
import firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    const user = auth.currentUser;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As novas passwords não coincidem.");
      return;
    }

    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPassword);

      Alert.alert("Sucesso", "Password atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao mudar password:", error);
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              paddingTop: 60,
              paddingBottom: 40,
            }}
          >
            {/* Cabeçalho */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
              <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Ionicons name="arrow-back" size={26} color={Colors.primary} />
              </Pressable>
              <Text style={{ fontSize: 22, fontWeight: "bold", color: Colors.primary }}>
                Mudar Password
              </Text>
            </View>

            {/* Campo: senha atual */}
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 6 }}>
              Password atual
            </Text>
            <TextInput
              style={{
                borderColor: Colors.muted,
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 16,
                color: Colors.textPrimary,
                backgroundColor: "#fff",
                marginBottom: 20
              }}
              secureTextEntry
              placeholder="********"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#999"
            />

            {/* Campo: nova senha */}
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 6 }}>
              Nova password
            </Text>
            <TextInput
              style={{
                borderColor: Colors.muted,
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 16,
                color: Colors.textPrimary,
                backgroundColor: "#fff",
                marginBottom: 20
              }}
              secureTextEntry
              placeholder="********"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />

            {/* Campo: confirmar nova senha */}
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 6 }}>
              Confirmar nova password
            </Text>
            <TextInput
              style={{
                borderColor: Colors.muted,
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 16,
                color: Colors.textPrimary,
                backgroundColor: "#fff",
                marginBottom: 30
              }}
              secureTextEntry
              placeholder="********"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />

            {/* Botão atualizar */}
            <Pressable
              onPress={handleChangePassword}
              style={{
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 40,
                backgroundColor: Colors.primary,
                borderRadius: 30,
                marginTop: 10
              }}
            >
              <Ionicons name="key-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
                Atualizar Password
              </Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
