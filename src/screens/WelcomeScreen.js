import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from "react-native";

export default function WelcomeScreen({ navigation }) {
  const logo = require("../../assets/SkillUpPlus2030+.png");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5A67D8" />
      <View style={styles.topSpace} />

      <Image source={logo} style={styles.logo} resizeMode="contain" accessibilityLabel="Logo SkillUpPlus2030+" />

      <Text style={styles.title}>SkillUpPlus 2030+</Text>
      <Text style={styles.subtitle}>Requalificação digital - Microcursos, Evolução profissional e pessoal.</Text>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.primaryText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryText}>Criar Conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>ODS 4 • ODS 8 • ODS 10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A67D8",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topSpace: {
    height: 10,
    width: "100%",
  },
  logo: {
    width: 220,
    height: 220,
    marginTop: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#E6E6FA",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  buttons: {
    width: "100%",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: {
    color: "#5A67D8",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  footer: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
