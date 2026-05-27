import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
