import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getServices } from "@/src/storage/serviceStorage";
import { Service } from "@/src/types/Service";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  async function loadServices() {
    const data = await getServices();
    setServices(data);
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Serviços Disponíveis
      </Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.titulo}</Text>
            <Text style={styles.description}>{item.descricao}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="folder-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.categoria}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>R$ {item.preco}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.telefone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.regiao}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={15} color="#64748B" />
              <Text style={styles.detail}>{item.prestadorEmail}</Text>
            </View>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
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
});
