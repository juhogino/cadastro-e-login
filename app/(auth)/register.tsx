import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { UserType } from "@/src/types/User";

export default function Register() {
  const router = useRouter();
  const { register } = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [tipo, setTipo] = useState<UserType>("usuario");
  const [regiao, setRegiao] = useState("");

  async function handleRegister() {
    if (!nome || !email || !senha || !confirmar || !regiao) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmar) {
      alert("As senhas não coincidem");
      return;
    }

    await register({ nome, email, senha, tipo, regiao });
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        placeholder="👤 Nome"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        onChangeText={setNome}
      />

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

      <TextInput
        placeholder="🔒 Confirmar senha"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        style={styles.input}
        onChangeText={setConfirmar}
      />

      <Text style={styles.label}>Tipo de conta:</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, tipo === "usuario" && styles.selected]}
          onPress={() => setTipo("usuario")}
        >
          <Text>👤 Usuário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, tipo === "prestador" && styles.selected]}
          onPress={() => setTipo("prestador")}
        >
          <Text>🛠 Prestador</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="🌎 Região (ex: Sudeste)"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        onChangeText={setRegiao}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Já possui uma conta? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 👇 FORA DO COMPONENTE (CORRETO) */
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
  label: {
    marginBottom: 10,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  option: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5F5",
  },
  selected: {
    borderColor: "#4A6CF7",
    backgroundColor: "#E0E7FF",
  },
});