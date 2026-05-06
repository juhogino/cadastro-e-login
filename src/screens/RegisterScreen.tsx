import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("usuario");
  const [regiao, setRegiao] = useState("Norte");

  function handleRegister() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha tudo");
      return;
    }

    Alert.alert("Sucesso", "Cadastro realizado!");
    navigation.navigate("Login");
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Cadastro</Text>

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

      <Text>Tipo de usuário:</Text>
      <Picker selectedValue={tipo} onValueChange={setTipo}>
        <Picker.Item label="Usuário" value="usuario" />
        <Picker.Item label="Prestador de Serviço" value="prestador" />
      </Picker>

      <Text>Região:</Text>
      <Picker selectedValue={regiao} onValueChange={setRegiao}>
        <Picker.Item label="Norte" value="Norte" />
        <Picker.Item label="Sul" value="Sul" />
        <Picker.Item label="Sudeste" value="Sudeste" />
        <Picker.Item label="Centro-Oeste" value="Centro-Oeste" />
        <Picker.Item label="Nordeste" value="Nordeste" />
      </Picker>

      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}