
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { auth, db } from "../../src/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function PerfilScreen({ navigation }) {
  const user = auth.currentUser;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (mounted) {
            setNome(data.nome || "");
            setEmail(data.email || user.email || "");
          }
        } else {
          // se não existir doc, criar com o email
          await setDoc(docRef, { email: user.email }, { merge: true });
          setNome("");
        }
      } catch (err) {
        console.error("Erro fetch profile:", err);
        Alert.alert("Erro", "Falha ao carregar perfil.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  async function handleSave() {
    if (!user) return Alert.alert("Erro", "Usuário não autenticado.");
    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { nome: nome, email: email }, { merge: true });
      Alert.alert("Sucesso", "Perfil atualizado.");
    } catch (err) {
      console.error("Erro salvar perfil:", err);
      Alert.alert("Erro", "Falha ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome completo" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} editable={false} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={() => { auth.signOut().then(()=> navigation.replace("Login")); }}>
        <Text style={{ color:'#D9534F' }}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#bfeec3ff' },
  title:{ fontSize:26, fontWeight:'700', marginBottom:20 },
  label:{ marginTop:10, color:'#555' },
  input:{ borderWidth:1, borderColor:'#DDD', padding:12, borderRadius:8, marginTop:6 },
  saveButton:{ backgroundColor:'#0066FF', padding:14, borderRadius:10, marginTop:20 },
  saveText:{ color:'#fff', textAlign:'center', fontWeight:'700' },
  logout:{ marginTop:20, alignItems:'center' }
});
