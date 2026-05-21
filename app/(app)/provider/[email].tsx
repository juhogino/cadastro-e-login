import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getServices } from "@/src/storage/serviceStorage";
import { Service } from "@/src/types/Service";

export default function ProviderProfile() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((all) =>
      setServices(all.filter((s) => s.prestadorEmail === email))
    );
  }, [email]);

  const regiao = services[0]?.regiao ?? "—";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={64} color="#4A6CF7" />
        <Text style={styles.email}>{email}</Text>
        <View style={styles.regionRow}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.region}>{regiao}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Serviços oferecidos</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(app)/service/[id]",
                params: {
                  id: item.id,
                  titulo: item.titulo,
                  descricao: item.descricao,
                  categoria: item.categoria,
                  preco: item.preco,
                  telefone: item.telefone,
                  regiao: item.regiao,
                  prestadorEmail: item.prestadorEmail,
                },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <View style={styles.cardRow}>
              <Ionicons name="cash-outline" size={14} color="#64748B" />
              <Text style={styles.cardDetail}>R$ {item.preco}</Text>
              <Ionicons name="folder-outline" size={14} color="#64748B" style={{ marginLeft: 12 }} />
              <Text style={styles.cardDetail}>{item.categoria}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
          </View>
        }
      />
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
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 24,
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  region: {
    color: "#64748B",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    padding: 16,
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDetail: {
    color: "#64748B",
    fontSize: 13,
  },
  empty: {
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
  },
});
