
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GEMINI_API_KEY } from "../secrets";

const MODEL_NAME = "models/gemini-2.0-flash-001";

async function callGenerateContent(promptText) {
  const url = `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 512 }
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return await res.json();
}

function cleanCodeFences(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();
}

function extractJsonArrayFromText(text) {
  if (!text || typeof text !== "string") return null;
 
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { /*ignora */ }

  
  const match = text.match(/(\[[\s\S]*\])/m);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      
      return { partial: match[1] };
    }
  }
  return null;
}

export default function CursosScreen() {
  const [area, setArea] = useState("Inteligência Artificial");
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function tryCompleteTruncatedJson(partialJson) {
   
    const prompt = `
O texto JSON abaixo foi cortado. Complete o JSON para que seja um array válido e retorne APENAS o array JSON (nada mais, sem explicações), preservando os objetos já existentes. Texto parcial:
${partialJson}
    `.trim();

    const data = await callGenerateContent(prompt);
    console.log("CONTINUE RAW RESPONSE:", JSON.stringify(data, null, 2));

    // extrair texto de resposta
    let text = null;
    if (data?.candidates?.[0]?.content?.parts) {
      const parts = data.candidates[0].content.parts;
      text = parts.map(p => (typeof p === "string" ? p : p.text)).join("\n");
    } else if (data?.candidates?.[0]?.content) {
      text = data.candidates[0].content;
    } else {
      text = JSON.stringify(data);
    }
    text = cleanCodeFences(text);

   
    const arr = extractJsonArrayFromText(text);
    if (Array.isArray(arr)) return arr;
   
    if (arr && arr.partial) {
      try {
        return JSON.parse(arr.partial);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async function gerarCursos() {
    setLoading(true);
    setCursos([]);

    const prompt = `
Gere 5 microcursos curtos e práticos para a área "${area}".
Retorne EXCLUSIVAMENTE um JSON array no formato:
[
  { "id":"string", "titulo":"string", "descricao":"string curta", "duracao":"ex: 15 min", "nivel":"Iniciante|Intermediário|Avançado" }
]
Sem texto adicional, sem markdown, apenas o array JSON.
`.trim();

    try {
      const data = await callGenerateContent(prompt);
      console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

      // extrair texto
      let text = null;
      if (data?.candidates?.[0]?.content?.parts) {
        const parts = data.candidates[0].content.parts;
        text = parts.map(p => (typeof p === "string" ? p : p.text)).join("\n");
      } else if (data?.candidates?.[0]?.content) {
        text = data.candidates[0].content;
      } else {
        text = JSON.stringify(data);
      }

      text = cleanCodeFences(text);
      console.log("EXTRACTED TEXT:", text);

      
      let arrOrResult = extractJsonArrayFromText(text);

      
      if (arrOrResult && arrOrResult.partial) {
        console.warn("JSON parcial detectado. Tentando completar via nova chamada à API...");
        const completed = await tryCompleteTruncatedJson(arrOrResult.partial);
        if (!completed) {
          Alert.alert("Erro", "Resposta da IA foi cortada e não pôde ser completada automaticamente.");
          setLoading(false);
          return;
        }
        setCursos(completed);
        setLoading(false);
        return;
      }

      if (!arrOrResult || !Array.isArray(arrOrResult)) {
        Alert.alert("Erro", "Não foi possível converter resposta em JSON. Veja console.");
        setLoading(false);
        return;
      }

      
      const normalized = arrOrResult.map((it, idx) => ({
        id: it.id || `r-${Date.now()}-${idx}`,
        titulo: it.titulo || it.title || `Curso ${idx + 1}`,
        descricao: it.descricao || it.description || "",
        duracao: it.duracao || it.duration || "15 min",
        nivel: it.nivel || it.level || "Iniciante"
      }));

      setCursos(normalized);

    } catch (err) {
      console.error("ERRO GEMINI:", err);
      Alert.alert("Erro", "Falha ao chamar a API Gemini. Veja console para detalhes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Cursos Recomendados</Text>

      <Text style={styles.label}>Selecione a área:</Text>

      <View style={styles.pickerWrap}>
        <Picker selectedValue={area} onValueChange={setArea}>
          <Picker.Item label="Inteligência Artificial" value="Inteligência Artificial" />
          <Picker.Item label="Sustentabilidade" value="Sustentabilidade" />
          <Picker.Item label="Soft Skills" value="Soft Skills" />
          <Picker.Item label="Gestão e Liderança" value="Gestão e Liderança" />
          <Picker.Item label="Programação" value="Programação" />
          <Picker.Item label="Cibersegurança" value="Cibersegurança" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={gerarCursos} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Gerando..." : "Gerar Recomendações"}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" />}

      {cursos.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.cardTitle}>{c.titulo}</Text>
          <Text style={styles.cardText}>⏳ {c.duracao} • ⭐ {c.nivel}</Text>
          <Text style={styles.cardDesc}>{c.descricao}</Text>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#beee9dff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  pickerWrap: { backgroundColor: "#FFF", borderRadius: 12, marginBottom: 20 },
  button: { backgroundColor: "#5A67D8", padding: 15, borderRadius: 12, marginBottom: 20 },
  buttonText: { color: "#FFF", fontSize: 16, textAlign: "center" },
  card: { backgroundColor: "#F3F4F6", padding: 16, borderRadius: 12, marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: "bold" },
  cardText: { marginTop: 6, color: "#444" },
  cardDesc: { marginTop: 10, color: "#222" }
});
