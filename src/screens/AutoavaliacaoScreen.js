
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { auth, db } from "../../src/firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";

const QUESTIONS = [
  { id: "ia", label: "Conhecimento em Inteligência Artificial" },
  { id: "sustentabilidade", label: "Conhecimento em Sustentabilidade" },
  { id: "soft", label: "Habilidades de comunicação / soft skills" },
  { id: "programacao", label: "Conhecimento em Programação" },
  { id: "gestao", label: "Noções de Gestão e Liderança" },
];

export default function AutoavaliacaoScreen() {
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const initial = {};
    QUESTIONS.forEach(q => initial[q.id] = null);
    setAnswers(initial);
  }, []);

  function setAnswer(qid, value) {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }
  function allAnswered() {
    return QUESTIONS.every(q => answers[q.id] !== null && answers[q.id] !== undefined);
  }
  async function handleSubmit() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    if (!allAnswered()) {
      Alert.alert("Atenção", "Responda todas as perguntas antes de enviar.");
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const assessmentRef = collection(db, "users", user.uid, "assessments");
      await addDoc(assessmentRef, {
        answers,
        createdAt: serverTimestamp()
      });

      const values = Object.values(answers).map(v => Number(v));
      const avg = Math.round((values.reduce((a,b)=>a+b,0) / values.length) * 10) / 10;

      await setDoc(userRef, {
        lastAssessment: {
          answers,
          avg,
          updatedAt: serverTimestamp()
        }
      }, { merge: true });

      Alert.alert("Sucesso", "Autoavaliação salva com sucesso.");
    } catch (err) {
      console.error("Erro salvar assessment:", err);
      Alert.alert("Erro", "Falha ao salvar avaliação. Veja console.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Autoavaliação</Text>
      <Text style={styles.description}>Avalie seu nível em cada competência (1 - Fraco … 5 - Excelente).</Text>

      {QUESTIONS.map(q => (
        <View key={q.id} style={styles.questionBox}>
          <Text style={styles.questionText}>{q.label}</Text>
          <View style={styles.optionsRow}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.option,
                  answers[q.id] === n && styles.optionSelected
                ]}
                onPress={() => setAnswer(q.id, n)}
              >
                <Text style={[
                  styles.optionText,
                  answers[q.id] === n && styles.optionTextSelected
                ]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, !allAnswered() && styles.disabled]}
        onPress={handleSubmit}
        disabled={!allAnswered() || saving}
      >
        <Text style={styles.submitText}>{saving ? "Salvando..." : "Enviar Autoavaliação"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#bfeec3ff', padding:20 },
  title:{ fontSize:26, fontWeight:'700', marginBottom:8 },
  description:{ color:'#666', marginBottom:16 },
  questionBox:{ marginBottom:18 },
  questionText:{ fontSize:16, marginBottom:8 },
  optionsRow:{ flexDirection:'row', justifyContent:'space-between' },
  option:{ padding:12, borderRadius:8, backgroundColor:'#EEE', width:48, alignItems:'center' },
  optionSelected:{ backgroundColor:'#5A67D8' },
  optionText:{ fontSize:16 },
  optionTextSelected:{ color:'#FFF', fontWeight:'700' },
  submitButton:{ backgroundColor:'#5A67D8', padding:14, borderRadius:10, marginTop:10 },
  submitText:{ color:'#fff', textAlign:'center', fontWeight:'700' },
  disabled:{ opacity:0.6 }
});
