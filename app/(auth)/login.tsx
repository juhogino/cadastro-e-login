import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { verifyUser } from "@/src/storage/authStorage";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    const user = await verifyUser(email, senha);

    if (!user) {
      alert("E-mail ou senha incorretos");
      return;
    }

    login(user);
    router.replace("/(app)/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="📧 E-mail"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="🔒 Senha"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        style={styles.input}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>
          Não possui conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* 👇 SEMPRE NO FINAL DO ARQUIVO */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    color: "#000",
  },
  button: {
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#4A6CF7",
    textAlign: "center",
    marginTop: 20,
  },
});