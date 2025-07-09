import { StyleSheet } from "react-native";

const Colors = {
  background: "#ffffff",
  surface: "#ffffff",
  primary: "#6b3fa0",
  secondary: "#b19cd9",
  accent: "#fd79a8",
  muted: "#dfe6e9",
  textPrimary: "#6b3fa0",
  textSecondary: "#636e72",
  success: "#00b894",
  danger: "#d63031",
  warning: "#fdcb6e",
  info: "#0984e3",
  light: "#f8f9fa",
  dark: "#2d3436",
  placeholder: "#b2bec3"
};

const Spacing = {
  xs: 2,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
};

const GlobalStyles = StyleSheet.create({
  logo: {
    width: 450,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 24
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 25,
    padding: Spacing.lg,
    width: '90%',
    maxWidth: 450,
    alignSelf: "center",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6
  },
  label: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.muted,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 14,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonDanger: {
    backgroundColor: Colors.danger,
  },
  buttonSuccess: {
    backgroundColor: Colors.success,
  },
  smallButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  smallButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: Spacing.md,
    backgroundColor: Colors.muted,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  labelBold: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  listContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  loginInput: {
    borderBottomWidth: 1,
    borderColor: Colors.muted,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg
  },
  textLink: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: 14,
    marginTop: Spacing.sm,
    textDecorationLine: 'underline'
  },
  eventCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    width: '90%',
    alignSelf: "center",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  eventCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export const LoginStyles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    paddingHorizontal: Spacing.lg
  },
  logo: {
    ...GlobalStyles.logo,
    marginBottom: Spacing.lg
  }
});

export const HomeStyles = StyleSheet.create({
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderBottomLeftRadius: Spacing.lg,
    borderBottomRightRadius: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  greetingText: {
  fontSize: 20,
  fontWeight: "600",
  color: Colors.surface,
  textAlign: "center",
  marginBottom: Spacing.xs,
  textShadowColor: '#4b2c75',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
},
  subText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  searchBox: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },
  mainContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.surface,
    textAlign: "center",
  },
  searchResults: {
    marginTop: Spacing.sm,
  },
  noResults: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
modalContent: {
  backgroundColor: Colors.surface,
  borderTopLeftRadius: Spacing.lg,
  borderTopRightRadius: Spacing.lg,
  padding: Spacing.md,
  maxHeight: '80%',
  elevation: 8,
},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    flex: 1,
  },
  modalCloseButton: {
    padding: Spacing.sm,
    position: 'absolute',
    right: Spacing.sm,
  },
  modalListContainer: {
    paddingBottom: Spacing.xl,
  },
  chatContainer: {
  paddingHorizontal: Spacing.md,
  marginBottom: Spacing.lg,
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: '#fafafa', // fundo suave para o chat
},

chatButton: {
  position: "absolute",
  bottom: 30,
  right: 20,
  backgroundColor: Colors.primary,
  width: 64,
  height: 64,
  borderRadius: 32,
  justifyContent: "center",
  alignItems: "center",
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  // efeito hover (Android ripple já no componente)
},

chatModalContent: {
  backgroundColor: "#fff",
  marginHorizontal: 20,
  marginVertical: 30,
  padding: 25,
  borderRadius: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 10,
  // para ajudar responsividade, definir maxHeight pode ser feito na View do modal
},
});

export { Colors, Spacing };
export default GlobalStyles;


      