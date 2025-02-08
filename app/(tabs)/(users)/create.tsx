import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import UserRepository from "@/http/repository/UserRepository/UserRepository";
import { ICreateUserRequest } from "@/http/Models/Requests/User/ICreateUserRequest";
import { TypeUser } from "@/Enum/TypeUser";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import * as secure from "expo-secure-store";

const userTypes = [
  { label: "Estudante", value: "student" },
  { label: "Professor", value: "professor" },
];

export default function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);

  const router = useRouter();

  const createUser = async (request: ICreateUserRequest) => {
    const userRepository = new UserRepository();

    const result = await userRepository.CreateUserAssociation(request);

    if (result.succeeded) {
      Alert.alert("Sucesso", "Usuário criado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    Alert.alert("Erro", "Erro ao criar usuário.");
  };

  const handleCreate = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !userType
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const userAssociation = JSON.parse(
      secure.getItem("selectedInstance") ?? ""
    ) as IUserSchoolAssociation;

    const request: ICreateUserRequest = {
      username: name,
      email: email,
      password: password,
      typeUser:
        userType === "Professor" ? TypeUser.Professor : TypeUser.Student,
      admin: userType === "Professor" ? true : false,
      status: true,
      schoolId: userAssociation.school?.id!,
    };

    await createUser(request);
  };

  const renderTypeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.typeItem}
      onPress={() => {
        setUserType(item.value);
        setShowTypeModal(false);
      }}
    >
      <Text style={styles.typeItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Criar Novo Usuário</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite o nome"
          placeholderTextColor="#96989d"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o email"
          placeholderTextColor="#96989d"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Digite a senha"
          placeholderTextColor="#96989d"
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a senha"
          placeholderTextColor="#96989d"
          secureTextEntry
        />

        <Text style={styles.label}>Tipo de Usuário</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={styles.selectButtonText}>
            {userType
              ? userTypes.find((t) => t.value === userType)?.label
              : "Selecione o tipo"}
          </Text>
          <Feather name="chevron-down" size={24} color="#dcddde" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Criar Usuário</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showTypeModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={userTypes}
              renderItem={renderTypeItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTypeModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1f22",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 24,
    padding: 16,
  },
  form: {
    backgroundColor: "#2f3136",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dcddde",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#40444b",
    borderRadius: 4,
    padding: 12,
    color: "#dcddde",
    fontSize: 16,
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: "#40444b",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    color: "#dcddde",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#5865f2",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#2f3136",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxHeight: "50%",
  },
  typeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#40444b",
  },
  typeItemText: {
    color: "#dcddde",
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#40444b",
    borderRadius: 4,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
