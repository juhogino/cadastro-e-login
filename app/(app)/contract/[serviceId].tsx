import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Contract() {
  const router = useRouter();
  const { titulo, prestadorEmail, preco } = useLocalSearchParams<{
    serviceId: string;
    titulo: string;
    prestadorEmail: string;
    preco: string;
  }>();

  const [contratado, setContratado] = useState(false);

  if (contratado) {
    return (
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
        <Text style={styles.successTitle}>Serviço contratado!</Text>
        <Text style={styles.successText}>
          Sua solicitação foi enviada para {prestadorEmail}. Aguarde o contato do prestador.
        </Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(app)/home")}
        >
          <Text style={styles.buttonText}>Voltar para o início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.title}>Confirmar Contratação</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="construct-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Serviço</Text>
          <Text style={styles.value}>{titulo}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="person-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Prestador</Text>
          <Text style={styles.value}>{prestadorEmail}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="cash-outline" size={18} color="#64748B" />
          <Text style={styles.label}>Valor</Text>
          <Text style={styles.value}>R$ {preco}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={() => setContratado(true)}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Confirmar Contratação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 56,
    left: 24,
    padding: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 32,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 20,
    gap: 16,
    marginBottom: 32,
    width: "100%",
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
    flexShrink: 1,
    textAlign: "right",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    width: "100%",
  },
  homeButton: {
    backgroundColor: "#4A6CF7",
    padding: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginTop: 20,
    marginBottom: 12,
  },
  successText: {
    color: "#475569",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
});
