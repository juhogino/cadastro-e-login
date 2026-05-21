import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "@/src/context/AuthContext";

function RootLayoutNav() {
  const { user } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAppGroup = segments[0] === "(app)";
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && inAppGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [user, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
