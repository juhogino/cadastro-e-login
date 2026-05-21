import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
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

    try {
      await register({ nome, email, senha, tipo, regiao });
      router.replace("/(auth)/login");
    } catch (error: any) {
      alert(error.message ?? "Erro ao cadastrar");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Cadastro</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          style={styles.input}
          onChangeText={setSenha}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="Confirmar senha"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          style={styles.input}
          onChangeText={setConfirmar}
        />
      </View>

      <Text style={styles.label}>Tipo de conta:</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.option, tipo === "usuario" && styles.selected]}
          onPress={() => setTipo("usuario")}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={tipo === "usuario" ? "#4A6CF7" : "#334155"}
          />
          <Text style={[styles.optionText, tipo === "usuario" && styles.selectedText]}>
            Usuário
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, tipo === "prestador" && styles.selected]}
          onPress={() => setTipo("prestador")}
        >
          <Ionicons
            name="construct-outline"
            size={18}
            color={tipo === "prestador" ? "#4A6CF7" : "#334155"}
          />
          <Text style={[styles.optionText, tipo === "prestador" && styles.selectedText]}>
            Prestador
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="location-outline" size={20} color="#94A3B8" />
        <TextInput
          placeholder="Região (ex: Sudeste)"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          onChangeText={setRegiao}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Já possui uma conta? Login</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 4,
    marginTop: 40,
  },
  form: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CBD5F5",
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 10,
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
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5F5",
  },
  selected: {
    borderColor: "#4A6CF7",
    backgroundColor: "#E0E7FF",
  },
  optionText: {
    color: "#334155",
    fontWeight: "500",
  },
  selectedText: {
    color: "#4A6CF7",
    fontWeight: "600",
  },
});
