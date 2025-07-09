import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, database } from '../firebaseConfig';
import GlobalStyles, { Colors } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const styles = GlobalStyles;
  const userId = auth.currentUser?.uid;
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      try {
        const userDoc = await database.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setName(data.name || '');
          setImageUri(data.photoUrl || null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!userId) return;

    try {
      await database.collection("users").doc(userId).set({
        name: name,
        photoUrl: imageUri,
      }, { merge: true });

      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar o perfil.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
        {/* Cabeçalho */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
          <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={26} color={Colors.primary} />
          </Pressable>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: Colors.primary }}>
            Editar Perfil
          </Text>
        </View>

        {/* Avatar */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
  <Pressable onPress={pickImage}>
    {imageUri ? (
      <Image
        source={{ uri: imageUri }}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          borderWidth: 3,
          borderColor: "#fff",
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}
      />
    ) : (
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Ionicons name="camera-outline" size={28} color="#555" />
        <Text style={{ color: "#555", fontSize: 13, marginTop: 4 }}>Selecionar Imagem</Text>
      </View>
    )}
  </Pressable>

  <Pressable onPress={pickImage}>
    <Text style={{
      marginTop: 10,
      fontSize: 14,
      color: Colors.primary,
      fontWeight: "500"
    }}>
      📸 Mudar foto
    </Text>
  </Pressable>
</View>

        {/* Campo de nome */}
        <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 6 }}>
          Nome completo
        </Text>
        <TextInput
          placeholder="Digite seu nome"
          value={name}
          onChangeText={setName}
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
        />

        {/* Botão salvar */}
       <Pressable
  onPress={saveProfile}
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
  <Ionicons name="checkmark-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
    Salvar Alterações
  </Text>
</Pressable>
      </ScrollView>
    </View>
  );
}
