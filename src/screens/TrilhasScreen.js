
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const trilhas = [
  {
    id: "ia",
    nome: "Inteligência Artificial",
    descricao: "Comece com IA, Machine Learning e uso prático.",
    modulos: 5,
  },
  {
    id: "sustentabilidade",
    nome: "Sustentabilidade",
    descricao: "Aprenda sobre ESG, energia limpa e futuro verde.",
    modulos: 4,
  },
  {
    id: "softskills",
    nome: "Soft Skills",
    descricao: "Desenvolva comunicação, liderança e carreira.",
    modulos: 6,
  },
];

export default function TrilhasScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trilhas de Aprendizado</Text>

      {trilhas.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={styles.card}
          onPress={() => navigation.navigate("TrilhaDetalhe", { trilha: t })}
        >
          <Text style={styles.cardTitle}>{t.nome}</Text>
          <Text style={styles.cardDesc}>{t.descricao}</Text>
          <Text style={styles.cardModulos}>{t.modulos} módulos</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#beee9dff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  cardDesc: {
    fontSize: 14,
    marginTop: 6,
    color: "#444",
  },
  cardModulos: {
    marginTop: 10,
    fontWeight: "600",
    color: "#0066FF",
  },
});
