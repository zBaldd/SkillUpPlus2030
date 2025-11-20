import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo 🎓</Text>

      <Text style={styles.userText}>
        {user?.email}
      </Text>

      <View style={styles.buttonsContainer}>

        {/*  */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Trilhas")}
        >
          <Text style={styles.buttonText}>🚀 Trilhas de Aprendizado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Cursos")}
        >
          <Text style={styles.buttonText}>📚 Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Autoavaliacao")}
        >
        <Text style={styles.buttonText}>📝 Autoavaliação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Progresso")}
        >
          <Text style={styles.buttonText}>📈 Progresso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Text style={styles.buttonText}>👤 Meu Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.buttonText}>⚙️ Configurações</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          signOut(auth)
            .then(() => navigation.replace("Login"))
            .catch((error) => console.log(error));
        }}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#beee9dff",
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0a0a0aff",
    marginTop: 50,
  },
  userText: {
    fontSize: 16,
    color: "#000000ff",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 18,
  },
});
