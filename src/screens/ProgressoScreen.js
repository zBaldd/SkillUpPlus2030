
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView
} from "react-native";
import { auth, db } from "../../src/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ProgressoScreen() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [recommendationsHistory, setRecommendationsHistory] = useState([]);

  const [aggregatedAverages, setAggregatedAverages] = useState(null);
  const [highestCompetency, setHighestCompetency] = useState(null);
  const [lowestCompetency, setLowestCompetency] = useState(null);
  const [lastAssessmentHighest, setLastAssessmentHighest] = useState(null);
  const [lastAssessmentLowest, setLastAssessmentLowest] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // busca avaliações do usuário: users/{uid}/assessments
        const assCol = collection(db, "users", user.uid, "assessments");
        const assSnap = await getDocs(assCol);
        const assList = assSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => {
            const ta = a.createdAt?.seconds ? a.createdAt.seconds : 0;
            const tb = b.createdAt?.seconds ? b.createdAt.seconds : 0;
            return ta - tb;
          });

        if (mounted) setAssessments(assList);
        try {
          const recCol = collection(db, "recommendations");
          const recSnap = await getDocs(recCol);
          const recList = recSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          if (mounted) setRecommendationsHistory(recList.filter(r => r.userId === user.uid));
        } catch (e) {

          console.warn("Não foi possível buscar recommendations history:", e);
        }

        // calcular médias agregadas por competência
        const agg = {};
        assList.forEach(a => {
          const answers = a.answers || {};
          Object.keys(answers).forEach(key => {
            const v = Number(answers[key]);
            if (!Number.isFinite(v)) return;
            if (!agg[key]) agg[key] = { sum: 0, count: 0 };
            agg[key].sum += v;
            agg[key].count += 1;
          });
        });

        const averages = {};
        Object.keys(agg).forEach(key => {
          averages[key] = Math.round((agg[key].sum / agg[key].count) * 10) / 10;
        });

        if (mounted) setAggregatedAverages(Object.keys(averages).length ? averages : null);

        if (Object.keys(averages).length) {
          const entries = Object.entries(averages);
          entries.sort((a, b) => b[1] - a[1]);
          const highest = { key: entries[0][0], avg: entries[0][1] };
          const lowest = { key: entries[entries.length - 1][0], avg: entries[entries.length - 1][1] };
          if (mounted) {
            setHighestCompetency(highest);
            setLowestCompetency(lowest);
          }
        } else {
          if (mounted) {
            setHighestCompetency(null);
            setLowestCompetency(null);
          }
        }

        if (assList.length) {
          const last = assList[assList.length - 1];
          const answers = last.answers || {};
          const kv = Object.entries(answers)
            .map(([k, v]) => ({ key: k, val: Number(v) }))
            .filter(x => Number.isFinite(x.val));
          if (kv.length) {
            kv.sort((a, b) => b.val - a.val);
            if (mounted) {
              setLastAssessmentHighest(kv[0]);
              setLastAssessmentLowest(kv[kv.length - 1]);
            }
          } else {
            if (mounted) {
              setLastAssessmentHighest(null);
              setLastAssessmentLowest(null);
            }
          }
        } else {
          if (mounted) {
            setLastAssessmentHighest(null);
            setLastAssessmentLowest(null);
          }
        }
      } catch (err) {
        console.error("Erro fetch progresso:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /></View>;

  const totalAssessments = assessments.length;

  const lastAvg = (() => {
    if (!assessments.length) return null;
    const last = assessments[assessments.length - 1];
    if (!last.answers) return null;
    const vals = Object.values(last.answers).map(v => Number(v)).filter(v => Number.isFinite(v));
    if (!vals.length) return null;
    return Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10;
  })();

  const labelForKey = (key) => {
    const map = {
      ia: "IA",
      sustentabilidade: "Sustentabilidade",
      soft: "Soft Skills",
      programacao: "Programação",
      gestao: "Gestão"
    };
    return map[key] || key;
  };

  // construir feedback simples com base em aggregatedAverages
  const feedbackMessages = (() => {
    const msgs = [];
    const source = aggregatedAverages || (() => {
      if (!assessments.length) return null;
      const last = assessments[assessments.length - 1];
      const answers = last.answers || {};
      const out = {};
      Object.keys(answers).forEach(k => { const v = Number(answers[k]); if (Number.isFinite(v)) out[k] = v; });
      return Object.keys(out).length ? out : null;
    })();

    if (!source) return msgs;

    Object.entries(source).forEach(([k, v]) => {
      if (typeof v !== "number") return;
      if (v > 4) {
        msgs.push({ key: k, type: "positive", text: `${labelForKey(k)} — Ótimo desempenho! Sua média é ${v}. Continue assim.` });
      } else if (v < 3) {
        msgs.push({ key: k, type: "improve", text: `${labelForKey(k)} — Recomendamos reforçar esta competência (média ${v}). Considere estudar mais ou revisar trilhas relacionadas.` });
      }
      
    });

    return msgs;
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Meu Progresso</Text>

      <Text style={styles.stat}>Avaliações realizadas: {totalAssessments}</Text>
      {lastAvg !== null && <Text style={styles.stat}>Última média de competências: {lastAvg}</Text>}

      <View style={{ marginTop: 14 }}>
        <Text style={styles.subTitle}>Média por competência (todas avaliações)</Text>
        {aggregatedAverages ? (
          Object.entries(aggregatedAverages).map(([k, v]) => (
            <Text key={k} style={styles.compText}>{labelForKey(k)}: {v}</Text>
          ))
        ) : (
          <Text style={{ color:'#666', marginTop:8 }}>Nenhuma avaliação salva ainda.</Text>
        )}
      </View>

      {highestCompetency && (
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Maior competência (média)</Text>
          <Text style={styles.highlightText}>{labelForKey(highestCompetency.key)} — {highestCompetency.avg}</Text>
        </View>
      )}

      {lowestCompetency && (
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Menor competência (média)</Text>
          <Text style={styles.highlightText}>{labelForKey(lowestCompetency.key)} — {lowestCompetency.avg}</Text>
        </View>
      )}

      {lastAssessmentHighest && (
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Maior competência (última avaliação)</Text>
          <Text style={styles.highlightText}>{labelForKey(lastAssessmentHighest.key)} — {lastAssessmentHighest.val}</Text>
        </View>
      )}

      {lastAssessmentLowest && (
        <View style={styles.highlight}>
          <Text style={styles.highlightTitle}>Menor competência (última avaliação)</Text>
          <Text style={styles.highlightText}>{labelForKey(lastAssessmentLowest.key)} — {lastAssessmentLowest.val}</Text>
        </View>
      )}

      <Text style={[styles.subTitle, { marginTop: 16 }]}>Feedback</Text>

      {feedbackMessages.length === 0 ? (
        <Text style={{ color:'#666', marginTop:8 }}>Sem feedback específico. Faça avaliações para receber recomendações.</Text>
      ) : (
        feedbackMessages.map(f => (
          <View key={f.key} style={[styles.feedbackCard, f.type === "positive" ? styles.positive : styles.improve]}>
            <Text style={styles.feedbackText}>{f.text}</Text>
          </View>
        ))
      )}

      

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#bfeec3ff' },
  title:{ fontSize:26, fontWeight:'700' },
  stat:{ marginTop:12, fontSize:16 },
  subTitle:{ fontSize:18, fontWeight:'700' },
  recCard:{ backgroundColor:'#F3F4F6', padding:12, borderRadius:10, marginTop:10 },
  compText:{ marginTop:6, fontSize:15 },
  highlight:{ marginTop:12, padding:12, backgroundColor:'#EEF2FF', borderRadius:10 },
  highlightTitle:{ fontWeight:'700', color:'#1E40AF' },
  highlightText:{ marginTop:6, fontSize:16, fontWeight:'700' },
  feedbackCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
  },
  positive: {
    backgroundColor: "#E6F7E6",
    borderColor: "#2E8B57",
    borderWidth: 1
  },
  improve: {
    backgroundColor: "#FFF4F4",
    borderColor: "#D9534F",
    borderWidth: 1
  },
});
