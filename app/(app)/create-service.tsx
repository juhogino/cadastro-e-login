import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "@/src/context/AuthContext";
import { saveService } from "@/src/storage/serviceStorage";

const CATEGORIES = [
  { id: "Limpeza",     label: "Limpeza",     icon: "sparkles-outline"           as const },
  { id: "Elétrica",   label: "Elétrica",    icon: "flash-outline"              as const },
  { id: "Beleza",     label: "Beleza",      icon: "cut-outline"                as const },
  { id: "Hidráulica", label: "Hidráulica",  icon: "water-outline"              as const },
  { id: "Pintura",    label: "Pintura",     icon: "color-palette-outline"      as const },
  { id: "Reforma",    label: "Reforma",     icon: "construct-outline"          as const },
  { id: "Jardinagem", label: "Jardinagem",  icon: "leaf-outline"               as const },
  { id: "Outros",     label: "Outros",      icon: "ellipsis-horizontal-outline" as const },
];

export default function CreateService() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [categoriaCustom, setCategoriaCustom] = useState("");
  const [preco, setPreco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  function getCategoriaFinal(): string {
    if (!categoriaSelecionada) return "";
    if (categoriaSelecionada === "Outros") {
      return categoriaCustom.trim() || "Outros";
    }
    return categoriaSelecionada;
  }

  async function handleCreate() {
    const categoria = getCategoriaFinal();

    if (!titulo || !descricao || !categoria || !preco || !telefone) {
      alert("Preencha todos os campos, incluindo a categoria");
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastro de Serviço</Text>

        <TextInput
          placeholder="Título do serviço"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          onChangeText={setTitulo}
          value={titulo}
        />

        <TextInput
          placeholder="Descrição"
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.inputMultiline]}
          onChangeText={setDescricao}
          value={descricao}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Seletor de categoria */}
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => {
            const isActive = categoriaSelecionada === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => {
                  setCategoriaSelecionada(cat.id);
                  if (cat.id !== "Outros") setCategoriaCustom("");
                }}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={isActive ? "#4A6CF7" : "#64748B"}
                />
                <Text
                  style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Campo livre quando "Outros" está selecionado */}
        {categoriaSelecionada === "Outros" && (
          <TextInput
            placeholder="Descreva a categoria (ex: Marcenaria)"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            onChangeText={setCategoriaCustom}
            value={categoriaCustom}
          />
        )}

        <TextInput
          placeholder="Preço (ex: 150.00)"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          keyboardType="decimal-pad"
          onChangeText={setPreco}
          value={preco}
        />

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={setTelefone}
          value={telefone}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar Serviço</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 4,
    marginTop: 40,
    marginBottom: 4,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    color: "#1E293B",
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CBD5F5",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryBtnActive: {
    borderColor: "#4A6CF7",
    backgroundColor: "#E0E7FF",
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  categoryLabelActive: {
    color: "#4A6CF7",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
