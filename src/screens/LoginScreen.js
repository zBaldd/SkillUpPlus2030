import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../../src/firebase/firebaseConfig";

export default function LoginScreen({ navigation }) {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const logo = require("../../assets/SkillUpPlus2030+.png");

  function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha!");
      return;
    }
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        navigation.replace("Tabs");
      })
      .catch(() => {
        Alert.alert("Erro", "Email ou senha inválidos.");
      });
  }
  return (
    <View style={styles.container}>
      
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Bem-vindo de volta!</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Criar Conta</Text>
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
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
