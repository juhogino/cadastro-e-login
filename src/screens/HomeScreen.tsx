import React from "react";
import { View, Text } from "react-native";

export default function HomeScreen({ route }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Bem-vindo!</Text>
      <Text>Email: {route.params.email}</Text>
    </View>
  );
}