import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getServices } from "@/src/storage/serviceStorage";
import { Service } from "@/src/types/Service";

export default function Services() {
  const router = useRouter();
  const { query: queryParam, categoria: categoriaParam } =
    useLocalSearchParams<{ query?: string; categoria?: string }>();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(queryParam ?? "");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getServices()
        .then((data) => { if (active) setServices(data); })
        .catch(() => {})
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [])
  );

  const servicosFiltrados = services.filter((s) => {
    const matchQuery = busca.trim()
      ? s.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        s.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        s.categoria.toLowerCase().includes(busca.toLowerCase())
      : true;
    const matchCategoria = categoriaParam
      ? s.categoria.toLowerCase() === categoriaParam.toLowerCase()
      : true;
    return matchQuery && matchCategoria;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {categoriaParam ? categoriaParam : "Serviços Disponíveis"}
      </Text>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar serviços..."
          placeholderTextColor="#94A3B8"
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#4A6CF7" style={{ marginTop: 40 }} />
      ) : (
      <FlatList
        data={servicosFiltrados}
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
            <Text style={styles.emptyText}>Nenhum serviço encontrado</Text>
          </View>
        }
      />
      )}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5F5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    paddingVertical: 0,
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
