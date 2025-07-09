import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebaseConfig";
import GlobalStyles, { Colors, Spacing, HomeStyles } from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "../components/EventCard";
import { LinearGradient } from "expo-linear-gradient";

const categories = [
  { label: "🎵 Música", key: "musica", color: "#6b3fa0" },
  { label: "🍳 Culinária", key: "culinaria", color: "#6b3fa0" },
  { label: "⚽ Desporto", key: "desporto", color: "#6b3fa0" },
  { label: "💻 Tech", key: "tech", color: "#6b3fa0" },
  { label: "🎨 Arte", key: "arte", color: "#6b3fa0" },
  { label: "📚 Educação", key: "educacao", color: "#6b3fa0" },
];

export default function Home({ navigation }) {
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [nomePerfil, setNomePerfil] = useState("Utilizador");
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatEvents, setChatEvents] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const saudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const fetchEventsAndUser = async () => {
    setLoading(true);
    try {
      const snapshot = await database.collection("Events").get();
      const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(allEvents);

      if (user?.uid) {
        const userDoc = await database.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          const nome = data?.name?.trim();
          setNomePerfil(nome && nome.length > 0 ? nome : "Utilizador");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        fetchEventsAndUser();
      }
    }, [user?.uid])
  );

  const normalize = (text) => text?.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const filteredBySearch = searchTerm.length >= 2 ? events.filter(event => normalize(event.title).includes(normalize(searchTerm))) : [];
  const filteredByCategory = selectedCategory ? events.filter(event => normalize(event.category) === normalize(selectedCategory)) : [];

  const handleChatQuery = async (input) => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simula tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedInput = normalize(input);
    const now = new Date();
    let response = "";
    let foundEvents = [];

    if (normalizedInput.includes("olá") || normalizedInput.includes("oi") || normalizedInput.includes("bom dia") || normalizedInput.includes("boa tarde") || normalizedInput.includes("boa noite")) {
      response = `${saudacao()}, ${nomePerfil}! Como posso ajudar você a encontrar eventos interessantes?`;
    } else if (normalizedInput.includes("obrigado") || normalizedInput.includes("obrigada")) {
      response = "De nada! Fico feliz em ajudar. Há mais alguma coisa que gostaria de saber sobre os eventos?";
    } else if (normalizedInput.includes("lisboa")) {
      foundEvents = events.filter(e => normalize(e.location).includes("lisboa"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) em Lisboa. Aqui estão as opções disponíveis:`
        : "Não encontrei eventos em Lisboa no momento. Gostaria de verificar outras cidades?";
    } else if (normalizedInput.includes("porto")) {
      foundEvents = events.filter(e => normalize(e.location).includes("porto"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) no Porto. Veja as opções:`
        : "Não encontrei eventos no Porto no momento. Posso ajudar com outra localização?";
    } else if (normalizedInput.includes("data") || normalizedInput.includes("dia") || normalizedInput.includes("hoje")) {
      const today = new Date().toISOString().split('T')[0];
      foundEvents = events.filter(e => e.date.startsWith(today));
      response = foundEvents.length > 0 
        ? `Eventos para hoje (${today}):`
        : `Não há eventos marcados para hoje. Gostaria de ver eventos dos próximos dias?`;
    } else if (normalizedInput.includes("próximo") || normalizedInput.includes("proximo") || normalizedInput.includes("futuro")) {
      const futuros = events.filter(e => new Date(e.date) > now);
      if (futuros.length > 0) {
        const maisProximo = futuros.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        response = `O próximo evento é "${maisProximo.title}" em ${maisProximo.location}, no dia ${maisProximo.date}.`;
      } else {
        response = "Não há eventos futuros disponíveis no momento.";
      }
    } else if (normalizedInput.includes("música") || normalizedInput.includes("musica")) {
      foundEvents = events.filter(e => normalize(e.category).includes("musica"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de música:`
        : "Não há eventos de música disponíveis no momento.";
    } else if (normalizedInput.includes("desporto") || normalizedInput.includes("esporte")) {
      foundEvents = events.filter(e => normalize(e.category).includes("desporto"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de desporto:`
        : "Não há eventos de desporto disponíveis no momento.";
    } else if (normalizedInput.includes("culinária") || normalizedInput.includes("culinaria") || normalizedInput.includes("comida")) {
      foundEvents = events.filter(e => normalize(e.category).includes("culinaria"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de culinária:`
        : "Não há eventos de culinária disponíveis no momento.";
    } else if (normalizedInput.includes("tech") || normalizedInput.includes("tecnologia")) {
      foundEvents = events.filter(e => normalize(e.category).includes("tech"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de tecnologia:`
        : "Não há eventos de tecnologia disponíveis no momento.";
    } else if (normalizedInput.includes("arte")) {
      foundEvents = events.filter(e => normalize(e.category).includes("arte"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de arte:`
        : "Não há eventos de arte disponíveis no momento.";
    } else if (normalizedInput.includes("educação") || normalizedInput.includes("educacao")) {
      foundEvents = events.filter(e => normalize(e.category).includes("educacao"));
      response = foundEvents.length > 0 
        ? `Encontrei ${foundEvents.length} evento(s) de educação:`
        : "Não há eventos de educação disponíveis no momento.";
    } else if (normalizedInput.includes("ajuda") || normalizedInput.includes("help")) {
      response = "Posso ajudar você a encontrar eventos de várias formas:\n\n• Por localização: \"eventos em Lisboa\" ou \"eventos no Porto\"\n• Por data: \"eventos hoje\" ou \"próximos eventos\"\n• Por categoria: \"eventos de música\", \"eventos de desporto\", etc.\n\nO que gostaria de procurar?";
    } else {
      response = "Não entendi completamente sua pergunta. Posso ajudar você a encontrar eventos por:\n\n• Localização (Lisboa, Porto)\n• Data (hoje, próximos)\n• Categoria (música, desporto, culinária, tech, arte, educação)\n\nTente reformular sua pergunta ou digite \"ajuda\" para mais informações.";
    }

    setIsTyping(false);
    const botMessage = { type: 'bot', text: response, events: foundEvents, timestamp: new Date() };
    setChatHistory(prev => [...prev, botMessage]);
    setChatEvents(foundEvents);
  };

  const renderChatMessage = ({ item }) => (
    <View style={{
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start'
    }}>
      {item.type === 'bot' && (
        <View style={{
          backgroundColor: '#9c27b0',
          borderRadius: 20,
          padding: 8,
          marginRight: 10,
          elevation: 2,
        }}>
          <Ionicons name="hardware-chip" size={20} color="white" />
        </View>
      )}
      <View style={{
        backgroundColor: item.type === 'user' ? '#9c27b0' : '#f5f5f5',
        borderRadius: 15,
        padding: 12,
        maxWidth: '75%',
        elevation: 1,
      }}>
        <Text style={{
          color: item.type === 'user' ? 'white' : Colors.textPrimary,
          fontSize: 16,
          lineHeight: 22,
        }}>
          {item.text}
        </Text>
        {item.events && item.events.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <FlatList
              data={item.events}
              keyExtractor={(event) => event.id}
              renderItem={renderEvento}
              scrollEnabled={false}
              nestedScrollEnabled
            />
          </View>
        )}
      </View>
      {item.type === 'user' && (
        <View style={{
          backgroundColor: '#e3f2fd',
          borderRadius: 20,
          padding: 8,
          marginLeft: 10,
          elevation: 2,
        }}>
          <Ionicons name="person" size={20} color="#2196f3" />
        </View>
      )}
    </View>
  );

  const renderEvento = useCallback(({ item }) => (
    <EventCard item={item} onPress={() => {
      setShowCategoryModal(false);
      setShowChat(false);
      navigation.navigate("EventDetails", { event: item });
    }} />
  ), [navigation]);

  const clearChat = () => {
    setChatHistory([]);
    setChatEvents([]);
    setChatResponse("");
  };

  return (
    <LinearGradient colors={[Colors.light, Colors.background]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
              <View style={[HomeStyles.header, { backgroundColor: Colors.primary }]}>
                <View style={HomeStyles.headerContent}>
                  <Text style={HomeStyles.greetingText}>{saudacao()}, {nomePerfil}!</Text>
                  <Text style={HomeStyles.subText}>o que vais explorar hoje?</Text>
                  <View style={HomeStyles.searchBox}>
                    <Ionicons name="search" size={20} color={Colors.placeholder} style={HomeStyles.searchIcon} />
                    <TextInput placeholder="Buscar eventos..." placeholderTextColor={Colors.placeholder} value={searchTerm} onChangeText={(text) => { setSearchTerm(text); setSelectedCategory(null); }} style={HomeStyles.searchInput} />
                  </View>
                </View>
              </View>
              <View style={HomeStyles.mainContent}>
                {searchTerm.length >= 2 ? (
                  <View style={HomeStyles.searchResults}>
                    {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : filteredBySearch.length === 0 ? <Text style={HomeStyles.noResults}>Nenhum evento encontrado para "{searchTerm}"</Text> : <FlatList data={filteredBySearch} keyExtractor={(item) => item.id} renderItem={renderEvento} scrollEnabled nestedScrollEnabled contentContainerStyle={HomeStyles.listContainer} />}
                  </View>
                ) : (
                  <>
                    <Text style={HomeStyles.sectionTitle}>Explore por Categorias</Text>
                    <View style={HomeStyles.categoryGrid}>
                      {categories.map((cat) => (
                        <Pressable key={cat.key} onPress={() => { setSelectedCategory(cat.key); setShowCategoryModal(true); }} style={({ pressed }) => [HomeStyles.categoryCard, { backgroundColor: cat.color, opacity: pressed ? 0.8 : 1, transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }] }]}>
                          <Text style={HomeStyles.categoryText}>{cat.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <Pressable onPress={logout} style={({ pressed }) => [HomeStyles.logoutButton, { opacity: pressed ? 0.8 : 1, transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }], alignSelf: "center", marginBottom: Spacing.xxl }]}>
                      <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 2 }} />
                      <Text style={HomeStyles.logoutText}>Sair da conta</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </ScrollView>
            
            {/* Modal de categoria */}
            <Modal visible={showCategoryModal} animationType="slide" transparent onRequestClose={() => setShowCategoryModal(false)}>
              <View style={HomeStyles.modalOverlay}>
                <View style={HomeStyles.modalContent}>
                  <View style={HomeStyles.modalHeader}>
                    <Text style={HomeStyles.modalTitle}>{categories.find((c) => c.key === selectedCategory)?.label}</Text>
                    <Pressable onPress={() => setShowCategoryModal(false)} style={HomeStyles.modalCloseButton}>
                      <Ionicons name="close" size={24} color={Colors.textSecondary} />
                    </Pressable>
                  </View>
                  {loading ? <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: Spacing.lg }} /> : filteredByCategory.length === 0 ? <Text style={HomeStyles.noResults}>Nenhum evento disponível nesta categoria</Text> : <FlatList data={filteredByCategory} keyExtractor={(item) => item.id} renderItem={renderEvento} scrollEnabled nestedScrollEnabled contentContainerStyle={HomeStyles.modalListContainer} showsVerticalScrollIndicator={false} />}
                </View>
              </View>
            </Modal>
            
            {/* Botão Chatbot  */}
            <Pressable 
              onPress={() => setShowChat(true)} 
              style={({ pressed }) => ({ 
                position: "absolute", 
                bottom: 30, 
                right: 20, 
                backgroundColor: pressed ? "#7b1fa2" : "#9c27b0", 
                paddingHorizontal: 20, 
                paddingVertical: 14, 
                borderRadius: 30, 
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }]
              })}
            >
              <Ionicons name="hardware-chip" size={24} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Assistente IA</Text>
            </Pressable>

            {/* Modal Chatbot Profissional */}
            <Modal visible={showChat} transparent animationType="slide">
              <View style={[HomeStyles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                <View style={{
                  height: "85%",
                  width: "95%",
                  marginHorizontal: "2.5%",
                  marginTop: "10%",
                  borderRadius: 20,
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  elevation: 10,
                }}>
                  
                  {/* Header Profissional */}
                  <LinearGradient
                    colors={['#9c27b0', '#7b1fa2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      padding: 20,
                      paddingTop: 25,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 25,
                        padding: 10,
                        marginRight: 15
                      }}>
                        <Ionicons name="hardware-chip" size={28} color="white" />
                      </View>
                      <View>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: 'white' }}>
                          Assistente IA
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                          {isTyping ? "Digitando..." : "Online • Pronto para ajudar"}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Pressable
                        onPress={clearChat}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 20,
                          padding: 8,
                          marginRight: 10
                        }}
                      >
                        <Ionicons name="refresh" size={20} color="white" />
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setShowChat(false);
                          setChatResponse("");
                          setChatEvents([]);
                        }}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 20,
                          padding: 8
                        }}
                      >
                        <Ionicons name="close" size={20} color="white" />
                      </Pressable>
                    </View>
                  </LinearGradient>
                  
                  {/* Área de Conversa */}
                  <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
                    {chatHistory.length === 0 ? (
                      <View style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        padding: 30
                      }}>
                        <View style={{
                          backgroundColor: '#e8f5e8',
                          borderRadius: 50,
                          padding: 20,
                          marginBottom: 20
                        }}>
                          <Ionicons name="hardware-chip" size={40} color="#4caf50" />
                        </View>
                        <Text style={{ 
                          fontSize: 18, 
                          fontWeight: 'bold', 
                          color: Colors.textPrimary,
                          textAlign: 'center',
                          marginBottom: 10
                        }}>
                          Olá! Sou o seu assistente IA
                        </Text>
                        <Text style={{ 
                          fontSize: 14, 
                          color: Colors.textSecondary,
                          textAlign: 'center',
                          lineHeight: 20
                        }}>
                          Posso ajudar você a encontrar eventos por localização, data ou categoria.
                          {'\n\n'}Digite sua pergunta abaixo para começar!
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={chatHistory}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderChatMessage}
                        contentContainerStyle={{ padding: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => isTyping ? (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15
                          }}>
                            <View style={{
                              backgroundColor: '#9c27b0',
                              borderRadius: 20,
                              padding: 8,
                              marginRight: 10
                            }}>
                              <Ionicons name="hardware-chip" size={20} color="white" />
                            </View>
                            <View style={{
                              backgroundColor: '#f5f5f5',
                              borderRadius: 15,
                              padding: 15,
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}>
                              <ActivityIndicator size="small" color="#9c27b0" />
                              <Text style={{ 
                                marginLeft: 10,
                                color: Colors.textSecondary,
                                fontStyle: 'italic'
                              }}>
                                Digitando...
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      />
                    )}
                  </View>

                  {/* Área de Input Profissional */}
                  <View style={{
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    padding: 15,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f5f5f5',
                      borderRadius: 25,
                      paddingHorizontal: 15,
                      paddingVertical: 12
                    }}>
                      <Ionicons name="chatbubble-outline" size={20} color="#9c27b0" style={{ marginRight: 10 }} />
                      <TextInput
                        placeholder="Digite sua pergunta e pressione Enter..."
                        placeholderTextColor={Colors.placeholder}
                        value={chatInput}
                        onChangeText={setChatInput}
                        style={{
                        flex: 1,
                        fontSize: 16,
                        color: Colors.textPrimary,
                        maxHeight: 100,
                     }}
                      returnKeyType="send"
                      enablesReturnKeyAutomatically={true}
                      onSubmitEditing={() => {
                      if (chatInput.trim()) {
                     handleChatQuery(chatInput);
                    setChatInput("");
                    Keyboard.dismiss();
                     }
                  }}
                    blurOnSubmit={false}
                    multiline={false} 
                  maxLength={500}
                    />
                    </View>
                    <Pressable
                      onPress={() => {
                        if (chatInput.trim()) {
                          handleChatQuery(chatInput);
                          setChatInput("");
                        }
                      }}
                      style={({ pressed }) => ({
                        backgroundColor: pressed ? "#7b1fa2" : "#9c27b0",
                        borderRadius: 25,
                        padding: 12,
                        marginLeft: 10,
                        elevation: 3,
                        opacity: chatInput.trim() ? 1 : 0.5
                      })}
                      disabled={!chatInput.trim()}
                    >
                      <Ionicons name="send" size={20} color="white" />
                    </Pressable>
                  </View>

                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}