import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "../../src/firebase/firebaseConfig";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const logo = require("../../assets/SkillUpPlus2030+.png");

  function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          nome,
          email,
          criadoEm: new Date()
        });

        Alert.alert("Sucesso!", "Conta criada com sucesso.");
        navigation.replace("Tabs");
      })
      .catch(() => {
        Alert.alert("Erro", "Falha ao criar conta.");
      });
  }
  return (
    <View style={styles.container}>

      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: '#999',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5A67D8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    fontSize: 15,
    color: '#5A67D8',
    fontWeight: '600',
  },
});
