import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "../services/firebaseAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles, { Colors, Spacing } from "../styles/GlobalStyles";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("As passwords não coincidem.");
      return;
    }
    try {
      await signUp(email, password);
      await signOut(auth);
      setErrorMessage("");
      alert("🎉 Conta criada com sucesso!\n\nFaça login com sua nova conta para começar a explorar os eventos.");
      navigation.navigate("Login");
    } catch (error) {
      setErrorMessage("Erro ao criar conta: " + error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#9b59b6", "#af7ac5", "#d2b4de"]}
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
                    Bem-vindo
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: "#e0d6f5",
                    marginTop: 4,
                    textAlign: "center"
                  }}>
                    Crie sua conta para começar a explorar eventos
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
                  Criar Conta
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

                {/* Password */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.light,
                  borderRadius: 12,
                  paddingHorizontal: Spacing.md,
                  marginBottom: Spacing.sm
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} />
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.sm,
                      paddingLeft: Spacing.sm,
                      fontSize: 15,
                      color: Colors.textPrimary
                    }}
                    placeholder="Password"
                    placeholderTextColor={Colors.placeholder}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {/* Confirm Password */}
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.light,
                  borderRadius: 12,
                  paddingHorizontal: Spacing.md,
                  marginBottom: Spacing.sm
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} />
                  <TextInput
                    style={{
                      flex: 1,
                      paddingVertical: Spacing.sm,
                      paddingLeft: Spacing.sm,
                      fontSize: 15,
                      color: Colors.textPrimary
                    }}
                    placeholder="Confirmar Password"
                    placeholderTextColor={Colors.placeholder}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                {errorMessage !== "" && (
                  <Text style={{ color: Colors.danger, textAlign: "center", marginBottom: Spacing.sm }}>
                    {errorMessage}
                  </Text>
                )}

                {/* Botão Criar */}
                <Pressable
                  style={{
                    backgroundColor: Colors.primary,
                    paddingVertical: Spacing.md,
                    borderRadius: 30,
                    alignItems: "center",
                    marginTop: Spacing.sm
                  }}
                  onPress={handleSignup}
                >
                  <Text style={GlobalStyles.buttonText}>Criar</Text>
                </Pressable>

                {/* Link para login */}
                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text style={GlobalStyles.textLink}>Já tem conta? Iniciar sessão</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
