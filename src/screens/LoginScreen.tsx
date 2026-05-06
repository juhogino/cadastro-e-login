import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<any>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    navigation.navigate("Home", { email });
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        onChangeText={setSenha}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Entrar" onPress={handleLogin} />

      <Button
        title="Cadastrar"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}