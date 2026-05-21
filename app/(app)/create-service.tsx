import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "@/src/context/AuthContext";
import { saveService } from "@/src/storage/serviceStorage";

export default function CreateService() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [telefone, setTelefone] = useState("");

  async function handleCreate() {
    if (!titulo || !descricao || !categoria || !preco || !telefone) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await saveService({
        titulo,
        descricao,
        categoria,
        preco,
        telefone,
        regiao: user?.regiao ?? "",
        prestadorEmail: user?.email ?? "",
      });

      alert("Serviço cadastrado com sucesso");
      router.replace("/(app)/services");
    } catch (error: any) {
      alert(error.message ?? "Erro ao cadastrar serviço");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View style={styles.form}>
      <Text style={styles.title}>Cadastro de Serviço</Text>

      <TextInput
        placeholder="Título do serviço"
        style={styles.input}
        onChangeText={setTitulo}
        value={titulo}
      />

      <TextInput
        placeholder="Descrição"
        style={styles.input}
        onChangeText={setDescricao}
        value={descricao}
      />

      <TextInput
        placeholder="Categoria"
        style={styles.input}
        onChangeText={setCategoria}
        value={categoria}
      />

      <TextInput
        placeholder="Preço"
        style={styles.input}
        keyboardType="decimal-pad"
        onChangeText={setPreco}
        value={preco}
      />

      <TextInput
        placeholder="Telefone"
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={setTelefone}
        value={telefone}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Cadastrar Serviço</Text>
      </TouchableOpacity>
      </View>
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
    flex: 1,
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
  },
  button: {
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
