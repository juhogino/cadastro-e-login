import { Stack } from "expo-router";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

function Routes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="(app)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
