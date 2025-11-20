
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
const MODULES_MAP = {
  ia: [
    { id: "ia-1", titulo: "Fundamentos de Inteligência Artificial", descricao: "Introdução aos conceitos básicos de IA e suas aplicações.", duracao: "20 min", nivel: "Iniciante" },
    { id: "ia-2", titulo: "Machine Learning Básico", descricao: "Como modelos aprendem a partir de dados e fazem previsões.", duracao: "25 min", nivel: "Iniciante" },
    { id: "ia-3", titulo: "Redes Neurais", descricao: "Entenda como redes neurais simulam o cérebro humano.", duracao: "30 min", nivel: "Intermediário" },
    { id: "ia-4", titulo: "Visão Computacional", descricao: "Como máquinas interpretam imagens e vídeos.", duracao: "35 min", nivel: "Intermediário" },
    { id: "ia-5", titulo: "IA Generativa", descricao: "Como modelos criam texto, imagens e sons do zero.", duracao: "45 min", nivel: "Avançado" },
  ],
  sustentabilidade: [
    { id: "sust-1", titulo: "Introdução ao ESG", descricao: "Conceitos e importância do ESG nas empresas.", duracao: "20 min", nivel: "Iniciante" },
    { id: "sust-2", titulo: "Energia Renovável", descricao: "Princípios e tecnologias de energia limpa.", duracao: "30 min", nivel: "Intermediário" },
    { id: "sust-3", titulo: "Economia Circular", descricao: "Modelos para reduzir desperdício e reaproveitar recursos.", duracao: "25 min", nivel: "Intermediário" },
    { id: "sust-4", titulo: "Sustentabilidade no Trabalho", descricao: "Práticas sustentáveis no dia-a-dia profissional.", duracao: "20 min", nivel: "Iniciante" },
  ],
  softskills: [
    { id: "soft-1", titulo: "Comunicação Eficaz", descricao: "Técnicas práticas para melhorar a comunicação.", duracao: "15 min", nivel: "Iniciante" },
    { id: "soft-2", titulo: "Trabalho em Equipe", descricao: "Colaboração, feedback e dinâmicas de grupo.", duracao: "20 min", nivel: "Iniciante" },
    { id: "soft-3", titulo: "Liderança Básica", descricao: "Fundamentos de liderança situacional.", duracao: "25 min", nivel: "Intermediário" },
    { id: "soft-4", titulo: "Gestão do Tempo", descricao: "Métodos práticos para priorizar tarefas.", duracao: "20 min", nivel: "Iniciante" },
    { id: "soft-5", titulo: "Negociação", descricao: "Táticas e preparação para negociações simples.", duracao: "30 min", nivel: "Intermediário" },
    { id: "soft-6", titulo: "Apresentações Eficazes", descricao: "Como estruturar e apresentar ideias com clareza.", duracao: "25 min", nivel: "Intermediário" },
  ]
};
export default function TrilhaDetalheScreen({ route }) {
  const trilha = route?.params?.trilha || { id: "ia", nome: "Trilha", descricao: "", modulos: 0 };
  const modulos = MODULES_MAP[trilha.id] || [];
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{trilha.nome}</Text>
      <Text style={styles.desc}>{trilha.descricao}</Text>
      <Text style={styles.modules}>Total de módulos: {trilha.modulos ?? modulos.length}</Text>

      <Text style={styles.sectionTitle}>Módulos da Trilha</Text>

      {modulos.length === 0 ? (
        <Text style={{ marginTop: 12, color: "#555" }}>Nenhum módulo cadastrado para esta trilha.</Text>
      ) : (
        modulos.map((modulo) => (
          <View key={modulo.id} style={styles.card}>
            <Text style={styles.cardTitle}>{modulo.titulo}</Text>
            <Text style={styles.cardDesc}>{modulo.descricao}</Text>
            <Text style={styles.cardInfo}>Duração: {modulo.duracao} • Nível: {modulo.nivel}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D4F7A1", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  desc: { fontSize: 15, marginTop: 8 },
  modules: { marginTop: 10, fontWeight: "700", color: "#0066FF" },
  sectionTitle: { marginTop: 20, fontSize: 20, fontWeight: "700" },
  card: { backgroundColor: "#FFFFFF", padding: 14, borderRadius: 12, marginTop: 14, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardDesc: { marginTop: 6, color: "#555" },
  cardInfo: { marginTop: 8, fontWeight: "600", color: "#333" },
});
