import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getServices } from "@/src/storage/serviceStorage";
import { Service } from "@/src/types/Service";

export default function Services() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);

  useFocusEffect(
    useCallback(() => {
      getServices().then(setServices);
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.title}>Serviços Disponíveis</Text>

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
            <Text style={styles.name}>{item.titulo}</Text>
            <Text style={styles.description} numberOfLines={2}>{item.descricao}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="folder-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.categoria}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>R$ {item.preco}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.regiao}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1E3A8A",
  },
  description: {
    color: "#334155",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detail: {
    color: "#334155",
    fontSize: 14,
  },
  empty: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
  },
});
