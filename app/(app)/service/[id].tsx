import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/src/context/AuthContext";

export default function ServiceDetail() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const { id, titulo, descricao, categoria, preco, telefone, regiao, prestadorEmail } =
    useLocalSearchParams<{
      id: string;
      titulo: string;
      descricao: string;
      categoria: string;
      preco: string;
      telefone: string;
      regiao: string;
      prestadorEmail: string;
    }>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.description}>{descricao}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="folder-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.value}>{categoria}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Preço</Text>
          <Text style={styles.value}>R$ {preco}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{telefone}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Região</Text>
          <Text style={styles.value}>{regiao}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() =>
          router.push({
            pathname: "/(app)/provider/[email]",
            params: { email: prestadorEmail },
          })
        }
      >
        <Ionicons name="person-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Ver Perfil do Prestador</Text>
      </TouchableOpacity>

      {user?.tipo === "usuario" && (
        <TouchableOpacity
          style={styles.contractButton}
          onPress={() =>
            router.push({
              pathname: "/(app)/contract/[serviceId]",
              params: { serviceId: id, titulo, prestadorEmail, preco },
            })
          }
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Contratar Serviço</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 4,
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 24,
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 20,
    gap: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    color: "#64748B",
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "600",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    padding: 16,
    borderRadius: 30,
    marginBottom: 12,
  },
  contractButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
