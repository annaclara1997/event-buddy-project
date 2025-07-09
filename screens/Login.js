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
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "../services/firebaseAuth";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles, { Colors, Spacing } from "../styles/GlobalStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      navigation.navigate("Home");
    } catch (error) {
      setErrorMessage("Email ou password inválidos.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Imagem de background */}
      <Image
        source={require("../assets/background.jpg")} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />

    
      <LinearGradient
        colors={["rgba(94, 44, 165, 0.6)", "rgba(142, 68, 173, 0.9)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.backgroundImage}
      />

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
                  resizeMode: "contain",
                }}
              />
              <View style={{ marginTop: -Spacing.sm }}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Bem-vindo de volta!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#e0d6f5",
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  Conecte-se para descobrir eventos incríveis perto de você
                </Text>
              </View>
            </View>

            {/* Formulário */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: Spacing.lg,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 6,
                marginTop: Spacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: Colors.primary,
                  marginBottom: Spacing.md,
                  textAlign: "center",
                }}
              >
                Login
              </Text>

              {/* Email */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.light,
                  borderRadius: 12,
                  paddingHorizontal: Spacing.md,
                  marginBottom: Spacing.sm,
                }}
              >
                <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: Spacing.sm,
                    paddingLeft: Spacing.sm,
                    fontSize: 15,
                    color: Colors.textPrimary,
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.light,
                  borderRadius: 12,
                  paddingHorizontal: Spacing.md,
                  marginBottom: Spacing.sm,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.primary}
                />
                <TextInput
                  style={{
                    flex: 1,
                    paddingVertical: Spacing.sm,
                    paddingLeft: Spacing.sm,
                    fontSize: 15,
                    color: Colors.textPrimary,
                  }}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Erro */}
              {errorMessage !== "" && (
                <Text
                  style={{
                    color: Colors.danger,
                    textAlign: "center",
                    marginBottom: Spacing.sm,
                  }}
                >
                  {errorMessage}
                </Text>
              )}

              {/* Botão */}
              <Pressable
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: Spacing.md,
                  borderRadius: 30,
                  alignItems: "center",
                  marginTop: Spacing.sm,
                }}
                onPress={handleLogin}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  Entrar
                </Text>
              </Pressable>

              {/* Links */}
              <Pressable onPress={() => navigation.navigate("RecoveryPassword")}>
                <Text style={GlobalStyles.textLink}>Esqueci a password</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text style={GlobalStyles.textLink}>Não tem conta? Registe-se</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});
