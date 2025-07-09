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
  Image
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles, { Colors, Spacing } from "../styles/GlobalStyles";
import { auth } from "../firebaseConfig";

export default function RecoveryPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("Por favor, insira o email.");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert("Sucesso", "Email de recuperação enviado.");
      navigation.goBack();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
      <LinearGradient
        colors={["#f8c6e5", "#e6a8f7", "#a18cd1"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
        >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, justifyContent: "center", padding: Spacing.lg }}>
              {/* Logo e boas-vindas */}
              <View style={{ alignItems: "center", marginBottom: Spacing.md }}>
                <Image
                  source={require("../assets/eventbuddy3.png")}
                  style={{
                    width: 400,
                    height: 200,
                    resizeMode: "contain"
                  }}
                />
                <View style={{ marginTop: -Spacing.sm }}>
                  <Text style={{
                  fontSize: 26,
                  fontWeight: "bold",
                  color: "#4b0082", 
                  textAlign: "center"
                  }}>
                  Recuperar Acesso
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: "#4b0082",
                    marginTop: 4,
                    textAlign: "center"
                  }}>
                    Insira seu email para redefinir sua senha
                  </Text>
                </View>
              </View>

              {/* Formulário */}
              <View style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: Spacing.lg,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 6,
                marginTop: Spacing.md
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: Colors.primary,
                  marginBottom: Spacing.md,
                  textAlign: "center"
                }}>
                  Redefinir Senha
                </Text>

                {/* Email */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.light,
                  borderRadius: 12,
                  paddingHorizontal: Spacing.md,
                  marginBottom: Spacing.sm
                }}>
                  <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.sm,
                      paddingLeft: Spacing.sm,
                      fontSize: 15,
                      color: Colors.textPrimary
                    }}
                    placeholder="Email"
                    placeholderTextColor={Colors.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {errorMessage !== "" && (
                  <Text style={{ color: Colors.danger, textAlign: "center", marginBottom: Spacing.sm }}>
                    {errorMessage}
                  </Text>
                )}

                <Pressable
                style={{
                backgroundColor: Colors.primary,
                paddingVertical: Spacing.md, 
                borderRadius: 30,           
                alignItems: "center",
                marginTop: Spacing.sm
                 }}
                onPress={handlePasswordReset}
                >
                <Text style={{
                  color: "#fff",
                  fontSize: 16,               
                  fontWeight: "bold"
                }}>
                 Enviar Email
                </Text>
                </Pressable>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text style={GlobalStyles.textLink}>Voltar ao login</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
