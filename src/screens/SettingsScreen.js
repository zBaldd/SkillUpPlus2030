
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAuth, reauthenticateWithCredential, EmailAuthProvider, deleteUser, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch
} from "firebase/firestore";

const NOTIF_KEY = "@skillup_notifications_v1";

export default function SettingsScreen({ navigation }) {
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [reauthLoading, setReauthLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(NOTIF_KEY);
        setNotifEnabled(s ? JSON.parse(s) : false);
      } catch (err) {
        console.warn("load notif err", err);
      }
    })();
  }, []);

  const onToggleNotif = async (val) => {
    try {
      setNotifEnabled(val);
      await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(val));
      Alert.alert("Notificações", val ? "Notificações ativadas" : "Notificações desativadas");
    } catch (err) {
      console.warn("save notif err", err);
    }
  };

 
  async function deleteUserFirestoreData(uid) {
    
    const userDocRef = doc(db, "users", uid);

    try {
      
      const subcollections = ["assessments"]; 
      for (const sub of subcollections) {
        const colRef = collection(db, "users", uid, sub);
        const snap = await getDocs(colRef);
        const batch = writeBatch(db);
        let any = false;
        snap.forEach(d => {
          batch.delete(doc(db, "users", uid, sub, d.id));
          any = true;
        });
        if (any) await batch.commit();
      }

  
      try {
        const recsRef = collection(db, "recommendations");
        const recSnap = await getDocs(recsRef);
        const batch2 = writeBatch(db);
        let found = false;
        recSnap.forEach(d => {
          const data = d.data();
          if (data?.userId === uid) {
            batch2.delete(doc(db, "recommendations", d.id));
            found = true;
          }
        });
        if (found) await batch2.commit();
      } catch (err) {
        console.warn("Erro deletando recommendations globais:", err);
      }
      await deleteDoc(userDocRef);
    } catch (err) {
      console.warn("Erro deletando dados Firestore do usuário:", err);
      throw err;
    }
  }
  async function handleDeleteAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário autenticado.");
      return;
    }

    setLoading(true);
    try {
      const uid = user.uid;
      await deleteUserFirestoreData(uid);
      await deleteUser(user);
      try { await signOut(auth); } catch (e) { /* ignore */ }
      Alert.alert("Conta excluída", "Sua conta e dados foram removidos.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }]
      });
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      Alert.alert("Erro", "Falha ao excluir conta. Você precisa estar logado recentemente. Tente fazer login novamente e tente de novo.");
    } finally {
      setLoading(false);
    }
  }
  const confirmDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Ao confirmar, sua conta e todos os dados associados serão removidos permanentemente. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, excluir", style: "destructive", onPress: () => setShowReauthModal(true) }
      ]
    );
  };
  const reauthAndDelete = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    if (!password) {
      Alert.alert("Senha necessária", "Por favor, informe sua senha para continuar.");
      return;
    }

    setReauthLoading(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      
      setShowReauthModal(false);
      setPassword("");
      await handleDeleteAuthenticatedUser();
    } catch (err) {
      console.error("Erro reautenticando/excluindo:", err);
      
      Alert.alert("Erro", "Senha inválida ou falha na reautenticação. Tente novamente.");
    } finally {
      setReauthLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Notificações</Text>
          <Text style={styles.rowDesc}>Ativar ou desativar notificações locais/push</Text>
        </View>
        <Switch
          value={notifEnabled}
          onValueChange={onToggleNotif}
          trackColor={{ true: "#5A67D8", false: "#9CA3AF" }}
        />
      </View>

      <View style={styles.rowStatic}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>Sobre</Text>
          <Text style={styles.rowDesc}>SkillUpPlus 2030+ • versão 1.0</Text>
        </View>
        <Text style={{ color: "#666" }}>v1.0</Text>
      </View>

      <TouchableOpacity style={[styles.row, styles.deleteRow]} onPress={confirmDeleteAccount}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, { color: "#8B0000" }]}>Excluir minha conta</Text>
          <Text style={[styles.rowDesc, { color: "#8B0000" }]}>Remover permanentemente conta e dados</Text>
        </View>
      </TouchableOpacity>

      {loading && (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="small" />
          <Text style={{ color: "#000000ff", marginTop: 8 }}>Processando exclusão...</Text>
        </View>
      )}

      {/* Modal simples para pedir senha e reautenticar */}
      <Modal visible={showReauthModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalText}>Digite sua senha para confirmar a exclusão da conta.</Text>

            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
              <TouchableOpacity onPress={() => { setShowReauthModal(false); setPassword(""); }} style={{ marginRight: 12 }}>
                <Text style={{ color: "#555" }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={reauthAndDelete} disabled={reauthLoading} style={{ backgroundColor: "#8B0000", padding: 10, borderRadius: 8 }}>
                {reauthLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#bfeec3ff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  row: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "##bfeec3ff",
    borderWidth: 1,
    borderColor: "#EEE"
    
  },
  rowStatic: {
    padding: 14,
    
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#bfeec3ff",
    borderWidth: 1,
    borderColor: "#000000ff"
  },
  deleteRow: {
    backgroundColor: "#bfeec3ff",
    borderWidth: 1,
    borderRadius: 1,
    borderColor: "#ff0000ff"
  },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowDesc: { fontSize: 13, marginTop: 6, color: "#666" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "90%", backgroundColor: "#FFF", padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalText: { marginTop: 8, color: "#444" },
  input: { marginTop: 12, borderWidth: 1, borderColor: "#DDD", padding: 10 }
});
