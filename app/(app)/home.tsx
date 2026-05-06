import { View, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/src/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#F9FAFB" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Olá 👋
      </Text>

      <View style={{
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 16,
        marginTop: 20
      }}>
        <Text>Email: {user?.email}</Text>
        <Text>Tipo: {user?.tipo}</Text>
        <Text>Região: {user?.regiao}</Text>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#EF4444",
          padding: 14,
          borderRadius: 12,
          alignItems: "center"
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: "#FFF" }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}